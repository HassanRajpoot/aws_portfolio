from rest_framework import serializers

from .models import AdminAuditEvent


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminAuditEvent
        fields = "__all__"