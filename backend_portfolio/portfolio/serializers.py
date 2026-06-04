from rest_framework import serializers

from .models import Project, ResumeEducation, ResumeExperience, Skill, ResumeCertification



class HybridImageField(serializers.ImageField):
    """
    Custom field that accepts both raw file uploads and direct S3/media URLs,
    automatically converting absolute URLs to relative storage paths, and
    dynamically generating signed S3 URLs on serialization.
    """
    def to_internal_value(self, data):
        if isinstance(data, str):
            if not data:
                return None
            
            from django.conf import settings
            
            # Strip query parameters (signed S3 query params)
            if "?" in data:
                data = data.split("?")[0]
            
            # Extract bucket name and clean host domains
            bucket_name = getattr(settings, "AWS_STORAGE_BUCKET_NAME", "")
            s3_domain = getattr(settings, "AWS_S3_CUSTOM_DOMAIN", "")
            s3_prefix = f"https://{s3_domain}/" if s3_domain else ""
            media_prefix = getattr(settings, "MEDIA_URL", "/media/")
            
            # Strip S3 absolute domain if custom domain is set
            if s3_prefix and data.startswith(s3_prefix):
                data = data[len(s3_prefix):]
            # Strip generic AWS S3 domain dynamically
            elif bucket_name and bucket_name in data:
                if f"/{bucket_name}/" in data:
                    data = data.split(f"/{bucket_name}/")[-1]
                elif ".amazonaws.com/" in data:
                    data = data.split(".amazonaws.com/")[-1]
            # Strip local media prefix
            elif data.startswith(media_prefix):
                data = data[len(media_prefix):]
                
            return data
            
        return super().to_internal_value(data)

    def to_representation(self, value):
        if not value:
            return None
        
        from django.core.files.storage import default_storage
        from django.conf import settings
        
        path = str(value)
        
        # Strip query parameters if present in historical database value
        if "?" in path:
            path = path.split("?")[0]
            
        bucket_name = getattr(settings, "AWS_STORAGE_BUCKET_NAME", "")
        s3_domain = getattr(settings, "AWS_S3_CUSTOM_DOMAIN", "")
        s3_prefix = f"https://{s3_domain}/" if s3_domain else ""
        media_prefix = getattr(settings, "MEDIA_URL", "/media/")
        
        # Clean any historical full S3/media URL to relative path
        if s3_prefix and path.startswith(s3_prefix):
            path = path[len(s3_prefix):]
        elif bucket_name and bucket_name in path:
            if f"/{bucket_name}/" in path:
                path = path.split(f"/{bucket_name}/")[-1]
            elif ".amazonaws.com/" in path:
                path = path.split(".amazonaws.com/")[-1]
        elif path.startswith("https://") or path.startswith("http://"):
            if ".s3.amazonaws.com/" in path:
                path = path.split(".s3.amazonaws.com/")[-1]
            elif ".amazonaws.com/" in path:
                path = path.split(".amazonaws.com/")[-1]
        elif path.startswith(media_prefix):
            path = path[len(media_prefix):]
            
        # Dynamically generate secure signed S3 URL or media URL
        try:
            return default_storage.url(path)
        except Exception:
            return super().to_representation(value)


class ProjectSerializer(serializers.ModelSerializer):
    media_assets = serializers.ListField(
        child=serializers.URLField(max_length=2048),
        required=False,
        default=list,
    )
    cover_image = HybridImageField(required=False, allow_null=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "slug",
            "title",
            "category",
            "summary",
            "media_assets",
            "cover_image",
            "body_markdown",
            "status",
            "featured",
            "sort_order",
            "published_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ResumeEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeEducation
        fields = [
            "id",
            "institution",
            "degree",
            "start_date",
            "end_date",
            "details",
            "sort_order",
        ]
        read_only_fields = ["id"]


class ResumeExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeExperience
        fields = [
            "id",
            "company_name",
            "role_title",
            "start_date",
            "end_date",
            "location",
            "employment_type",
            "description",
            "sort_order",
        ]
        read_only_fields = ["id"]

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = [
            "id",
            "name",
            "value_label",
            "score",
            "icon",
            "sort_order",
        ]
        read_only_fields = ["id"]


class ResumeCertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeCertification
        fields = [
            "id",
            "title",
            "icon",
            "meta",
            "sort_order",
        ]
        read_only_fields = ["id"]