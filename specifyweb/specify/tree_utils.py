from django.db import connection
from django.db.models import F, Q, ProtectedError

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
        "select min(nodenumber)\n"
        "from {tree}\n"
        "where {node_in_parent}"
    ).format(
        tree=tree,
        parent_nn=node.node_number,
        node_in_parent = node_in_parent(node.node_number,
                                        node.highest_child_node_number
                                        )
    )
    cursor.execute(sql_str)
    is_empty_node = cursor.rowcount == 0
    if is_empty_node:
        return 0
    min_node_number, = cursor.fetchone()
    return min_node_number - node.node_number  - 1

def get_final_gap(node, tree):
    cursor = connection.cursor()
    sql_str = (
        "select max(highestchildnodenumber)\n"
        "from {tree}\n"
        "where {node_in_parent}"
    ).format(
        tree=tree,
        parent_nn = node.node_number,
        node_in_parent=node_in_parent(node.node_number,
                                      node.highest_child_node_number
                                      )
    )
    cursor.execute(sql_str)
    is_empty_node = cursor.rowcount == 0
    if is_empty_node:
        return 0
    max_hcnn, = cursor.fetchone()
    return node.highest_child_node_number - max_hcnn

def get_total_gap(node, tree):
    cursor = connection.cursor()
    sql_str = (
        "select count(*)\n"
        "from {tree}\n"
        "where {node_in_parent}"
    ).format(
        tree=tree,
        node_in_parent=node_in_parent(node.node_number,
                                       node.highest_child_node_number
                                       )
    )
    cursor.execute(sql_str)
    child_count, = cursor.fetchone()
    return node.highest_child_node_number - node.node_number - child_count

def get_interstitial_gap_nn(node, tree):
    initial_gap = get_initial_gap(node, tree)
    final_gap = get_final_gap(node, tree)
    total_gap = get_total_gap(node, tree)
    return total_gap - initial_gap - final_gap

def get_ordered_children(node):
    model = type(node)
    ordered_children = list(model.object.filter(
        nodenumber__gt=node.node_number,
        highestchildnodenumber__lte=node.highest_child_node_number
    ).order_by('nodenumber'))
    return ordered_children

def shift_subtree_by_steps(node, step):
    model = type(node)
    if step == 0:
        return
    model.objects.filter(nodenumber__gte=node.node_number,
                         highestchildnodenumber__lte=node.highest_child_node_number
                         )\
        .update(
        nodenumber=F('nodenumber') + step,
        highestchildnodenumber=F('highestchildnodenumber' + step
    ))

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
            interstitial_squeezed_by = min((child.node_number - previous_child.highest_child_node_number) if forward else abs(child.highest_child_node_number - previous_child.node_number) - 1, remaining_interstitial_gap)
            squeeze_child_by = min(possible_child_squeeze, (remaining_interstitial_gap - interstitial_squeezed_by))
            for previous_children in direct_children[:index]:
                shift_subtree_by_steps(previous_children, (interstitial_squeezed_by + squeeze_child_by)*forward_unary)
        remaining_interstitial_gap = remaining_interstitial_gap - (squeeze_child_by + interstitial_squeezed_by)
        squeeze_interval(child, tree, squeeze_child_by, forward)
        previous_child = child

    if forward:
        node_to_squeeze.node_number += squeeze_size
    else:
        node_to_squeeze.highest_child_node_number -= squeeze_size










