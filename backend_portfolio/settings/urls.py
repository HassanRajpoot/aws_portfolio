from django.urls import path

from .views import PublicSettingsView, SettingsView

urlpatterns = [
    path("settings/", SettingsView.as_view(), name="settings"),
    path("public-settings/", PublicSettingsView.as_view(), name="public-settings"),
]