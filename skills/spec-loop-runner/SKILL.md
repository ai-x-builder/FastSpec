---
name: spec-loop-runner
description: Execute the stateful Loop Runner Implement phase after PRODUCT.md and TECH.md have both passed their review gates. Use when an approved spec-driven task is ready for Coordinator-led multi-role implementation, verification matrix updates, independent review, and delivery reporting.
---

# spec-loop-runner

Execute implementation after the PRODUCT and TECH gates as a stateful, verifiable, Coordinator-led role loop.

Loop Runner Implement is not just "write code from `TECH.md`." It is the post-gate execution engine for FastSpec:

```text
Coordinator -> Planner -> Implementer -> Verifier -> Reviewer -> Coordinator decision
```

Each iteration chooses the smallest meaningful implementation step, changes only that scope, runs the smallest useful verification, records the result, receives independent review, and decides whether to continue, stop, block, or return to a review gate.

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

- existing `specs/<id>/AGENT_ASSIGNMENTS.json`
- existing `specs/<id>/LOOP_STATE.json`
- existing `specs/<id>/TRACE.jsonl`
- existing `specs/<id>/VERIFY.md`
- existing `specs/<id>/REVIEW.md`
- Figma source or recorded design context
- bug report, reproduction notes, logs, traces, crash reports, or screenshots
- existing tests, scripts, CI docs, package metadata, and local validation commands
- repository or component `AGENTS.md`

## Required Artifacts

Loop implementation writes these files under the same `specs/<id>/` directory:

- `AGENT_ASSIGNMENTS.json` — role ownership, responsibilities, inputs, outputs, and handoff artifacts.
- `LOOP_STATE.json` — current loop state and last iteration result.
- `TRACE.jsonl` — append-only role action and handoff trace.
- `VERIFY.md` — verification matrix for product behavior, technical requirements, commands, and risks.
- `REVIEW.md` — independent review of scope, spec compliance, code quality, risks, and reviewer decision.
- `REPORT.md` — final delivery report.

These artifacts are implementation evidence. They do not approve PRODUCT or TECH gates and do not add fields to `GATES.json`.

## Roles

### Loop Runner / Coordinator

The Coordinator owns state flow. It confirms gates, initializes or resumes assignments, records trace entries, moves work between roles, and decides whether to continue, stop successfully, stop blocked, or escalate to PRODUCT or TECH review.

### Planner Agent

The Planner converts approved `TECH.md` and current loop state into the smallest meaningful implementation step. It defines step goal, scope, verification method, and handoff artifacts. It does not edit code, change product behavior, or redesign the approved technical plan.

### Implementer Agent

The Implementer executes only the current scoped task. If the work requires behavior outside approved `PRODUCT.md`, technical direction outside approved `TECH.md`, unrelated cleanup, or broader scope than planned, it stops and hands the issue back to the Coordinator.

### Verifier Agent

The Verifier runs the smallest useful validation, classifies the result, and updates `VERIFY.md` with evidence, command results, limitations, blockers, and remaining risks.

### Reviewer Agent

The Reviewer independently checks scope control, spec compliance, code quality, and delivery risk. It updates `REVIEW.md` and can request rework, block completion, or recommend PRODUCT or TECH gate escalation. It does not approve PRODUCT or TECH gates.

The same runtime may perform multiple roles, but artifacts must still record the role currently acting.

## Core Loop

Every iteration follows the same runner core:

1. Gate Check: Coordinator reconfirms the approved gate state.
2. Context Hydration: Coordinator reads approved specs, current loop artifacts, relevant code, tests, configs, and source material before editing.
3. Assignment Update: Coordinator updates `AGENT_ASSIGNMENTS.json` when ownership or role inputs change.
4. Delta Planning: Planner chooses the smallest meaningful step that can be independently verified.
5. Atomic Implementation: Implementer changes only the files and behavior needed for that step.
6. Verification: Verifier runs the smallest validation that can prove or falsify the step.
7. Review: Reviewer checks scope, spec compliance, code quality, and risk.
8. Record: update `LOOP_STATE.json`, append `TRACE.jsonl`, update `VERIFY.md`, and update `REVIEW.md`.
9. Decision: Coordinator continues, stops successfully, stops blocked, or escalates to PRODUCT or TECH review.

Do not bundle unrelated feature work, refactoring, style cleanup, test rewrites, and documentation changes into one loop step unless the approved `TECH.md` explicitly calls for that combined change.

## Delta Planning Rules

A valid iteration has:

- a clear goal
- a small scope
- an explicit verification method
- a failure path that can be understood and fixed
- no unrelated cleanup
- named handoff artifacts

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
- reviewer decision in `REVIEW.md`

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
8. receive independent review

Do not perform unrelated refactoring. If root cause changes the approved technical plan, return to TECH Review Gate.

### refactor

Use for structure improvement without behavior change.

The loop must:

1. establish the behavior baseline
2. confirm protection tests or equivalent verification
3. refactor in small steps
4. verify behavior remains unchanged after each step
5. avoid public API or product behavior changes unless explicitly approved
6. receive independent review

Stop if behavior must change, protection is inadequate, or the refactor requires a larger migration than `TECH.md` approved.

## Result Classification

After each verification, set `last_verification.result` to one of:

- `passed`
- `failed`
- `failed_reproduce`
- `blocked`
- `needs_product_review`
- `needs_tech_review`

Set `last_verification.type` to the verification source:

- `build`
- `test`
- `lint`
- `ui`
- `design`
- `reproduce`
- `manual`
- `inspection`
- `other`

Use `result` to choose the next action:

- `passed`: continue to review, then continue to the next step or stop successfully.
- `failed`: inspect evidence, make the smallest understood fix, and rerun the relevant verification type.
- `failed_reproduce`: return to reproduction or stop blocked with evidence.
- `blocked`: stop blocked and name the missing context, missing tool, spec conflict, fallback attempted, or other blocker in `summary`, `blockers`, or `risks`.
- `needs_product_review`: update `PRODUCT.md`, reset both gate statuses to `pending`, and return to PRODUCT Review Gate.
- `needs_tech_review`: update `TECH.md`, set `tech.status` to `pending`, and return to TECH Review Gate.

## Artifact Templates

When creating or updating Loop Runner artifacts, read only the relevant template under `references/artifacts/`:

- `agent-assignments.md` for `AGENT_ASSIGNMENTS.json`
- `loop-state.md` for `LOOP_STATE.json`
- `trace-jsonl.md` for `TRACE.jsonl`
- `verify.md` for `VERIFY.md`
- `review.md` for `REVIEW.md`
- `report.md` for `REPORT.md`

`VERIFY.md` should be updated throughout implementation, not only at the end. Generate `REPORT.md` before claiming successful completion.

## Successful Stop Conditions

Stop successfully only when:

- all required product behaviors are implemented
- all required technical checks pass or have documented non-blocking limitations
- `VERIFY.md` has no blocking pending item
- no blocker remains in `LOOP_STATE.json`
- `TRACE.jsonl` records the implementation history
- `REVIEW.md` has a non-blocking reviewer decision
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
- Reviewer Agent requests gate escalation

Product behavior changes return to PRODUCT Review Gate and reset both gate statuses to `pending`. TECH-only changes return to TECH Review Gate and set `tech.status` to `pending`.

## Out of Scope

Do not add these unless a future approved spec calls for them:

- dashboards
- trace replay
- cost reports
- automatic CI orchestration
- automated multi-agent scheduling
- complex state-machine visualization

## Related Skills

- `spec-workflow`
- `spec-use-figma-design`
- `spec-write-product`
- `spec-write-tech`
