from __future__ import annotations

from django.db.models import QuerySet

from .models import AdminAuditEvent


def get_audit_logs() -> QuerySet[AdminAuditEvent]:
    return AdminAuditEvent.objects.all().order_by("-created_at")
