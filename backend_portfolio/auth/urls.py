from django.urls import path

from .views import AdminSessionView, AdminSignInView, AdminSignOutView

urlpatterns = [
    path('sign-in/', AdminSignInView.as_view(), name='admin-sign-in'),
    path('sign-out/', AdminSignOutView.as_view(), name='admin-sign-out'),
    path('session/', AdminSessionView.as_view(), name='admin-session'),
]
