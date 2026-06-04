from django.urls import path

from .views.projects import ProjectBySlugView, ProjectDetailView, ProjectListCreateView, MediaUploadView

from .views.resume import (
    ResumeEducationDetailView,
    ResumeEducationListView,
    ResumeExperienceDetailView,
    ResumeExperienceListView,
    ResumeCertificationDetailView,
    ResumeCertificationListView,
)
from .views.skills import SkillDetailView, SkillsListView

urlpatterns = [
    path("media/upload/", MediaUploadView.as_view(), name="media-upload"),
    path("projects/", ProjectListCreateView.as_view(), name="project-list"),
    path("projects/<uuid:pk>/", ProjectDetailView.as_view(), name="project-detail"),
    path(
        "projects/by-slug/<slug:slug>/",
        ProjectBySlugView.as_view(),
        name="project-by-slug",
    ),
    path(
        "resume/experience/",
        ResumeExperienceListView.as_view(),
        name="resume-experience-list",
    ),
    path(
        "resume/experience/<uuid:pk>/",
        ResumeExperienceDetailView.as_view(),
        name="resume-experience-detail",
    ),
    path(
        "resume/education/",
        ResumeEducationListView.as_view(),
        name="resume-education-list",
    ),
    path(
        "resume/education/<uuid:pk>/",
        ResumeEducationDetailView.as_view(),
        name="resume-education-detail",
    ),
    path(
        "resume/certification/",
        ResumeCertificationListView.as_view(),
        name="resume-certification-list",
    ),
    path(
        "resume/certification/<uuid:pk>/",
        ResumeCertificationDetailView.as_view(),
        name="resume-certification-detail",
    ),
    path("skills/", SkillsListView.as_view(), name="skill-list"),
    path("skills/<uuid:pk>/", SkillDetailView.as_view(), name="skill-detail"),
]
