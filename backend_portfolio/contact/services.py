from __future__ import annotations

from django.conf import settings
from django.core.mail import send_mail

from .models import ContactInquiry


def create_inquiry(data: dict) -> ContactInquiry:
    """
    Creates a new contact inquiry and sends an email notification.
    """
    from .serializers import ContactInquirySerializer

    serializer = ContactInquirySerializer(data=data)
    serializer.is_valid(raise_exception=True)
    inquiry: ContactInquiry = serializer.save()

    # Send email notification
    subject = f"New Portfolio Inquiry: {inquiry.subject or 'No Subject'}"
    message = (
        f"You have received a new inquiry from {inquiry.name} ({inquiry.email}):\n\n"
        f"Message:\n{inquiry.message}\n\n"
        f"Source: {inquiry.source_page or 'Unknown'}"
    )

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.NOTIFY_EMAIL],
            fail_silently=False,
        )
    except Exception:
        # In a production app, we would log this error.
        # We don't want to fail the user request if the email fails.
        pass

    return inquiry
