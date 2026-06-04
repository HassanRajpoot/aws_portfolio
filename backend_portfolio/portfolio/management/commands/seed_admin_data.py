import uuid
import os
from datetime import date
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from decouple import config
from portfolio.models import Project, Skill, ResumeExperience, ResumeEducation
from settings.models import Settings

User = get_user_model()

class Command(BaseCommand):
    help = "Seeds the database with initial admin and portfolio data"

    def handle(self, *args, **options):
        self.stdout.write("Seeding data...")

        # 1. Create Superuser (Custom User model uses email instead of username)
        admin_email = config("ADMIN_EMAIL", default="admin@example.com")
        admin_password = config("ADMIN_PASSWORD", default="adminpassword")

        if not User.objects.filter(email=admin_email).exists():
            # The custom UserManager.create_superuser handles password hashing
            User.objects.create_superuser(admin_email, admin_password)
            self.stdout.write(self.style.SUCCESS(f"Superuser '{admin_email}' created."))
        else:
            self.stdout.write(f"Superuser '{admin_email}' already exists.")

        admin_user = User.objects.get(email=admin_email)

        # 2. Create Settings
        if not Settings.objects.exists():
            Settings.objects.create(
                site_title="DevEngine",
                site_subtitle="Portfolio",
                about_me="Senior full-stack architect: distributed systems, reactive UI, and cloud-native delivery.",
                contact_email="hello@devengine.io",
                social_links=[
                    {"platform": "GitHub", "url": "https://github.com"},
                    {"platform": "LinkedIn", "url": "https://linkedin.com"}
                ],
                updated_by=admin_user
            )
            self.stdout.write(self.style.SUCCESS("App settings created."))
        else:
            self.stdout.write("App settings already exist.")

        # 3. Create Skills
        skills_data = [
            {"name": "React / Next.js", "value_label": "EXPERT", "score": 95, "sort_order": 1},
            {"name": "TypeScript", "value_label": "EXPERT", "score": 90, "sort_order": 2},
            {"name": "Node.js", "value_label": "ADVANCED", "score": 85, "sort_order": 3},
            {"name": "Rust", "value_label": "INTERMEDIATE", "score": 75, "sort_order": 4},
            {"name": "PostgreSQL / Redis", "value_label": "ADVANCED", "score": 85, "sort_order": 5},
            {"name": "AWS / Kubernetes", "value_label": "ADVANCED", "score": 80, "sort_order": 6},
        ]
        for skill in skills_data:
            Skill.objects.get_or_create(name=skill["name"], defaults=skill)
        self.stdout.write(self.style.SUCCESS(f"Created {len(skills_data)} skills."))

        # 4. Create Experience
        experience_data = [
            {
                "company_name": "NEURAL_DYNAMICS INC.",
                "role_title": "Lead Full-Stack Engineer",
                "start_date": date(2021, 3, 1),
                "end_date": None,
                "location": "Remote",
                "employment_type": "Full_Time",
                "description": "Architected microservices processing 5M+ daily requests (Node, GraphQL, Kubernetes).\nCut client bundle size ~40% via tree-shaking and dynamic loading in React/Next.js.\nMentored 12 engineers; standardized CI/CD and high test coverage.",
                "sort_order": 1
            },
            {
                "company_name": "CYBER_CORE SYSTEMS",
                "role_title": "Senior Software Developer",
                "start_date": date(2018, 1, 1),
                "end_date": date(2021, 2, 28),
                "location": "Onsite",
                "employment_type": "Full_Time",
                "description": "Real-time dashboards for fintech clients (D3, WebSockets).\nPostgreSQL tuning for ~60% faster complex queries.",
                "sort_order": 2
            }
        ]
        for exp in experience_data:
            ResumeExperience.objects.get_or_create(
                company_name=exp["company_name"], 
                role_title=exp["role_title"], 
                defaults=exp
            )
        self.stdout.write(self.style.SUCCESS(f"Created {len(experience_data)} experience entries."))

        # 5. Create Education
        education_data = [
            {
                "institution": "MIT Institute of Technology",
                "degree": "B.S. Computer Science",
                "start_date": date(2014, 9, 1),
                "end_date": date(2018, 5, 30),
                "details": "GPA: 3.9/4.0 | Summa Cum Laude",
                "sort_order": 1
            }
        ]
        for edu in education_data:
            ResumeEducation.objects.get_or_create(
                institution=edu["institution"], 
                degree=edu["degree"], 
                defaults=edu
            )
        self.stdout.write(self.style.SUCCESS(f"Created {len(education_data)} education entries."))

        # 6. Create Projects
        projects_data = [
            {
                "slug": "quantum-metrics",
                "title": "QuantumMetrics Dashboard",
                "category": "SaaS Engine",
                "summary": "A real-time data visualization platform processing 10k+ events/sec using WebSockets and Redis.",
                "status": "published",
                "featured": True,
                "sort_order": 1
            },
            {
                "slug": "helix-orm",
                "title": "Helix ORM",
                "category": "Backend Lib",
                "summary": "Lightweight, high-performance database mapper written in Rust for high-throughput microservices.",
                "status": "published",
                "featured": True,
                "sort_order": 2
            },
            {
                "slug": "aether-storefront",
                "title": "Aether Storefront",
                "category": "E-Commerce",
                "summary": "Headless commerce experience featuring lightning-fast image optimization and server-side rendering.",
                "status": "published",
                "featured": True,
                "sort_order": 3
            }
        ]
        for proj in projects_data:
            Project.objects.get_or_create(slug=proj["slug"], defaults=proj)
        self.stdout.write(self.style.SUCCESS(f"Created {len(projects_data)} project entries."))

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully."))

