#!/usr/bin/python
# -*- encoding: utf-8 -*-
#
# author: Félix López 

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

    allowed_methos = ('GET', 'POST')
    fields = ('id', 'description', 'latitude', 'longitude', 'photo')
    model = Point 

    @classmethod
    def photo(self, point):
        photos = point.photos.all()
        if len(photos):
            return photos[0].photo.url
        return None


    def create(self, request):
        point, created = Point.objects.get_or_create(user=request.user, description=request.POST['description'], \
                                    latitude=request.POST['latitude'], longitude=request.POST['longitude'])
        if created:
            photoForm = PhotoForm(request.POST,  request.FILES) 
            photo = photoForm.save(commit=False)
            photo.point = point
            photo.save()

        return rc.ALL_OK
    
    def read(self, request):
        """
            return all published initiatives order by publish date in json format
            If other type is supplied http BAD_REQUEST code is returned

        """
        return Point.objects.all().reverse()[0:15]


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
