from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^collection/user/(?P<user_id>\d+)/$', views.collection_user),
    url(r'^collection/preparations/$', views.collection_preparations),
    url(r'^collection/type_specimens/$', views.collection_type_specimens),
    url(r'^collection/locality_geography/(?P<stat>\w+)/', views.collection_locality_geography),
    url(r'^collection/attachments/(?P<stat>\w+)/', views.collection_attachments)
]
