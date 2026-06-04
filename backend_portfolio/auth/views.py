from __future__ import annotations

from typing import Optional

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import AdminSignInSerializer
from .services import create_session, revoke_session


class AdminSignInView(APIView):
    authentication_classes = ()
    permission_classes = [AllowAny]
    serializer_class = AdminSignInSerializer

    def post(self, request: Request) -> Response:
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        session, refresh_token = create_session(user, request)

        return Response(
            {
                "session_id": str(session.id),
                "expires_at": session.expires_at,
                "refresh_token": refresh_token,
                "user": {"email": user.email},
            },
            status=status.HTTP_200_OK,
        )


class AdminSignOutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        revoke_session(request.auth)
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        session = request.auth
        return Response(
            {
                "session_id": str(session.id),
                "expires_at": session.expires_at,
                "user": {"email": session.user.email},
            },
            status=status.HTTP_200_OK,
        )