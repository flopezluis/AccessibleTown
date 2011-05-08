#!/usr/bin/python
# -*- encoding: utf-8 -*-
#
# author: felix lopez
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.contrib.auth.decorators import login_required
from django.utils import simplejson
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.conf import settings
from django import http
from django.template import loader, Context
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext as _
from django.shortcuts import render_to_response
from django.template.loader import render_to_string
from django.template import RequestContext
import re
from django.db.models import Q
from django import forms
from django.forms.widgets import TextInput
from forms import  PointForm, PhotoForm
import logging
from models import Point

def index(request):
    context_inst = RequestContext(request)
    points = Point.objects.all().reverse() #This is crazy, can be thousands. USE geodjango to make operations instead of the client
    return render_to_response('index.html', {'points': points}, context_instance=context_inst)

def get_details(request, point_id):
    """
        get the name and the photo for that point.
    """

    data = {'success': False}
    if request.is_ajax():
        point = Point.objects.get(pk=int(point_id))

        rendered = render_to_string('points/get_details.html', {'point': point})
        data = { 'success': True, 'html': rendered }

    return HttpResponse(simplejson.dumps(data))

def add_point(request):
    """
            Get the form to add a point 
    """
    data = {'success': False}
    rendered = None
    form = PointForm(request.POST or None,
                     request.FILES if request.POST else None)
    if request.method == 'POST':
        point = form.save(commit=False)
        point.user = request.user
        point.save()
        photoForm = PhotoForm(request.POST,  request.FILES) 
        photo = photoForm.save(commit=False)
        photo.point = point
        photo.save()
    else:
        rendered = render_to_string('points/add_point_form.html', {'form': form},RequestContext(request))
    data = { 'success': True, 'html': rendered }

    return HttpResponse(simplejson.dumps(data))

def get_route_form(request):
    """
            Get the form to look for a route 
    """
    rendered = render_to_string('points/look_route_form.html', {},RequestContext(request))
    data = { 'success': True, 'html': rendered }
    return HttpResponse(simplejson.dumps(data))

def get_last_points(request):
    """
     Returns an array with last 10 points added 
    """

    data = {'success': False}
    if request.is_ajax():
        json_points = []
        points = Point.objects.all().reverse().values('id', 'latitude', 'longitude')[0:10]
        for point in points:
            json_points.append({'lat': point['latitude'].to_eng_string(), 'lng': point['longitude'].to_eng_string(),'id':point['id']})
        data = { 'success': True, 'points': json_points }

    return HttpResponse(simplejson.dumps(data))


