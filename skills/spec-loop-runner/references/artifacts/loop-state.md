# LOOP_STATE.json

Use the existing version 1 shape:

```json
{
  "version": 1,
  "feature_id": "example-feature",
  "task_type": "feature",
  "profile": "feature",
  "phase": "loop_runner_implement",
  "iteration": 3,
  "status": "running",
  "current_step": {
    "id": "I3",
    "goal": "Connect UI action to the approved handler",
    "scope": ["FeatureView.swift", "FeatureViewModel.swift"]
  },
  "last_action": "Connected the primary action to the view model.",
  "last_verification": {
    "type": "build",
    "command": "xcodebuild ...",
    "result": "passed",
    "summary": "Build succeeded."
  },
  "next_action": "Add loading and error state tests.",
  "decision": "continue",
  "blockers": [],
  "risks": ["Snapshot verification not yet completed."],
  "stop_conditions": {
    "max_iterations": 8,
    "require_human_review_on_product_change": true,
    "require_human_review_on_tech_change": true
  }
}
```

Supported `status` values are `not_started`, `running`, `passed`, `blocked`, `needs_product_review`, and `needs_tech_review`.

Supported `decision` values are `continue`, `stop_success`, `stop_blocked`, `escalate_product`, and `escalate_tech`.

Supported `last_verification.result` values are `passed`, `failed`, `failed_reproduce`, `blocked`, `needs_product_review`, and `needs_tech_review`.

Supported `last_verification.type` values are `build`, `test`, `lint`, `ui`, `design`, `reproduce`, `manual`, `inspection`, and `other`.
