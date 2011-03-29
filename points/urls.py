#!/usr/bin/python
# -*- encoding: utf-8 -*-

from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template

from views import add_point, index, get_details

urlpatterns = patterns('',
                       # Activation keys get matched by \w+ instead of the more specific
                       # [a-fA-F0-9]{40} because a bad activation key should still get to the view;
                       # that way it can return a sensible "invalid key" message instead of a
                       # confusing 404.
                       url(r'^add_point/$',
                           add_point,
                           name='add_point'),
                       url(r'^get_details/(?P<point_id>\d+)/$',
                           get_details,
                           name='get_detail'),
                        )

