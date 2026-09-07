# Security Policy

## Supported version

Security fixes target the latest commit on `main` while IntegrateX is in active portfolio development.

## Reporting a vulnerability

Please do not disclose exploitable issues in a public GitHub issue. Use GitHub's private vulnerability reporting for this repository when available, and include:

- A concise description and affected component
- Reproduction steps or a minimal proof of concept
- Expected impact
- Suggested mitigation, if known

Reports should not include real credentials, customer data or access tokens. The project owner will acknowledge a complete report, investigate it and coordinate disclosure after a fix is available.

## Demo boundary

The public GitHub Pages deployment is a static, zero-key demonstration. It does not contain provider credentials and does not execute real external side effects. Production adapters must use managed secret references, egress allow-lists, provider signatures, least-privilege OAuth scopes and organisation-scoped identity.
