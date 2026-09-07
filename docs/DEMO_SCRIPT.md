# 90-Second Recruiter Demo

## 0–10 seconds: Position the problem

“IntegrateX converts a business integration request into a validated, evidence-backed workflow. The AI can propose, but deterministic code controls execution.”

## 10–35 seconds: Compile

Open **Compiler Studio** and compile the provided Stripe-to-HubSpot workflow. Point out:

- Versioned documentation retrieval
- Typed workflow graph
- Evidence count
- Schema and OAuth validation
- Approval gate on the CRM mutation

## 35–60 seconds: Execute

Run the workflow. Show the live trace, idempotent PostgreSQL write and the paused CRM action. Open the approval context and display the proposed record diff.

## 60–80 seconds: Break it

Open **Failure Lab**, inject the HTTP 429 scenario and show classification, retry budget, jittered backoff, dependency isolation and verified recovery.

## 80–90 seconds: Close with engineering evidence

Open **Reliability Signals** and state that the repository includes contract tests, security controls, a reproducible benchmark protocol and Docker-based setup.
