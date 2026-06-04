from django.core.management.base import BaseCommand, CommandError

from auth.models import User


class Command(BaseCommand):
    help = "Create or update the single owner user account."

    def add_arguments(self, parser):
        parser.add_argument("--email", required=True, help="Owner email address")
        parser.add_argument("--password", required=True, help="Owner password")
        parser.add_argument(
            "--rotate-password-only",
            action="store_true",
            help="Only rotate password for existing owner; fail if owner does not exist.",
        )

    def handle(self, *args, **options):
        email = options["email"].strip().lower()
        password = options["password"]
        rotate_only = options["rotate_password_only"]

        existing_users = User.objects.all()

        if rotate_only:
            if not existing_users.exists():
                raise CommandError("No owner exists yet. Run without --rotate-password-only first.")
            owner = existing_users.first()
            owner.email = email
            owner.set_password(password)
            owner.save(update_fields=["email", "password_hash", "updated_at"])
            self.stdout.write(self.style.SUCCESS(f"Owner password rotated for: {owner.email}"))
            return

        if not existing_users.exists():
            owner = User.objects.create_user(email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f"Owner created: {owner.email}"))
            return

        owner = existing_users.first()
        owner.email = email
        owner.set_password(password)
        owner.save(update_fields=["email", "password_hash", "updated_at"])
        self.stdout.write(self.style.WARNING("Owner already existed; credentials were updated."))
        self.stdout.write(self.style.SUCCESS(f"Owner updated: {owner.email}"))
