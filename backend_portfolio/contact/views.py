from __future__ import annotations

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .models import ContactInquiry
from .serializers import ContactInquirySerializer
from .services import create_inquiry


class ContactRateThrottle(AnonRateThrottle):
    """Stricter throttle for the public contact form."""
    rate = "5/minute"


class ContactFormSubmitView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ContactRateThrottle]

    def post(self, request: Request) -> Response:
        create_inquiry(request.data)
        return Response(
            {"status": "success", "message": "Message sent successfully"},
            status=status.HTTP_201_CREATED,
        )


class ContactInquiryListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        inquiries = ContactInquiry.objects.all().order_by("-created_at")
        serializer = ContactInquirySerializer(inquiries, many=True)
        return Response(serializer.data)

