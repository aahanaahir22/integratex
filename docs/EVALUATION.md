# Evaluation Protocol

The dashboard currently contains clearly seeded demonstration data. Do not present those numbers as measured results on a résumé.

## Reproducible benchmark

Run at least 500 workflow executions across these conditions:

| Condition | Runs | Success criterion |
|---|---:|---|
| Healthy provider responses | 100 | At least 95 complete successfully |
| HTTP 429, recovers within retry budget | 100 | At least 90 recover without operator action |
| Duplicate webhook delivery | 100 | Zero duplicate business records |
| Provider timeout with uncertain outcome | 75 | Zero blind replays; verification or approval occurs |
| Breaking schema change | 75 | Every injected breaking change blocks publication |
| Missing OAuth scope | 50 | Every workflow fails validation before execution |

Record:

- Workflow completion rate
- Transient-failure recovery rate
- Duplicate side-effect count
- P50/P95 orchestration overhead
- Contract-change detection recall
- Documentation citation precision
- Grounded-explanation rate
- High-risk actions executed without approval

Publish hardware, software versions, seed, connector mocks and raw result files alongside the summary.
