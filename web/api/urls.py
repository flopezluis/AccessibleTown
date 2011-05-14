#!/usr/bin/python
# -*- encoding: utf-8 -*-
#
# author: flopez 


from django.conf.urls.defaults import *
from piston.resource import Resource
from piston.emitters import Emitter
from piston.authentication import HttpBasicAuthentication
from handlers import PointHandler, LoginHandler

from views import *
auth = HttpBasicAuthentication(realm="My Realm")
ad = { 'authentication': auth }

Emitter.unregister('yaml')
Emitter.unregister('pickle')
Emitter.unregister('django')

point_resource = Resource(handler=PointHandler, **ad)
login_resource = Resource(handler=LoginHandler, **ad)
#polls_aut_resource = Resource(handler=PollHandler, **ad)


urlpatterns = patterns('',
                        url(r'^v0/point/$', point_resource, name='point'),
                        url(r'^v0/login/$', login_resource, name='login_resource'),
                      )
