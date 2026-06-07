# Portfolio — AWS Full-Stack Deployment

A full-stack portfolio application deployed on AWS managed services.

## Tech Stack

| Layer | Technology | AWS Service |
|:---|:---|:---|
| **Frontend** | React + TypeScript + Vite + Tailwind | S3 + CloudFront |
| **Backend** | Django 4.2 + DRF + Gunicorn | App Runner (via ECR) |
| **Database** | PostgreSQL 15 | RDS |
| **Media** | django-storages | S3 |
| **Email** | django-ses | SES |
| **CI/CD** | GitHub Actions + OIDC | Keyless Deployment |

## Architecture

```
                    ┌──────────────────────────────┐
                    │     GitHub Actions (OIDC)     │
                    └──────┬──────────────┬────────┘
                           │              │
                    Push image        Sync dist/
                           │              │
                           ▼              ▼
                    ┌──────────┐   ┌──────────────┐
                    │   ECR    │   │  S3 Bucket   │
                    └────┬─────┘   └──────┬───────┘
                         │                │
                    Auto-deploy      OAC Access
                         │                │
                         ▼                ▼
                    ┌──────────┐   ┌──────────────┐
  User ──────────►  │App Runner│   │  CloudFront  │  ◄──────── User
  (API requests)    │ (Django) │   │   (CDN)      │  (Static)
                    └────┬─────┘   └──────────────┘
                         │
                         ▼
                    ┌──────────┐
                    │   RDS    │
                    │(Postgres)│
                    └──────────┘
```

## Local Development

```bash
# Backend
cd backend_portfolio
python -m venv venv && venv\Scripts\activate   # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend
cd frontend_portfolio
npm install
npm run dev
```

## Deployment

Pushing to `main` triggers the CI/CD pipeline automatically:

1. Runs Django tests
2. Builds and pushes the backend container to ECR
3. App Runner auto-deploys the new image
4. Builds the Vite frontend and syncs to S3
5. Invalidates the CloudFront cache

See [docs/FIRST_TIME_SETUP.md](docs/FIRST_TIME_SETUP.md) for initial setup instructions.

## Documentation

| Document | Purpose |
|:---|:---|
| [FIRST_TIME_SETUP.md](docs/FIRST_TIME_SETUP.md) | First-time deployment guide |
| [AWS_INFRA_SETUP.md](docs/AWS_INFRA_SETUP.md) | Step-by-step AWS resource creation |
| [deployment_plan.md](docs/deployment_plan.md) | Architecture overview & deployment strategy |
| [backend-architecture.md](docs/backend-architecture.md) | Backend code architecture |
