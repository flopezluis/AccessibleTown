from django.conf.urls.defaults import *

from django.conf import settings
from django.contrib import admin
from points.views import index
admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^AccessibleTown/', include('AccessibleTown.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
     (r'^api/', include('api.urls')),
     (r'^admin/', include(admin.site.urls)),
     (r'^accounts/', include('registration.urls')),
     url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}, name='logout'),
     url(r'^$', index, name='index'),
     (r'^point/', include('points.urls')),
)
if settings.DEBUG:
    urlpatterns += patterns('', 
        (r'^media/(?P<path>.*)$', 'django.views.static.serve',
                {'document_root': settings.MEDIA_ROOT}),
    )

