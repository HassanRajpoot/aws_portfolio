import datetime
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Project, ResumeEducation, ResumeExperience, Skill

User = get_user_model()


class PortfolioTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="admin@example.com", password="password"
        )
        self.project_list_url = reverse("project-list")
        
        # Create initial data
        self.project = Project.objects.create(
            slug="test-project",
            title="Test Project",
            summary="A test project",
            status=Project.StatusChoices.PUBLISHED,
        )
        self.project_detail_url = reverse("project-detail", kwargs={"pk": self.project.pk})
        
        self.education = ResumeEducation.objects.create(
            institution="Test Univ",
            degree="Test Degree",
            start_date=datetime.date(2020, 1, 1),
        )
        self.education_list_url = reverse("resume-education-list")
        self.education_detail_url = reverse("resume-education-detail", kwargs={"pk": self.education.pk})
        
        self.experience = ResumeExperience.objects.create(
            company_name="Test Inc",
            role_title="Test Role",
            start_date=datetime.date(2021, 1, 1),
        )
        self.experience_list_url = reverse("resume-experience-list")
        self.experience_detail_url = reverse("resume-experience-detail", kwargs={"pk": self.experience.pk})

        self.skill = Skill.objects.create(
            name="Python",
            score=90,
        )
        self.skill_list_url = reverse("skill-list")
        self.skill_detail_url = reverse("skill-detail", kwargs={"pk": self.skill.pk})

    def test_list_projects_public(self):
        response = self.client.get(self.project_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_project_unauthenticated(self):
        data = {"slug": "new-project", "title": "New Project", "summary": "Sum"}
        response = self.client.post(self.project_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_project_authenticated(self):
        self.client.force_authenticate(user=self.user)
        data = {"slug": "new-project", "title": "New Project", "summary": "Sum"}
        response = self.client.post(self.project_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_patch_project_authenticated(self):
        self.client.force_authenticate(user=self.user)
        data = {"title": "Updated Project"}
        response = self.client.patch(self.project_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Updated Project")

    def test_delete_project_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.project_detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Project.objects.count(), 0)

    def test_list_education_public(self):
        response = self.client.get(self.education_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_patch_education_authenticated(self):
        self.client.force_authenticate(user=self.user)
        data = {"degree": "Updated Degree"}
        response = self.client.patch(self.education_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["degree"], "Updated Degree")

    def test_list_experience_public(self):
        response = self.client.get(self.experience_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_patch_experience_authenticated(self):
        self.client.force_authenticate(user=self.user)
        data = {"role_title": "Updated Role"}
        response = self.client.patch(self.experience_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["role_title"], "Updated Role")

    def test_list_skills_public(self):
        response = self.client.get(self.skill_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_patch_skill_authenticated(self):
        self.client.force_authenticate(user=self.user)
        data = {"name": "Advanced Python"}
        response = self.client.patch(self.skill_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Advanced Python")
