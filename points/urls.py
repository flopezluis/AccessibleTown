#!/usr/bin/python
# -*- encoding: utf-8 -*-

from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template

from views import add_point, index, get_details, get_last_points, get_route_form

urlpatterns = patterns('',
                       url(r'^get_route_form/$',
                           get_route_form,
                           name='get_route_form'),
                       url(r'^get_last_points/$',
                           get_last_points,
                           name='last_points'),
                       url(r'^add_point/$',
                           add_point,
                           name='add_point'),
                       url(r'^get_details/(?P<point_id>\d+)/$',
                           get_details,
                           name='get_detail'),
                        )


