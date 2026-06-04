from __future__ import annotations

import uuid

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import ResumeEducation, ResumeExperience, ResumeCertification
from ..serializers import ResumeEducationSerializer, ResumeExperienceSerializer, ResumeCertificationSerializer
from ..services import get_education_list, get_experience_list, get_certification_list



class ResumeExperienceListView(APIView):
    def get_permissions(self) -> list:
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request: Request) -> Response:
        return Response(
            ResumeExperienceSerializer(get_experience_list(), many=True).data
        )

    def post(self, request: Request) -> Response:
        serializer = ResumeExperienceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResumeExperienceDetailView(APIView):
    def get_permissions(self) -> list:
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request: Request, pk: uuid.UUID) -> Response:
        instance = get_object_or_404(ResumeExperience, pk=pk)
        return Response(ResumeExperienceSerializer(instance).data)

    def patch(self, request: Request, pk: uuid.UUID) -> Response:
        instance = get_object_or_404(ResumeExperience, pk=pk)
        serializer = ResumeExperienceSerializer(
            instance, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request: Request, pk: uuid.UUID) -> Response:
        instance = get_object_or_404(ResumeExperience, pk=pk)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ResumeEducationListView(APIView):
    def get_permissions(self) -> list:
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request: Request) -> Response:
        return Response(ResumeEducationSerializer(get_education_list(), many=True).data)

    def post(self, request: Request) -> Response:
        serializer = ResumeEducationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResumeEducationDetailView(APIView):
    def get_permissions(self) -> list:
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request: Request, pk: uuid.UUID) -> Response:
        instance = get_object_or_404(ResumeEducation, pk=pk)
        return Response(ResumeEducationSerializer(instance).data)

    def patch(self, request: Request, pk: uuid.UUID) -> Response:
        instance = get_object_or_404(ResumeEducation, pk=pk)
        serializer = ResumeEducationSerializer(
            instance, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request: Request, pk: uuid.UUID) -> Response:
        instance = get_object_or_404(ResumeEducation, pk=pk)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ResumeCertificationListView(APIView):
    def get_permissions(self) -> list:
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request: Request) -> Response:
        return Response(ResumeCertificationSerializer(get_certification_list(), many=True).data)

    def post(self, request: Request) -> Response:
        serializer = ResumeCertificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResumeCertificationDetailView(APIView):
    def get_permissions(self) -> list:
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request: Request, pk: uuid.UUID) -> Response:
        instance = get_object_or_404(ResumeCertification, pk=pk)
        return Response(ResumeCertificationSerializer(instance).data)

    def patch(self, request: Request, pk: uuid.UUID) -> Response:
        instance = get_object_or_404(ResumeCertification, pk=pk)
        serializer = ResumeCertificationSerializer(
            instance, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request: Request, pk: uuid.UUID) -> Response:
        instance = get_object_or_404(ResumeCertification, pk=pk)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

