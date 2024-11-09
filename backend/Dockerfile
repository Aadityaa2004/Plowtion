FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create model directory
RUN mkdir -p ./model

EXPOSE 5001

# Use environment variable for Flask
ENV FLASK_APP=app.py
ENV FLASK_ENV=development

CMD ["python", "app.py"]