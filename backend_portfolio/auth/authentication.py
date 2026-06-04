from django.contrib.auth.hashers import check_password
from django.core.exceptions import ValidationError
from django.utils import timezone
from rest_framework import HTTP_HEADER_ENCODING
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .models import AuthSession


class AdminSessionAuthentication(BaseAuthentication):
    """
    Validates admin sessions created at sign-in.

    Client sends:
      X-Session-Id: <session_id from sign-in response>
      Authorization: Bearer <refresh_token from sign-in response>
    """

    def authenticate(self, request):
        session_id = request.META.get("HTTP_X_SESSION_ID")
        raw_header = request.META.get("HTTP_AUTHORIZATION", "")
        if not session_id or not raw_header:
            return None

        if isinstance(raw_header, str):
            raw_header = raw_header.encode(HTTP_HEADER_ENCODING)
        parts = raw_header.split()
        if len(parts) != 2 or parts[0].lower() != b"bearer":
            return None
        raw_token = parts[1].decode(HTTP_HEADER_ENCODING)

        try:
            session = AuthSession.objects.select_related("user").get(pk=session_id)
        except (AuthSession.DoesNotExist, ValueError, ValidationError):
            raise AuthenticationFailed("Invalid session.")

        if session.revoked_at is not None:
            raise AuthenticationFailed("Session revoked.")
        if session.expires_at <= timezone.now():
            raise AuthenticationFailed("Session expired.")
        if not check_password(raw_token, session.refresh_token_hash):
            raise AuthenticationFailed("Invalid token.")

        user = session.user
        if not user.is_active:
            raise AuthenticationFailed("User inactive.")

        return (user, session)

    def authenticate_header(self, request):
        return "Bearer"
