from django.conf.urls import url
from . import views
from django.contrib.auth import views as auth_view

app_name='vbook'
urlpatterns = [
	#/vbook/
	url(r'^$', views.NotebookView.as_view(), name='notebook'),
	# /vbook/notebook/set-color-notebook/
    url(r'^set_fav_notebook/$', views.set_fav_notebook, name='set_fav_notebook'),

    # /vbook/notebook/add-notebook/
    url(r'^add_notebook/$', views.add_notebook, name='add_notebook'),

    # /vbook/notebook/set-share-notebook/
    url(r'^set_share_notebook/$', views.set_share_notebook, name='set_share_notebook'),
    
    # /vbook/notebook/delete-notebook/
    url(r'^delete_notebook/$', views.delete_notebook, name='delete_notebook'),

    # /vbook/register
    url(r'^register/$', views.UserFormView.as_view(), name='register'),

    # /vbook/login
    url(r'^login/$', auth_view.login, {
        'template_name': 'vbook/login.html'}, name='login'),

    # /vbook/notebook/set-color-notebook/
    url(r'^set_color_notebook/$', views.set_color_notebook, name='set_color_notebook'),
    # /vbook/notebook/search-all/
    url(r'^search_all/?$', views.search_all, name='search_all'),

    # logout
    url(r'^logout/$', auth_view.logout, name='logout'),

    # logout redirect
    url(r'^logout/success/$', auth_view.login, {
        'template_name': 'vbook/login.html'}, name='login'),

    # /vbook/detail_note/url_id
    url(r'^detail_note/(?P<url_id>[0-9]+)/$',
        views.url_detail_json, name='url_detail_json'),
    
    #/vbook/71/
    url(r'^(?P<notebook_id>[0-9]+)/$', views.notebook_detail, name='detail_nb'),
    url(r'^url/(?P<url_id>[0-9]+)/$', views.url_detail, name='detail_url'),
    url(r'^set_fav_note$', views.set_fav_note, name='set_fav_note'),
    url(r'^add_note$', views.add_note, name='add_note'),
    url(r'^delete_note$', views.delete_note, name='delete_note'),
    url(r'^set_color_note/$', views.set_color_note, name='set_color_note'),
    url(r'^get_contents_note$', views.get_contents_note, name='get_contents_note'),
    url(r'^edit_note$', views.edit_note, name='edit_note'),
    url(r'^add_url/$', views.add_url, name='add_url'),
    url(r'^add_chapter/$', views.add_chapter, name='add_chapter'),
        url(r'^discover/$', views.DiscoverView.as_view(), name='discover'),

]