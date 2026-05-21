# Production Monitoring Stack

A production-grade observability stack built on AWS EC2, featuring real-time metrics collection, visualization, and alerting.

## Architecture

User Traffic → Node.js API → Prometheus → Grafana Dashboard
                                ↓
                          Alertmanager → Slack #alerts
                                ↑
                         Node Exporter (system metrics)

## Tech Stack

- AWS EC2 — Ubuntu 22.04 hosting environment
- Docker and Docker Compose — container orchestration
- Node.js + prom-client — instrumented REST API
- Prometheus — metrics collection and alert rules
- Grafana — visualization dashboards
- Alertmanager — alert routing and Slack notifications
- Node Exporter — system metrics (CPU, memory, disk)

## Features

- HTTP request rate monitoring across all routes
- Error rate tracking with 5xx detection
- p95 response time measurement
- CPU usage monitoring
- Slack alerts when error rate exceeds 5% or CPU exceeds 80%
- Full infrastructure as code — one command to start everything

## Setup Instructions

1. Clone the repository:
git clone https://github.com/JULIET-JULIET632/monitoring-stack.git
cd monitoring-stack

2. Create your environment file:
cp .env.example .env

3. Start the full stack:
docker compose up -d

4. Verify all services are running:
docker compose ps

## Access the Services

Grafana: http://your-ec2-ip:3000 (admin / admin123)
Prometheus: http://your-ec2-ip:9090
Alertmanager: http://your-ec2-ip:9093
Node.js API: http://your-ec2-ip:3001

## Alert Rules

- HighErrorRate: Error rate greater than 5% for 1 minute (Critical)
- HighCPUUsage: CPU greater than 80% for 2 minutes (Warning)

## Author

Juliet — DevOps Engineer
GitHub: https://github.com/JULIET-JULIET632
LinkedIn: https://linkedin.com/in/uchean-juliet-b18b75352
