from __future__ import annotations

import ipaddress
import secrets
from typing import Optional

from django.contrib.auth.hashers import make_password
from django.db import transaction
from django.utils import timezone
from rest_framework.request import Request

from .models import AuthSession

REFRESH_TOKEN_BYTES: int = 48


def extract_client_ip(request: Request) -> Optional[str]:
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    raw: Optional[str] = (xff.split(",")[0].strip() if xff else None) or request.META.get("REMOTE_ADDR")
    if not raw:
        return None
    try:
        ipaddress.ip_address(raw.split("%")[0])
    except ValueError:
        return None
    return raw


def create_session(user, request: Request) -> tuple[AuthSession, str]:
    refresh_token: str = secrets.token_urlsafe(REFRESH_TOKEN_BYTES)
    now = timezone.now()
    expires_at = now + timezone.timedelta(days=30)

    with transaction.atomic():
        AuthSession.objects.filter(user=user, revoked_at__isnull=True).update(revoked_at=now)
        session: AuthSession = AuthSession.objects.create(
            user=user,
            refresh_token_hash=make_password(refresh_token),
            ip_address=extract_client_ip(request),
            user_agent=request.META.get("HTTP_USER_AGENT"),
            expires_at=expires_at,
        )
        user.last_login_at = now
        user.save(update_fields=["last_login_at"])

    return session, refresh_token


def revoke_session(session: AuthSession) -> None:
    session.revoked_at = timezone.now()
    session.save(update_fields=["revoked_at"])
