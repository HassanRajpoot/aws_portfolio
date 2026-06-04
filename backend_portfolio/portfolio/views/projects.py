from __future__ import annotations

import uuid

from django.core.files.storage import default_storage
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers import ProjectSerializer
from ..services import get_project_detail, get_project_by_slug, get_projects_list


class MediaUploadView(APIView):
    """
    General-purpose file upload endpoint.
    Saves file to default storage (local media folder or AWS S3 if enabled)
    and returns the file access URL.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request: Request) -> Response:
        file_obj = request.FILES.get("file")
        if not file_obj:
            return Response(
                {"detail": "No file was submitted under key 'file'."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Save file to projects/covers directory or similar
        filename = f"projects/covers/{uuid.uuid4()}_{file_obj.name}"
        saved_path = default_storage.save(filename, file_obj)
        file_url = default_storage.url(saved_path)
        
        return Response({"url": file_url}, status=status.HTTP_201_CREATED)


class ProjectListCreateView(APIView):
    def get_permissions(self) -> list:
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request: Request) -> Response:
        serializer = ProjectSerializer(get_projects_list(request), many=True)
        return Response(serializer.data)

    def post(self, request: Request) -> Response:
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectDetailView(APIView):
    def get_permissions(self) -> list:
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request: Request, pk: uuid.UUID) -> Response:
        project = get_project_detail(pk, request)
        return Response(ProjectSerializer(project).data)

    def patch(self, request: Request, pk: uuid.UUID) -> Response:
        project = get_project_detail(pk, request)
        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request: Request, pk: uuid.UUID) -> Response:
        project = get_project_detail(pk, request)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProjectBySlugView(APIView):
    """Lookup a single project by its slug (public-friendly)."""

    def get_permissions(self) -> list:
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request: Request, slug: str) -> Response:
        project = get_project_by_slug(slug, request)
        return Response(ProjectSerializer(project).data)
