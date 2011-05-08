#!/usr/bin/python
# -*- encoding: utf-8 -*-
#
# author: javi santana

from django.utils.translation import ugettext as _
from piston.handler import AnonymousBaseHandler, BaseHandler
from piston.utils import rc
from django.contrib.comments.models import Comment
from django.shortcuts import get_object_or_404
import simplejson
import time
import datetime
from django.contrib.auth.models import User
from api.middleware import get_request
from points.models import Point 
from points.forms import PhotoForm

class PointHandler(BaseHandler):
    """
        It registers an iphone to receive notifications
    """

    allowed_methos = ('POST')
    fields = ('id','user', 'description', 'latitude', 'longitude')
    model = Point 

    def create(self, request):
        import pdb;pdb.set_trace()
        point, created = Point.objects.get_or_create(user=request.user, description=request.POST['description'], \
                                    latitude=request.POST['latitude'], longitude=request.POST['longitude'])
        if created:
            photoForm = PhotoForm(request.POST,  request.FILES) 
            photo = photoForm.save(commit=False)
            photo.point = point
            photo.save()

        return rc.ALL_OK

class LoginHandler(BaseHandler):
    """
    it do the challenge
    """

    allowed_methos = ('GET')

    def read(self, request):
        """
        if it gest here, it's authenticated
        """
        return rc.ALL_OK
