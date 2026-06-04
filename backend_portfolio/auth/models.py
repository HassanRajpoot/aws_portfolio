import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.db.models import Q


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The email field is required.")
        # Single-user architecture: only one owner record is allowed.
        if self.model.objects.exists():
            raise ValueError("Single-user mode allows only one user account.")
        email = self.normalize_email(email)
        extra_fields.setdefault("role", User.RoleChoices.ADMIN)
        extra_fields.setdefault("status", User.StatusChoices.ACTIVE)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("role", User.RoleChoices.ADMIN)
        extra_fields.setdefault("status", User.StatusChoices.ACTIVE)
        return self.create_user(email=email, password=password, **extra_fields)


class User(AbstractBaseUser):
    """
    Custom single-owner user model.

    Extends ``AbstractBaseUser`` so Django admin, contrib auth middleware,
    and third-party libraries work out of the box.  The inherited ``password``
    field replaces the old ``password_hash`` column (renamed via migration).
    """

    class RoleChoices(models.TextChoices):
        ADMIN = "admin", "Admin"

    class StatusChoices(models.TextChoices):
        ACTIVE = "active", "Active"
        DISABLED = "disabled", "Disabled"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    email = models.EmailField(max_length=255, unique=True)
    # ``password`` is provided by AbstractBaseUser.
    role = models.CharField(
        max_length=32,
        choices=RoleChoices.choices,
        default=RoleChoices.ADMIN,
    )
    status = models.CharField(
        max_length=32,
        choices=StatusChoices.choices,
        default=StatusChoices.ACTIVE,
    )
    last_login_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.email

    # ---- derived boolean properties expected by Django ----

    @property
    def is_active(self):
        return self.status == self.StatusChoices.ACTIVE

    @property
    def is_staff(self):
        return self.role == self.RoleChoices.ADMIN

    @property
    def is_superuser(self):
        return self.role == self.RoleChoices.ADMIN

    def has_perm(self, perm, obj=None):
        return self.role == self.RoleChoices.ADMIN

    def has_module_perms(self, app_label):
        return self.role == self.RoleChoices.ADMIN


class AuthSession(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="auth_sessions",
    )
    refresh_token_hash = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    expires_at = models.DateTimeField()
    revoked_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "auth_sessions"
        constraints = [
            models.UniqueConstraint(
                fields=["user"],
                condition=Q(revoked_at__isnull=True),
                name="unique_active_session_per_user",
            )
        ]

    def __str__(self):
        return f"{self.user.email} ({self.id})"