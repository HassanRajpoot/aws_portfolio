from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="testadmin@example.com", password="testpassword123"
        )
        self.sign_in_url = reverse("admin-sign-in")
        self.sign_out_url = reverse("admin-sign-out")
        self.session_url = reverse("admin-session")

    def test_sign_in_success(self):
        data = {"email": "testadmin@example.com", "password": "testpassword123"}
        response = self.client.post(self.sign_in_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_sign_in_failure(self):
        data = {"email": "testadmin@example.com", "password": "wrongpassword"}
        response = self.client.post(self.sign_in_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_session_authenticated(self):
        from .models import AuthSession
        from django.utils import timezone
        session = AuthSession.objects.create(
            user=self.user,
            refresh_token_hash="test",
            expires_at=timezone.now() + timezone.timedelta(days=1)
        )
        self.client.force_authenticate(user=self.user, token=session)
        response = self.client.get(self.session_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["email"], self.user.email)

    def test_session_unauthenticated(self):
        response = self.client.get(self.session_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_sign_out(self):
        from .models import AuthSession
        from django.utils import timezone
        session = AuthSession.objects.create(
            user=self.user,
            refresh_token_hash="test",
            expires_at=timezone.now() + timezone.timedelta(days=1)
        )
        self.client.force_authenticate(user=self.user, token=session)
        response = self.client.post(self.sign_out_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
