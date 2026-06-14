# Loop Runner

Loop Runner Implement is the stateful implementation engine for LoopSpec. It runs only after PRODUCT and TECH review gates are approved, `TECH.md` reflects the latest approved `PRODUCT.md`, and no blocking product or technical question remains.

```text
PRODUCT -> Gate -> TECH -> Gate -> Loop Runner Implement -> Verify Matrix -> Report
```

## Core Loop

Each iteration follows:

```text
Plan -> Implement -> Verify -> Fix -> Re-verify -> Record -> Decide
```

The runner always performs:

- Gate Check
- Context Hydration
- Delta Planning
- Atomic Implementation
- Verification
- Result Classification
- State Update
- Continue / Stop / Escalate decision

## Required Artifacts

Loop Runner writes these files under `specs/<id>/`:

- `LOOP_STATE.json`
- `VERIFY.md`
- `REPORT.md`

These files are implementation evidence. They do not replace or extend `GATES.json`.

## LOOP_STATE.json

`LOOP_STATE.json` records resumable implementation state:

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

Supported `status` values:

- `not_started`
- `running`
- `passed`
- `blocked`
- `needs_product_review`
- `needs_tech_review`

Supported decisions:

- `continue`
- `stop_success`
- `stop_blocked`
- `escalate_product`
- `escalate_tech`

## VERIFY.md

`VERIFY.md` is the durable verification matrix. It should include:

- Summary
- Product Verification
- Technical Verification
- Commands
- Remaining Risks

For `feature_with_figma`, include Design Verification.

Verification results should map to approved PRODUCT behavior IDs, TECH requirements, commands, artifacts, and known limitations.

## REPORT.md

`REPORT.md` is the final delivery report. It should include:

- Summary
- Specs and gates
- Loop result
- Verification evidence
- Risks and follow-ups

Generate the report before claiming successful completion.

## Profiles

### feature

Use for new product behavior. Verify product behavior completeness, main paths, relevant empty / loading / error states, compatibility, and TECH requirements.

### feature_with_figma

Use for Figma-backed UI work. This extends `feature` with design context and visual verification. Record Design Verification in `VERIFY.md`.

Return to PRODUCT Gate if Figma conflicts with approved behavior. Return to TECH Gate if design requirements conflict with implementation mapping or component strategy.

### bugfix

Use for known defects. Reproduce or document inability to reproduce before patching. Record root cause, smallest patch, original-path verification, adjacent regression checks, and regression tests when practical.

### refactor

Use for behavior-preserving structural work. Establish a baseline, refactor in small steps, and verify observable behavior remains unchanged.

## Result Classification

Supported verification classifications:

- `passed`
- `failed_compile`
- `failed_test`
- `failed_lint`
- `failed_ui_check`
- `failed_design_check`
- `failed_reproduce`
- `blocked_missing_context`
- `blocked_missing_tool`
- `blocked_spec_conflict`
- `needs_product_review`
- `needs_tech_review`

## Stop Conditions

Stop successfully when:

- all required product behaviors are implemented
- all required technical checks pass or have documented non-blocking limitations
- `VERIFY.md` has no blocking pending item
- `LOOP_STATE.json` has no blockers
- `REPORT.md` exists
- no unapproved spec change is needed

Stop and escalate when:

- product behavior must change
- technical architecture, sequencing, dependencies, or validation strategy must change
- unrelated or destructive changes are required
- verification cannot be executed and no adequate fallback exists
- required context or tools are missing
- `max_iterations` is reached
- the working tree becomes unclear or unsafe
- the agent cannot choose a safe next step

## Out of Scope

Loop Runner intentionally excludes these unless a future approved spec calls for them:

- `TRACE.jsonl`
- dashboards
- loop replay
- multi-agent coordination
- cost reports
- automatic CI orchestration
- complex state-machine visualization
