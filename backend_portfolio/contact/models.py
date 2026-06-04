from django.db import models
import uuid


class ContactInquiry(models.Model):
    class StatusChoices(models.TextChoices):
        NEW = "new", "New"
        OPEN = "open", "Open"
        CLOSED = "closed", "Closed"
        SPAM = "spam", "Spam"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=140)
    email = models.EmailField(max_length=255)
    subject = models.CharField(max_length=220, null=True, blank=True)
    message = models.TextField()
    source_page = models.CharField(max_length=120, null=True, blank=True)
    status = models.CharField(max_length=32, choices=StatusChoices.choices, default=StatusChoices.NEW)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "contact_inquiries"

    def __str__(self):
        return f"{self.name} <{self.email}>"