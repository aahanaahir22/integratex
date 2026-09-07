# AWS Deployment Target

| Concern | AWS service |
|---|---|
| Edge and React assets | CloudFront + S3 |
| FastAPI and worker containers | ECS Fargate |
| Relational state | RDS PostgreSQL |
| Celery broker/cache | ElastiCache Redis |
| Credential references | Secrets Manager |
| Encryption keys | KMS |
| Logs, metrics and alerts | CloudWatch + OpenTelemetry collector |
| Public ingress | Application Load Balancer + WAF |

Production deployment should run the API and worker as separate ECS services, use private subnets for RDS/Redis, restrict worker egress to connector allow-lists and keep every credential outside container images and environment files.
