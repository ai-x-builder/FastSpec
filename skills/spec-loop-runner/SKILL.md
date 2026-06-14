---
name: spec-loop-runner
description: Execute the stateful Loop Runner Implement phase after PRODUCT.md and TECH.md have both passed their review gates. Use when an approved spec-driven task is ready for implementation, verification matrix updates, and delivery reporting.
---

# spec-loop-runner

Execute implementation after the PRODUCT and TECH gates as a stateful, verifiable loop.

Loop Runner Implement is not just "write code from `TECH.md`." It is the post-gate execution engine for LoopSpec:

```text
Plan -> Implement -> Verify -> Fix -> Re-verify -> Record -> Decide
```

Each iteration chooses the smallest meaningful implementation step, changes only that scope, runs the smallest useful verification, records the result, and decides whether to continue, stop, block, or return to a review gate.

## Preconditions

Before starting or resuming a loop, verify:

- `PRODUCT.md` exists.
- `TECH.md` exists.
- `GATES.json` exists.
- `GATES.json` has `product.status = "approved"`.
- `GATES.json` has `tech.status = "approved"`.
- `TECH.md` reflects the latest approved `PRODUCT.md`.
- No blocking product or technical question remains.
- The current work is bounded by the approved specs.
- The working tree is understood before editing when the repository uses Git.

If any gate prerequisite fails, stop and return to the relevant spec phase. Do not implement while either gate is pending.

## Inputs

Required:

- `specs/<id>/PRODUCT.md`
- `specs/<id>/TECH.md`
- `specs/<id>/GATES.json`

Optional, depending on task type and repository:

- existing `specs/<id>/LOOP_STATE.json`
- existing `specs/<id>/VERIFY.md`
- Figma source or recorded design context
- bug report, reproduction notes, logs, traces, crash reports, or screenshots
- existing tests, scripts, CI docs, package metadata, and local validation commands
- repository or component `AGENTS.md`

## Required Artifacts

Loop implementation writes these files under the same `specs/<id>/` directory:

- `LOOP_STATE.json` — current loop state and last iteration result.
- `VERIFY.md` — verification matrix for product behavior, technical requirements, commands, and risks.
- `REPORT.md` — final delivery report.

These artifacts are implementation evidence. They do not approve PRODUCT or TECH gates and do not add fields to `GATES.json`.

## Core Loop

Every iteration follows the same runner core:

1. Gate Check: reconfirm the approved gate state.
2. Context Hydration: read the approved specs, current loop state, relevant code, tests, configs, and source material before editing.
3. Delta Planning: choose the smallest meaningful step that can be independently verified.
4. Atomic Implementation: change only the files and behavior needed for that step.
5. Verification: run the smallest validation that can prove or falsify the step.
6. Result Classification: classify the verification result with a supported value.
7. State Update: update `LOOP_STATE.json` and `VERIFY.md`.
8. Decision: continue, stop successfully, stop blocked, or escalate to PRODUCT or TECH review.

Do not bundle unrelated feature work, refactoring, style cleanup, test rewrites, and documentation changes into one loop step unless the approved `TECH.md` explicitly calls for that combined change.

## Delta Planning Rules

A valid iteration has:

- a clear goal
- a small scope
- an explicit verification method
- a failure path that can be understood and fixed
- no unrelated cleanup

Stop and return to TECH Review Gate if the next needed change is outside `TECH.md`'s module, dependency, architecture, or validation plan. Return to PRODUCT Review Gate if the next needed change alters user-visible behavior or acceptance expectations.

## Profiles

### feature

Use for new product behavior, new modules, new entry points, new interactions, and new capabilities.

Verify:

- required product behaviors from `PRODUCT.md`
- the main success path
- relevant loading, empty, error, and cancellation states
- compatibility with existing behavior
- technical requirements from `TECH.md`

Typical iteration order:

1. data structures, protocols, or feature flags
2. core logic
3. UI or interface skeleton when applicable
4. interactions or API wiring
5. state handling
6. tests
7. verification matrix and report

### feature_with_figma

Use for features that include Figma or fallback design material.

This is the `feature` profile plus design context and visual verification. Before visual implementation, consult the approved visual contract, TECH design mapping, and available Figma or fallback material.

Also verify:

- UI structure
- visible copy
- layout and responsive behavior
- design tokens or accepted style primitives
- assets and icons
- interaction states
- known visual deviations

Add a `Design Verification` section to `VERIFY.md`. If Figma conflicts with `PRODUCT.md`, return to PRODUCT Review Gate. If design requirements conflict with existing components or require a new shared component not covered by `TECH.md`, return to TECH Review Gate.

### bugfix

Use for known defects, crashes, regressions, telemetry issues, and performance bugs.

The loop must:

1. reproduce the bug or document why reproduction is unavailable
2. identify the root cause
3. plan the smallest safe patch
4. implement only that patch
5. verify the original path
6. verify adjacent regression paths
7. add or update regression tests when practical

Do not perform unrelated refactoring. If root cause changes the approved technical plan, return to TECH Review Gate.

### refactor

Use for structure improvement without behavior change.

The loop must:

1. establish the behavior baseline
2. confirm protection tests or equivalent verification
3. refactor in small steps
4. verify behavior remains unchanged after each step
5. avoid public API or product behavior changes unless explicitly approved

Stop if behavior must change, protection is inadequate, or the refactor requires a larger migration than `TECH.md` approved.

## Result Classification

After each verification, classify the result as one of:

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

Use the classification to choose the next action:

- `passed`: continue to the next step or stop successfully.
- `failed_compile`, `failed_test`, `failed_lint`, `failed_ui_check`, `failed_design_check`: inspect evidence, make the smallest understood fix, and rerun relevant verification.
- `failed_reproduce`: return to reproduction or stop blocked with evidence.
- `blocked_missing_context`, `blocked_missing_tool`: stop blocked and name the missing input or tool plus the best fallback attempted.
- `blocked_spec_conflict`: stop and identify whether PRODUCT or TECH review must reopen.
- `needs_product_review`: update `PRODUCT.md`, reset both gate statuses to `pending`, and return to PRODUCT Review Gate.
- `needs_tech_review`: update `TECH.md`, set `tech.status` to `pending`, and return to TECH Review Gate.

## LOOP_STATE.json

Use this shape:

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

## VERIFY.md

Use this structure:

```markdown
# Verification Matrix

## Summary

| Item | Status |
|---|---|
| Product behaviors verified | passed |
| Technical checks verified | passed |
| Build passed | passed |
| Tests passed | passed |
| Manual checks required | none |
| Remaining blockers | none |

## Product Verification

| ID | Product Behavior | Verification Method | Result | Notes |
|---|---|---|---|---|
| B1 | <behavior> | <test or inspection> | passed | <evidence> |

## Technical Verification

| ID | Technical Requirement | Verification Method | Result | Notes |
|---|---|---|---|---|
| T1 | <requirement> | <test or inspection> | passed | <evidence> |

## Commands

| Command | Result | Notes |
|---|---|---|
| node scripts/lint-specs.mjs | passed | Spec lint passed. |

## Remaining Risks

- None.
```

For `feature_with_figma`, add:

```markdown
## Design Verification

| ID | Design Requirement | Verification Method | Result | Notes |
|---|---|---|---|---|
| D1 | <requirement> | <screenshot/manual/inspection> | passed | <evidence> |
```

`VERIFY.md` should be updated throughout implementation, not only at the end.

## REPORT.md

Use this structure:

```markdown
# Implementation Report

## Summary

<What shipped.>

## Specs and gates

| Artifact | State |
|---|---|
| PRODUCT.md | approved |
| TECH.md | approved |
| GATES.json | product=approved, tech=approved |

## Loop result

| Item | Result |
|---|---|
| Profile | feature |
| Final decision | stop_success |
| Iterations | 7 |

## Verification evidence

<Commands, artifacts, behavior evidence, and known manual checks.>

## Risks and follow-ups

<Remaining risks or `None`.>
```

Generate `REPORT.md` before claiming successful completion.

## Successful Stop Conditions

Stop successfully only when:

- all required product behaviors are implemented
- all required technical checks pass or have documented non-blocking limitations
- `VERIFY.md` has no blocking pending item
- no blocker remains in `LOOP_STATE.json`
- `REPORT.md` exists
- no unapproved product or technical spec change is needed

## Escalation Conditions

Stop and escalate when:

- product behavior must change
- technical architecture, sequencing, dependencies, or validation strategy must change
- implementation requires unrelated or destructive changes
- verification cannot be executed and no adequate fallback exists
- required context or tools are missing
- the loop reaches `max_iterations`
- the working tree becomes unclear or unsafe
- the agent cannot choose a safe next step

Product behavior changes return to PRODUCT Review Gate and reset both gate statuses to `pending`. TECH-only changes return to TECH Review Gate and set `tech.status` to `pending`.

## Out of Scope

Do not add these unless a future approved spec calls for them:

- `TRACE.jsonl`
- dashboards
- loop replay
- multi-agent coordination
- cost reports
- automatic CI orchestration
- complex state-machine visualization

## Related Skills

- `spec-workflow`
- `spec-use-figma-design`
- `spec-write-product`
- `spec-write-tech`
