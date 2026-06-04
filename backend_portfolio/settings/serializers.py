from rest_framework import serializers

from .models import Settings


class PublicSettingsSerializer(serializers.ModelSerializer):
    """Subset of settings visible to unauthenticated visitors."""

    class Meta:
        model = Settings
        fields = [
            "site_title",
            "site_subtitle",
            "about_me",
            "social_links",
            "contact_email",
            "logo",
            "favicon",
            "header_image",
            "footer_image",
            "is_maintenance_mode",
        ]
        read_only_fields = fields


class SettingsSerializer(serializers.ModelSerializer):
    """Full settings (admin only)."""

    class Meta:
        model = Settings
        fields = [
            "id",
            "site_title",
            "site_subtitle",
            "about_me",
            "social_links",
            "contact_email",
            "logo",
            "favicon",
            "header_image",
            "footer_image",
            "is_maintenance_mode",
        ]
        read_only_fields = ["id"]