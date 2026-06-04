from __future__ import annotations

import uuid

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Skill
from ..serializers import SkillSerializer
from ..services import get_skills_list


class SkillsListView(APIView):
    def get_permissions(self) -> list:
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request: Request) -> Response:
        return Response(SkillSerializer(get_skills_list(), many=True).data)

    def post(self, request: Request) -> Response:
        serializer = SkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SkillDetailView(APIView):
    def get_permissions(self) -> list:
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request: Request, pk: uuid.UUID) -> Response:
        instance = get_object_or_404(Skill, pk=pk)
        return Response(SkillSerializer(instance).data)

    def patch(self, request: Request, pk: uuid.UUID) -> Response:
        instance = get_object_or_404(Skill, pk=pk)
        serializer = SkillSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request: Request, pk: uuid.UUID) -> Response:
        instance = get_object_or_404(Skill, pk=pk)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
