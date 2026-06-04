from django.urls import path

from .views import ContactFormSubmitView, ContactInquiryListView

urlpatterns = [
    path("contact/", ContactFormSubmitView.as_view(), name="contact-submit"),
    path("contact/inquiries/", ContactInquiryListView.as_view(), name="contact-inquiries"),
]