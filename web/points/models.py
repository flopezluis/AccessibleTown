#!/usr/bin/python
# -*- encoding: utf-8 -*-

import datetime
import cPickle as pickle
import base64
import Image, ImageFilter
import os.path
import urllib

from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext as _
from django.conf import settings

class Point(models.Model):
    """
    It represents a custom / zone.
    """
    user = models.ForeignKey(User)
    description = models.CharField(max_length=255, blank=True, null=True) 
    latitude = models.DecimalField(max_digits=10, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=6, blank=True, null=True)

class Photos(models.Model):
    photo = models.ImageField(_(u'Photo'), upload_to="ui/photos/%Y/%b/%d")
    point = models.ForeignKey(Point, related_name= "photos")
