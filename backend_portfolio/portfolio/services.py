from __future__ import annotations
import uuid
from typing import TYPE_CHECKING
from django.db.models import QuerySet
from django.shortcuts import get_object_or_404
from .models import Project, Skill, ResumeExperience, ResumeEducation, ResumeCertification

if TYPE_CHECKING:
    from rest_framework.request import Request


def get_projects_list(request: Request) -> QuerySet[Project]:
    """
    Returns a list of projects.
    Public users see only published projects. Admins see all.
    """
    qs = Project.objects.all().order_by("sort_order", "-published_at", "title")
    if request.user and request.user.is_authenticated:
        return qs
    return qs.filter(status=Project.StatusChoices.PUBLISHED)


def get_project_detail(pk: uuid.UUID, request: Request) -> Project:
    """
    Returns a single project detail.
    Public users see only if published.
    """
    if request.user and request.user.is_authenticated:
        return get_object_or_404(Project, pk=pk)
    return get_object_or_404(Project, pk=pk, status=Project.StatusChoices.PUBLISHED)


def get_project_by_slug(slug: str, request: Request) -> Project:
    """
    Returns a single project by slug.
    Public users see only if published.
    """
    if request.user and request.user.is_authenticated:
        return get_object_or_404(Project, slug=slug)
    return get_object_or_404(Project, slug=slug, status=Project.StatusChoices.PUBLISHED)


def get_skills_list() -> QuerySet[Skill]:
    """
    Returns all skills ordered by sort_order.
    """
    return Skill.objects.all().order_by("sort_order")


def get_experience_list() -> QuerySet[ResumeExperience]:
    """
    Returns experience list.
    """
    return ResumeExperience.objects.all().order_by("-start_date", "sort_order")


def get_education_list() -> QuerySet[ResumeEducation]:
    """
    Returns education list.
    """
    return ResumeEducation.objects.all().order_by("-start_date", "sort_order")


def get_certification_list() -> QuerySet[ResumeCertification]:
    """
    Returns certification list.
    """
    return ResumeCertification.objects.all().order_by("sort_order", "title")

