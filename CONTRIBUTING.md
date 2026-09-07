# Contributing to IntegrateX

Thanks for improving IntegrateX. Contributions should preserve its central safety boundary: AI may propose a workflow, while deterministic code validates and authorizes execution.

## Development workflow

1. Create a focused branch from `main`.
2. Keep credentials and provider tokens out of source, fixtures and logs.
3. Add or update tests when behaviour changes.
4. Run the complete local quality gate:

   ```bash
   make test
   ```

5. Open a pull request describing the user impact, implementation, test evidence and security implications.

## Engineering standards

- Validate all external input with typed models.
- Treat provider responses and retrieved documentation as untrusted.
- Require idempotency for side-effecting operations.
- Use bounded retries; never retry permanent failures indefinitely.
- Put high-risk or uncertain actions behind explicit approval.
- Redact secrets and personal data from logs and traces.
- Keep seeded demonstration metrics clearly separated from measured benchmarks.

## Commit and pull-request scope

Prefer small, reviewable changes. A pull request should solve one coherent problem and include documentation when it changes architecture, public APIs or trust boundaries.
