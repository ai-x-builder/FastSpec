# AGENT_ASSIGNMENTS.json

Use this shape. This abbreviated example shows one role entry; a valid file must include all five supported roles.

```json
{
  "version": 1,
  "feature_id": "example-feature",
  "status": "active",
  "current_owner": "coordinator",
  "roles": [
    {
      "role": "planner",
      "agent": "Planner Agent",
      "responsibilities": ["Plan the next smallest step."],
      "inputs": ["PRODUCT.md", "TECH.md", "LOOP_STATE.json"],
      "outputs": ["LOOP_STATE.json", "TRACE.jsonl"],
      "handoff_artifacts": ["LOOP_STATE.json"]
    }
  ]
}
```

Supported role ids are `coordinator`, `planner`, `implementer`, `verifier`, and `reviewer`. The `roles` array must contain exactly one entry for each supported role.
