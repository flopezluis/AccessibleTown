try:
    from threading import local
except ImportError:
    from django.utils._threading_local import local

_thread_locals = local()
def get_request():
    return getattr(_thread_locals, 'request', None)

class ThreadLocals(object):
    def process_request(self, request):
        _thread_locals.request = request
        if '/api/v' in request.path:
            #except csrf to the api
            request.csrf_processing_done = True

