from __future__ import annotations

from typing import Optional

from .models import Settings


def get_settings() -> Optional[Settings]:
    return Settings.objects.first()


def update_settings(data: dict) -> Settings:
    from .serializers import SettingsSerializer

    instance = Settings.objects.first()
    if instance is None:
        instance = Settings()

    serializer = SettingsSerializer(instance, data=data, partial=True)
    serializer.is_valid(raise_exception=True)
    updated: Settings = serializer.save()
    return updated
