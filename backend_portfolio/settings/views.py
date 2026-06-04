from __future__ import annotations

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import PublicSettingsSerializer, SettingsSerializer
from .services import get_settings, update_settings


class PublicSettingsView(APIView):
    """Read-only settings for unauthenticated visitors (contact email, etc.)."""

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        instance = get_settings()
        if instance is None:
            return Response(
                {"detail": "Settings not found."}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(PublicSettingsSerializer(instance).data)


class SettingsView(APIView):
    """Full settings management (admin only)."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        instance = get_settings()
        if instance is None:
            return Response(
                {"detail": "Settings not found."}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(SettingsSerializer(instance).data)

    def patch(self, request: Request) -> Response:
        instance = get_settings()
        if instance is None:
            return Response(
                {"detail": "Settings not found."}, status=status.HTTP_404_NOT_FOUND
            )
        updated = update_settings(request.data)
        return Response(SettingsSerializer(updated).data)