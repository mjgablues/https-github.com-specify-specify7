from django.db import connection
from django.db.models import F

def node_in_parent(parent_nn, parent_hcnn):
    return (
        f"nodenumber <> {parent_nn} and"
        f"(nodenumber between {parent_nn} and {parent_hcnn})"
    ).format(
        parent_nn=parent_nn,
        parent_hcnn=parent_hcnn
    )
def get_initial_gap(node, tree):
    cursor = connection.cursor()
    sql_str = (
        "select min(nodenumber) "
        "from {tree} "
        "where {node_in_parent}"
    ).format(
        tree=tree,
        node_in_parent = node_in_parent(node.nodenumber,
                                        node.highestchildnodenumber
                                        )
    )
    cursor.execute(sql_str)
    min_node_number, = cursor.fetchone()
    if min_node_number is None:
        return 0
    return min_node_number - node.nodenumber  - 1

def get_final_gap(node, tree):
    cursor = connection.cursor()
    sql_str = (
        "select max(highestchildnodenumber) "
        "from {tree} "
        "where {node_in_parent}"
    ).format(
        tree=tree,
        node_in_parent=node_in_parent(node.nodenumber,
                                      node.highestchildnodenumber
                                      )
    )
    cursor.execute(sql_str)
    max_hcnn, = cursor.fetchone()
    if max_hcnn is None:
        return 0
    return node.highestchildnodenumber - max_hcnn

def get_total_gap(node, tree):
    cursor = connection.cursor()
    sql_str = (
        "select count(*) "
        "from {tree} "
        "where {node_in_parent}"
    ).format(
        tree=tree,
        node_in_parent=node_in_parent(node.nodenumber,
                                       node.highestchildnodenumber
                                       )
    )
    cursor.execute(sql_str)
    child_count, = cursor.fetchone()
    return node.highestchildnodenumber - node.nodenumber - child_count

def get_interstitial_gap_nn(node, tree):
    initial_gap = get_initial_gap(node, tree)
    final_gap = get_final_gap(node, tree)
    total_gap = get_total_gap(node, tree)
    return total_gap - initial_gap - final_gap

def get_ordered_children(node):
    model = type(node)
    ordered_children = list(model.objects.filter(
        nodenumber__gt=node.nodenumber,
        highestchildnodenumber__lte=node.highestchildnodenumber,
        parent_id=node.id
    ).order_by('nodenumber'))
    return ordered_children

def shift_subtree_by_steps(node, step):
    model = type(node)
    if step == 0:
        return
    model.objects.filter(nodenumber__gte=node.nodenumber,
                         highestchildnodenumber__lte=node.highestchildnodenumber
                         )\
        .update(
        nodenumber=F('nodenumber') + step,
        highestchildnodenumber=F('highestchildnodenumber') + step
    )
def squeeze_interval_by_flatten(node_to_squeeze, tree, squeeze_size):
    max_gap = get_total_gap(node_to_squeeze, tree)
    cursor = connection.cursor()
    if max_gap > squeeze_size:
        return
    phantom_node = node_to_squeeze.nodenumber + squeeze_size
    # Shifts intervals by cascading node numbers
    current_rank_id = node_to_squeeze.rankid
    cursor.execute("set @nn := -1")
    cursor.execute(("set @mr := {}").format(current_rank_id))
    sql_str = (
        "update {table} t join "
        "(select "
                   "@nn := @nn + 1 as nn, p.id as id from "
                   "(select taxonid as id from {table}"
                   "where nodenumber between {initial_nn} and "
                   "{final_nn} order by nodenumber) p ) "
                   "r on t.taxonid = r.id"
                   "set "
                   "nodenumber = r.nn + {final_nn}"
                   "highestchildnodenumber = r.nn + {final_nn}"
                   ).format(
        table=tree,
        initial_nn=node_to_squeeze.nodenumber,
        final_nn=phantom_node
    )
    cursor.execute(sql_str)
    #fetch max rank:
    cursor.execute('select @mr')
    max_rank, = cursor.fetchone()
    #fetch max nn changed
    cursor.execute('select @nn')
    max_nn_changed, = cursor.fetchone()
    cursor.execute("select "
                   "distinct rankid "
                   "from {table} "
                   "where rankid between {rankid_current} and {max_rankid}"
                   "order by rankid desc".format(table=tree, rankid_current=current_rank_id, max_rankid=max_rank))
    ranks = [rank for (rank,) in cursor.fetchall()]
    for rank in ranks:
        cursor.execute((
            "update {table} t join (\n"
            "   select max(highestchildnodenumber) as hcnn, parentid\n"
            "   from {table} where rankid > %(rank)s "
            "   and nodenumber "
            "   between {base} and {destination}"
            "   group by parentid\n"
            ") as sub on sub.parentid = t.{table}id\n"
            "set highestchildnodenumber = hcnn where rankid = %(rank)s\n"
        ).format(
            table=tree,
            base=phantom_node + 1,
            destination=phantom_node + max_nn_changed
        ), {'rank': rank})

    

def squeeze_interval(node_to_squeeze, tree, squeeze_size, forward=True):
    max_initial_gap = get_initial_gap(node_to_squeeze, tree) if forward else get_final_gap(node_to_squeeze, tree)
    max_final_gap = get_final_gap(node_to_squeeze, tree) if forward else get_initial_gap(node_to_squeeze, tree)
    max_interstitial_gap = get_interstitial_gap_nn(node_to_squeeze, tree)
    max_gap = max_initial_gap + max_final_gap + max_interstitial_gap
    forward_unary = 1 if forward else -1
    # shift the entire tree if the tree can't be squeezed - base condition during recursion (filter such trees during actual call)
    if squeeze_size > max_gap or squeeze_size == 0:
        shift_subtree_by_steps(node_to_squeeze, forward_unary*squeeze_size)
        return
    # min sets gap to 0 if previous gap is sufficient
    initial_gap = min(max_initial_gap, squeeze_size)
    interstitial_gap = min(max_interstitial_gap, squeeze_size - initial_gap)
    final_gap = min(max_final_gap, squeeze_size - (interstitial_gap + initial_gap))
    direct_children = get_ordered_children(node_to_squeeze) if forward else get_ordered_children(node_to_squeeze)[::-1]
    remaining_interstitial_gap = interstitial_gap
    previous_child = None
    interstitial_squeezed_by = 0
    for index, child in enumerate(direct_children):
        shift_subtree_by_steps(child, forward_unary * final_gap)
        possible_child_squeeze = get_total_gap(child, tree)
        if previous_child is None:
            squeeze_child_by = min(possible_child_squeeze, remaining_interstitial_gap)
        else:
            interstitial_squeezed_by = min((child.nodenumber - previous_child.highestchildnodenumber) if forward else abs(child.highestchildnodenumber - previous_child.nodenumber) - 1, remaining_interstitial_gap)
            squeeze_child_by = min(possible_child_squeeze, (remaining_interstitial_gap - interstitial_squeezed_by))
            for previous_children in direct_children[:index]:
                shift_subtree_by_steps(previous_children, (interstitial_squeezed_by + squeeze_child_by)*forward_unary)
        remaining_interstitial_gap = remaining_interstitial_gap - (squeeze_child_by + interstitial_squeezed_by)
        squeeze_interval(child, tree, squeeze_child_by, forward)
        previous_child = child

    if forward:
        node_to_squeeze.nodenumber += squeeze_size
    else:
        node_to_squeeze.highestchildnodenumber -= squeeze_size










