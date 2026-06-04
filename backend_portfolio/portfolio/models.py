from django.core.validators import FileExtensionValidator
from django.db import models
import uuid

ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg"]
_image_ext_validator = FileExtensionValidator(ALLOWED_IMAGE_EXTENSIONS)


class Project(models.Model):
    class StatusChoices(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.CharField(max_length=160, unique=True)
    title = models.CharField(max_length=220)
    category = models.CharField(max_length=80, null=True, blank=True)
    summary = models.TextField()
    media_assets = models.JSONField(
        default=list,
        blank=True,
        help_text='JSON array of media URLs, e.g. ["https://...", "https://..."].',
    )
    cover_image = models.ImageField(
        upload_to="projects/covers/",
        null=True,
        blank=True,
        help_text="Project cover image. Will be stored in S3 if configured.",
        validators=[_image_ext_validator],
    )
    body_markdown = models.TextField(null=True, blank=True)
    status = models.CharField(
        max_length=32, choices=StatusChoices.choices, default=StatusChoices.DRAFT
    )
    featured = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "projects"

    def __str__(self) -> str:
        return self.title


class Skill(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=120)
    value_label = models.CharField(max_length=32, null=True, blank=True)
    score = models.SmallIntegerField(null=True, blank=True)
    icon = models.ImageField(
        upload_to="skills/icons/",
        null=True,
        blank=True,
        help_text="Skill icon image.",
        validators=[_image_ext_validator],
    )
    sort_order = models.IntegerField(default=0)

    class Meta:
        db_table = "skills"

    def __str__(self) -> str:
        return self.name


class ResumeExperience(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company_name = models.CharField(max_length=180)
    role_title = models.CharField(max_length=180)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=120, null=True, blank=True)
    employment_type = models.CharField(max_length=64, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    sort_order = models.IntegerField(default=0)

    class Meta:
        db_table = "resume_experiences"

    def __str__(self) -> str:
        return f"{self.role_title} at {self.company_name}"


class ResumeEducation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    institution = models.CharField(max_length=180)
    degree = models.CharField(max_length=180)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    details = models.TextField(null=True, blank=True)
    sort_order = models.IntegerField(default=0)

    class Meta:
        db_table = "resume_education"

    def __str__(self) -> str:
        return f"{self.degree} - {self.institution}"


class ResumeCertification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    icon = models.CharField(max_length=64, default="verified")  # e.g. "cloud", "security", "memory"
    meta = models.CharField(max_length=200, null=True, blank=True)  # e.g. "ID: AWS-7782-990"
    sort_order = models.IntegerField(default=0)

    class Meta:
        db_table = "resume_certifications"

    def __str__(self) -> str:
        return self.title

