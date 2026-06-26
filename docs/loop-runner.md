# Loop Runner

Loop Runner Implement is the stateful implementation engine for FastSpec. It runs only after PRODUCT and TECH review gates are approved, `TECH.md` reflects the latest approved `PRODUCT.md`, and no blocking product or technical question remains.

```text
PRODUCT -> Gate -> TECH -> Gate -> Loop Runner Implement -> Verify Matrix -> Review -> Report
```

## Core Loop

Each iteration follows a Coordinator-led role loop:

```text
Coordinator -> Planner -> Implementer -> Verifier -> Reviewer -> Coordinator decision
```

The runner always performs:

- Gate Check
- Context Hydration
- Delta Planning
- Atomic Implementation
- Verification
- Independent Review
- State and Trace Update
- Continue / Stop / Escalate decision

The roles and handoff protocol are defined below. Roles can be performed by separate agents or by one runtime that records which role is acting.

## Required Artifacts

Loop Runner writes these files under `specs/<id>/`:

- `AGENT_ASSIGNMENTS.json`
- `LOOP_STATE.json`
- `TRACE.jsonl`
- `VERIFY.md`
- `REVIEW.md`
- `REPORT.md`

These files are implementation evidence. They do not replace or extend `GATES.json`.

## Role Responsibilities

The Coordinator owns loop flow and decisions. It confirms prerequisites, initializes role assignments, records trace entries, and decides continue, stop, block, or gate escalation.

The Planner defines only the next smallest meaningful step: goal, scope, verification method, and handoff artifacts.

The Implementer changes only the current planned scope. It stops when the required work exceeds approved PRODUCT, approved TECH, or the current step.

The Verifier checks the result and updates `VERIFY.md`.

The Reviewer independently checks scope control, spec compliance, code quality, and risk, then updates `REVIEW.md`.

## LOOP_STATE.json

`LOOP_STATE.json` records resumable implementation state and keeps its existing version 1 shape:

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

## AGENT_ASSIGNMENTS.json

`AGENT_ASSIGNMENTS.json` records the fixed role protocol for the current run: feature id, active status, current owner, role assignments, responsibilities, inputs, outputs, and handoff artifacts.

Supported role ids are:

- `coordinator`
- `planner`
- `implementer`
- `verifier`
- `reviewer`

## TRACE.jsonl

`TRACE.jsonl` is append-only audit evidence. Every non-empty line is a JSON object for one role action or handoff and includes `agent`, `role`, event, summary, iteration, and timestamp.

Trace records are for audit and resumption context. FastSpec does not promise automated trace replay.

## VERIFY.md

`VERIFY.md` is the durable verification matrix. It should include:

- Summary
- Product Verification
- Technical Verification
- Commands
- Remaining Risks

For `feature_with_figma`, include Design Verification.

Verification results should map to approved PRODUCT behavior IDs, TECH requirements, commands, artifacts, and known limitations.

## REVIEW.md

`REVIEW.md` records independent review and should include:

- Summary
- Scope Review
- Spec Compliance
- Code Quality
- Risks
- Reviewer Decision

Reviewer decisions can accept the implementation, request changes, block completion, or recommend PRODUCT or TECH gate escalation. Reviewer decisions do not approve PRODUCT or TECH gates.

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

Supported `last_verification.result` values:

- `passed`
- `failed`
- `failed_reproduce`
- `blocked`
- `needs_product_review`
- `needs_tech_review`

Supported `last_verification.type` values:

- `build`
- `test`
- `lint`
- `ui`
- `design`
- `reproduce`
- `manual`
- `inspection`
- `other`

Use `result` for runner decisions and `type` for the source of the verification evidence. For example, a lint failure is `result: failed` with `type: lint`; a missing tool is `result: blocked` with the missing tool named in the summary, blockers, or risks.

`lint` means a validation command provided by the target repository or product environment. FastSpec does not require or ship a built-in lint script.

## Stop Conditions

Stop successfully when:

- all required product behaviors are implemented
- all required technical checks pass or have documented non-blocking limitations
- `VERIFY.md` has no blocking pending item
- `LOOP_STATE.json` has no blockers
- `TRACE.jsonl` records the implementation history
- `REVIEW.md` has a non-blocking reviewer decision
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

- dashboards
- trace replay
- cost reports
- automatic CI orchestration
- automated multi-agent scheduling
- complex state-machine visualization
