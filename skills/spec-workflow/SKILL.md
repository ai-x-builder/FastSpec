---
name: spec-workflow
description: "Drive the FastSpec workflow for substantial agent-driven work: PRODUCT.md, PRODUCT gate, TECH.md, TECH gate, Loop Runner Implement, verification matrix, and report. Use when starting significant work, planning agent implementation, or keeping specs and loop evidence in source control."
---

# spec-workflow

Drive the FastSpec workflow for substantial features, bug fixes, refactors, UI work, APIs, CLIs, libraries, or data models.

FastSpec is:

```text
PRODUCT -> Gate -> TECH -> Gate -> Loop Runner Implement -> Verify Matrix -> Review -> Report
```

FastSpec is fast by design. It should preserve product intent, technical intent, verification evidence, and resumability with the smallest useful amount of durable process. Small local changes can still skip the workflow. Once work enters FastSpec, the specs, gate state, and implementation evidence are source-controlled so future agents and reviewers can understand what was approved, what was built, how it was verified, and whether the loop finished cleanly.

Compared with heavier agent workflow systems such as superpowers, keep the core path narrow: no platform scheduler, dashboard, replay engine, broad approval metadata, database state, or generated workflow bureaucracy unless a future approved spec explicitly adds it.

## Required Artifacts

Every spec-driven task requires:

- `specs/<id>/PRODUCT.md`
- `specs/<id>/TECH.md`
- `specs/<id>/GATES.json`

After implementation starts, Loop Runner also writes:

- `specs/<id>/AGENT_ASSIGNMENTS.json`
- `specs/<id>/LOOP_STATE.json`
- `specs/<id>/TRACE.jsonl`
- `specs/<id>/VERIFY.md`
- `specs/<id>/REVIEW.md`
- `specs/<id>/REPORT.md`

`GATES.json` remains the only review-gate state file. Loop artifacts do not approve gates.

## Spec Directory Ids

`<id>` should be one of:

- a Linear ticket number, such as `APP-1234`
- a GitHub issue id prefixed with `gh-`, such as `gh-4567`
- a GitLab issue id prefixed with `gl-`, such as `gl-7890`
- a short kebab-case feature name, such as `vertical-tabs-hover-sidecar`

`specs/` should contain only id-named directories as direct children. Do not create engineer-named subdirectories there.

Only create a new ticket or issue when the user explicitly asks for one.

## Gate State

`GATES.json` uses this minimal shape:

```json
{
  "version": 1,
  "product": {
    "status": "pending"
  },
  "tech": {
    "status": "pending"
  }
}
```

`product.status` and `tech.status` may only be `pending` or `approved`.

Do not add content hashes, revision ids, approval timestamps, approver fields, comments, loop state, role assignments, trace events, reviewer decisions, or custom workflow states to `GATES.json`. Loop implementation evidence belongs in Loop Runner artifacts such as `LOOP_STATE.json`, `AGENT_ASSIGNMENTS.json`, `TRACE.jsonl`, `VERIFY.md`, `REVIEW.md`, and `REPORT.md`.

Gate updates:

- new spec directory: both statuses `pending`
- creating or materially changing `PRODUCT.md`: both statuses `pending`
- passing PRODUCT Review Gate: `product.status = "approved"`
- creating or materially changing `TECH.md`: keep product approved, set `tech.status = "pending"`
- passing TECH Review Gate: `tech.status = "approved"`
- implementation requires both statuses `approved`
- product behavior change during implementation: update PRODUCT, set both statuses `pending`, return to PRODUCT Review Gate
- technical-plan change during implementation: update TECH, set `tech.status = "pending"`, return to TECH Review Gate

## When Specs Are Required

Strongly prefer FastSpec for:

- product or architectural ambiguity
- expected implementation size around 1k+ LOC
- deep or cross-cutting changes
- risky behavior changes where regressions would be expensive
- work where agent quality improves materially from durable inputs
- UI work where Figma, visual states, responsive behavior, layout, or interaction fidelity affect acceptance

Specs are often unnecessary for:

- small local bug fixes
- straightforward refactors
- narrow UI tweaks with little ambiguity

If specs will not improve execution or review, skip the workflow with a brief rationale and implement directly.

When FastSpec is used, keep it fast: ask only blocking questions, write the smallest useful spec, stop at clear gates, run small Loop Runner iterations, and record evidence directly in the repository artifacts.

## Phase 1: Intake

Collect enough context to decide scope and workflow fit:

- user request
- linked ticket, issue, design source, bug report, crash report, or other source material
- target users, callers, or consumers
- core scenarios and constraints
- blocking and non-blocking questions

For UI, interaction, layout, or visual design work, ask whether a Figma source exists. If provided, treat it as source material for PRODUCT, TECH, and Loop Runner verification.

## Phase 2: PRODUCT.md

Use `spec-write-product` to create or update `PRODUCT.md`.

PRODUCT owns user-visible or consumer-observable behavior:

- problem and desired outcome
- stable numbered behavior invariants such as `B1`, `B2`, and `B3`
- optional BDD-style examples such as `B4-E1`
- edge cases, limits, unavailable states, errors, and non-goals
- visual contract for Figma-backed UI work
- blocking and non-blocking product questions

Do not write `TECH.md` in the same phase. After creating or materially changing PRODUCT, set both gate statuses to `pending` and stop at PRODUCT Review Gate.

## Phase 3: PRODUCT Review Gate

The gate passes only when:

- the user explicitly approves `PRODUCT.md` or asks to continue to TECH
- no blocking product questions remain
- non-blocking questions have recorded assumptions and impact
- behavior is specific enough that TECH does not need to guess product intent
- Figma-backed visual expectations are captured when design matters
- `product.status` is updated to `approved`

If the gate does not pass, revise PRODUCT and remain in this phase.

## Phase 4: TECH.md

Use `spec-write-tech` after PRODUCT is approved.

TECH owns the implementation plan:

- current codebase context and research evidence
- files, modules, APIs, data flow, ownership boundaries, or components that will change
- proposed implementation plan and key tradeoffs
- mapping from `B*` and important `B*-E*` IDs to implementation and verification
- testing and validation plan
- risks and mitigations
- design implementation mapping for Figma-backed UI work

TECH must not redefine product behavior. If research shows product behavior must change, return to PRODUCT Review Gate.

After creating or materially changing TECH, keep product approved, set `tech.status` to `pending`, and stop at TECH Review Gate.

## Phase 5: TECH Review Gate

The gate passes only when:

- the user explicitly approves `TECH.md` or asks to continue to implementation
- no blocking technical questions remain
- non-blocking technical questions have recorded assumptions and impact
- TECH is consistent with PRODUCT
- module boundaries, risks, and validation steps are clear enough for implementation
- Figma-backed implementation mapping and visual verification plans are clear enough when design matters
- `tech.status` is updated to `approved`

If the gate does not pass, revise TECH and remain in this phase. If the revision changes product behavior, return to PRODUCT Review Gate.

## Phase 6: Loop Runner Implement

After both review gates pass, use `spec-loop-runner` as the implementation engine.

Before editing, Loop Runner confirms:

- `PRODUCT.md`, `TECH.md`, and `GATES.json` exist
- `product.status = "approved"`
- `tech.status = "approved"`
- `TECH.md` reflects the latest approved `PRODUCT.md`
- no blocking product or technical question remains
- the working tree is understood when Git is used
- required context, code, tests, configs, and design or bug material have been read

Loop Runner executes repeated Coordinator-led role iterations:

```text
Coordinator -> Planner -> Implementer -> Verifier -> Reviewer -> Coordinator decision
```

Each iteration:

- has Planner choose the smallest meaningful implementation step
- has Implementer change only that scope
- has Verifier run the smallest useful verification
- has Reviewer independently check scope, spec compliance, code quality, and risk
- classifies the result
- updates `AGENT_ASSIGNMENTS.json` when role ownership changes
- updates `LOOP_STATE.json`
- appends `TRACE.jsonl`
- updates `VERIFY.md`
- updates `REVIEW.md`
- decides whether to continue, stop, block, or return to a gate

Supported profiles:

- `feature`
- `feature_with_figma`
- `bugfix`
- `refactor`

## Phase 7: Verify Matrix

`VERIFY.md` is the durable verification matrix. It maps:

- product behaviors to evidence
- technical requirements to evidence
- commands to results
- design expectations to evidence for `feature_with_figma`
- pending manual checks and remaining risks

The matrix is updated during implementation, not only at the end.

## Phase 8: Report

`REVIEW.md` records independent review before successful completion. It summarizes:

- scope control
- spec compliance
- code quality
- delivery risks
- reviewer decision

`REPORT.md` is generated before successful completion. It summarizes:

- what shipped
- spec and gate state
- loop profile, iteration count, and final decision
- validation commands and artifacts
- behavior evidence
- remaining risks and follow-ups

Successful completion requires both gates approved, no blocking pending verification item, no loop blocker, `TRACE.jsonl` evidence, a non-blocking `REVIEW.md` reviewer decision, and a generated report.

## Keep Specs Current During Implementation

If implementation diverges from the approved specs, update the spec instead of leaving it stale.

Update `PRODUCT.md` when user-facing behavior, UX, edge cases, behavior invariants, or acceptance-relevant visual expectations change. Set both gate statuses to `pending` and return to PRODUCT Review Gate.

Update `TECH.md` when architecture, sequencing, module boundaries, dependencies, risks, or validation strategy change without product behavior changes. Set `tech.status` to `pending` and return to TECH Review Gate.

Do not complete implementation while affected gate state is pending.

## Best Practices

- Keep FastSpec fast; prefer the shortest durable path over extra process.
- Be pragmatic; skip the workflow when specs add no value.
- Once work enters FastSpec, enforce both gates.
- Keep PRODUCT behavior-oriented and implementation-light.
- Keep TECH grounded in current codebase research.
- Keep implementation scoped to approved specs.
- Record assignments, loop state, trace events, verification evidence, and review evidence so future agents can resume or audit the work.
- Use review time to validate behavior and plan quality, not style nits.

## Related Skills

- `spec-loop-runner`
- `spec-use-figma-design`
- `spec-write-product`
- `spec-write-tech`
