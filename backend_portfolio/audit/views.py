from __future__ import annotations

import csv

from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import AuditLogSerializer
from .services import get_audit_logs


class AuditLogListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        serializer = AuditLogSerializer(get_audit_logs(), many=True)
        return Response(serializer.data)


class AuditLogExportView(APIView):
    """Export audit logs as a downloadable CSV file."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> HttpResponse:
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="audit_logs.csv"'

        writer = csv.writer(response)
        writer.writerow(
            ["id", "actor_user", "action", "entity_type", "entity_id", "created_at"]
        )

        for event in get_audit_logs().select_related("actor_user"):
            writer.writerow(
                [
                    str(event.id),
                    event.actor_user.email if event.actor_user else "",
                    event.action,
                    event.entity_type,
                    str(event.entity_id) if event.entity_id else "",
                    event.created_at.isoformat(),
                ]
            )

        return response