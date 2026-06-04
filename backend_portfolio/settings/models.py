from django.conf import settings
from django.core.validators import FileExtensionValidator
from django.db import models

ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg", "ico"]
_image_ext_validator = FileExtensionValidator(ALLOWED_IMAGE_EXTENSIONS)


class Settings(models.Model):
    site_title = models.CharField(max_length=255)
    site_subtitle = models.CharField(max_length=512, blank=True, default="")
    about_me = models.TextField(blank=True, null=True)
    social_links = models.JSONField(default=list)
    contact_email = models.EmailField()
    logo = models.ImageField(
        upload_to="settings/logo",
        blank=True,
        null=True,
        validators=[_image_ext_validator],
    )
    favicon = models.ImageField(
        upload_to="settings/favicon",
        blank=True,
        null=True,
        validators=[_image_ext_validator],
    )
    header_image = models.ImageField(
        upload_to="settings/header_image",
        blank=True,
        null=True,
        validators=[_image_ext_validator],
    )
    footer_image = models.ImageField(
        upload_to="settings/footer_image",
        blank=True,
        null=True,
        validators=[_image_ext_validator],
    )
    is_maintenance_mode = models.BooleanField(default=False)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_settings",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "app_settings"

    def __str__(self):
        return self.site_title
