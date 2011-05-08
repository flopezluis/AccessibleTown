#!/usr/bin/python
# -*- encoding: utf-8 -*-

import mimetypes, urllib
import Image

from django import forms
from django.core.exceptions import ObjectDoesNotExist
from django.core.exceptions import ImproperlyConfigured
from django.db import models
from django.utils.translation import ugettext as _
from django.conf import settings
from django.contrib.auth.models import User
from django.forms.widgets import Textarea, HiddenInput
from django.core.files.uploadedfile import SimpleUploadedFile

from django.utils import translation

from models import Point, Photos

class PhotoForm(forms.ModelForm):
    class Meta:
        model = Photos
        fields = ('photo',) 
class PointForm(forms.ModelForm):
    """
    Point Form
    """
    Descripction = forms.CharField(required = False, widget=forms.TextInput(attrs={'size': 255}),
                               label = _(u'Name'),
                               help_text = _(u'Ejemplo: La cueva del abuelo'))
    latitude = forms.CharField(required=True,max_length=255, widget=HiddenInput())
    longitude = forms.CharField(required=True,max_length=255, widget=HiddenInput())
    photo = forms.ImageField(required=False, label="Selecciona una foto")

    class Meta:
        model = Point 
        fields = ('description', 'latitude', 'longitude', 'photo')
