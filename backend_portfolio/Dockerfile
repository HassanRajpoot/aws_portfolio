# ==========================================
# Stage 1: Build & Compile Python Wheels
# ==========================================
FROM python:3.13-slim AS builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install heavy system compiler dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libjpeg-dev \
    zlib1g-dev \
    libwebp-dev \
    && rm -rf /var/lib/apt/lists/*

# Build Python wheels into /app/wheels directory
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt


# ==========================================
# Stage 2: Final Runtime Environment
# ==========================================
FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install ONLY the essential runtime shared libraries (no dev headers, no compilers)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    libjpeg62-turbo \
    libwebp7 \
    && rm -rf /var/lib/apt/lists/*

# Copy pre-compiled wheels from Builder stage and install them
COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt \
    && rm -rf /wheels

# Copy project files
COPY . /app/

# Collect Django admin static files at build time.
# A dummy SECRET_KEY is required because Django refuses to start without one,
# but the real key is injected via environment variables at runtime.
RUN SECRET_KEY=build-placeholder python manage.py collectstatic --noinput

EXPOSE 8000

# Use Gunicorn for production (App Runner sends traffic to port 8000).
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2", "--threads", "4", "--timeout", "120"]

