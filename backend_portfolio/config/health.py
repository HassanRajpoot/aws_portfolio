"""
Lightweight health-check endpoint for AWS App Runner.

App Runner pings this endpoint at a configurable interval to determine whether
the container is healthy.  The view deliberately avoids touching the database
so that a slow query or a transient DB hiccup does not cause the service to be
marked unhealthy and restarted.
"""

from django.http import JsonResponse


def health_check(request):
    """Return a 200 OK response with a simple JSON body."""
    return JsonResponse({"status": "healthy"}, status=200)
