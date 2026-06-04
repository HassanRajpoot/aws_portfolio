from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import ContactInquiry


class ContactTests(APITestCase):
    def setUp(self):
        self.submit_url = reverse("contact-submit")

    def test_submit_contact_success(self):
        data = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "subject": "Hello",
            "message": "I would like to hire you.",
        }
        response = self.client.post(self.submit_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactInquiry.objects.count(), 1)
        inquiry = ContactInquiry.objects.first()
        self.assertEqual(inquiry.name, "Jane Doe")
        self.assertEqual(inquiry.email, "jane@example.com")

    def test_submit_contact_invalid(self):
        data = {
            "name": "",
            "email": "not-an-email",
            "message": "",
        }
        response = self.client.post(self.submit_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ContactInquiry.objects.count(), 0)
