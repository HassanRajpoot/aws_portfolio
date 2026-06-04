from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import AdminAuditEvent

User = get_user_model()


class AuditTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="admin@example.com", password="password"
        )
        self.list_url = reverse("audit-log-list")
        self.export_url = reverse("audit-log-export")

        AdminAuditEvent.objects.create(
            actor_user=self.user,
            action="Created Project",
            entity_type="Project",
        )

    def test_list_audit_logs_unauthenticated(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_audit_logs_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["action"], "Created Project")

    def test_export_audit_logs_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.export_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
