from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Settings

User = get_user_model()


class SettingsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="admin@example.com", password="password"
        )
        self.settings_url = reverse("settings")
        Settings.objects.create(site_title="My Portfolio", contact_email="me@example.com")

    def test_get_settings_unauthenticated(self):
        response = self.client.get(self.settings_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_settings_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.settings_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["site_title"], "My Portfolio")

    def test_patch_settings_authenticated(self):
        self.client.force_authenticate(user=self.user)
        data = {"site_title": "Updated Title"}
        response = self.client.patch(self.settings_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["site_title"], "Updated Title")
        self.assertEqual(Settings.objects.first().site_title, "Updated Title")
