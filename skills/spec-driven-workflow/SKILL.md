---
name: spec-driven-workflow
description: Drive a staged spec-first workflow for substantial features by deciding whether specs are needed, writing PRODUCT.md first, waiting for PRODUCT review before TECH.md, waiting for TECH review before implementation, and keeping both specs current. Use when starting a significant feature, planning agent-driven implementation, or when the user wants gated product and tech specs checked into source control.
---

# spec-driven-workflow

Drive a staged spec-first workflow for substantial features in the target product, app, service, API, CLI, library, or data model.

## Overview

Use this skill for significant features where written specs will improve implementation quality, reduce ambiguity, or make review easier. Be pragmatic: not every change needs specs. Small, local, low-risk work can skip this workflow after a brief rationale.

Once a task enters spec-driven workflow, both specs and the gate state file are required:

- `specs/<id>/PRODUCT.md`
- `specs/<id>/TECH.md`
- `specs/<id>/GATES.json`

### id-named

`<id>` should match the product and tech spec skills:

- a Linear ticket number, such as `specs/APP-1234/PRODUCT.md`
- a GitHub issue id prefixed with `gh-`, such as `specs/gh-4567/PRODUCT.md`
- a GitLab issue id prefixed with `gl-`, such as `specs/gl-7890/PRODUCT.md`
- a short kebab-case feature name, such as `specs/vertical-tabs-hover-sidecar/PRODUCT.md`

`specs/` should contain only id-named directories as direct children. Do not create engineer-named subdirectories there.

Ticket / issue references are optional. If the user has a Linear ticket, GitHub issue, or GitLab issue, use its id. If they do not, ask for a short feature name to use as the directory id. Only create a new ticket or issue when the user explicitly asks for one; use the relevant Linear, GitHub, or GitLab tools, and ask the user directly if required project, team, repo, labels, or metadata are unclear.

These specs should largely be written by agents, not by hand, and should be checked into source control so they can be reviewed and kept current with the code.

### gate state

`GATES.json` is the source of truth for review gate pass state. It uses this minimal shape:

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

`product.status` and `tech.status` may only be `pending` or `approved`. Do not add content hashes, revision ids, approval timestamps, approver fields, or support for multiple product or tech artifacts. Existing spec directories that do not have `GATES.json` can be backfilled when that spec is touched again.

Gate state updates are part of the workflow:

- a new spec directory starts with both statuses set to `pending`
- creating or materially modifying `PRODUCT.md` sets both statuses to `pending`
- passing PRODUCT Review Gate sets `product.status` to `approved`
- writing or materially modifying `TECH.md` sets `tech.status` to `pending`
- passing TECH Review Gate sets `tech.status` to `approved`
- writing `TECH.md` requires `product.status` to be `approved`
- starting implementation requires both statuses to be `approved`

## When specs are required

Strongly prefer specs when the change is substantial, such as:

- product or architectural ambiguity
- expected implementation size around 1k+ LOC
- deep or cross-cutting stack changes
- risky behavior changes where regressions would be expensive
- work where agent quality will improve materially from clearer inputs
- UI work with a Figma design source when visual states, responsive behavior, layout, or interaction fidelity materially affect acceptance

Specs are often unnecessary for:

- small, local bug fixes
- straightforward refactors
- narrow UI tweaks with little ambiguity

If the change is too small to justify both `PRODUCT.md` and `TECH.md`, do not enter spec-driven workflow. Implement directly and verify instead.

## Workflow

### 1. Intake

Collect enough context to understand the problem and target scope:

- user request
- linked ticket, issue, design source such as a Figma URL, or other source material
- target users or consumers
- core scenarios and known constraints
- initial blocking and non-blocking questions

Blocking questions prevent the current phase from advancing. Non-blocking questions can move forward only when the current assumption and impact are recorded.

For UI, interaction, layout, or visual design work, ask whether a Figma source exists. If the user provides one, treat it as source material that must be interpreted during the relevant spec phases, not merely copied into `PRODUCT.md`. If the design cannot be accessed directly, ask for screenshots, exports, or design notes when needed and record the limitation.

### 2. Decide whether the feature needs specs

Evaluate the size, ambiguity, and risk of the feature. If specs will not meaningfully improve execution or review, skip this workflow with a brief rationale and focus on implementation and verification.

If you enter spec-driven workflow, do not skip either spec or `GATES.json`. `PRODUCT.md` must be written and reviewed before `TECH.md`; `TECH.md` must be written and reviewed before implementation.

### 3. Write PRODUCT.md

Before implementation, create `PRODUCT.md` describing the desired user-facing behavior. Also create or update sibling `GATES.json` so both statuses are `pending`.

Use the `spec-write-product` skill to produce it. The product spec should define:

- what problem is being solved
- the desired user experience
- invariants and edge cases
- optional BDD-style examples under important numbered invariants when concrete scenarios reduce ambiguity
- every user-visible state, transition, and behavior that must not regress
- the design source and visual contract for Figma-backed UI work
- blocking and non-blocking product open questions

If the feature has UI or interaction design, ask for a Figma design source if one exists. If one is provided, use `spec-use-figma-design` during PRODUCT to extract a design source and visual contract draft. If there is no Figma source, continue but call that out explicitly in the product spec.

Reference the source ticket, issue, or feature id in the spec when one exists.

Do not generate `TECH.md` in the same phase as `PRODUCT.md`.

### 4. PRODUCT Review Gate

After writing or materially changing `PRODUCT.md`, stop before technical planning. Present a concise PRODUCT Review Gate handoff:

- state whether blocking product questions remain
- if no blockers remain, ask the user to approve `PRODUCT.md` or explicitly request the TECH phase
- if blockers remain, show a concise list of all blocking product questions so the user can see the full gate scope
- even when the full blocker list is shown, actively clarify only one blocking question at a time, choosing the one that most directly unlocks the next `PRODUCT.md` revision
- for the active blocking question, provide suggested answer options only when they reduce user effort or clarify a real product tradeoff; provide one or two options, make them product-behavior choices rather than implementation plans, and mark a recommended option with a short product-focused reason when there is one
- summarize non-blocking questions as recorded assumptions and impact, not as required answers
- after the user answers a blocking question, update `PRODUCT.md`, keep both statuses `pending`, and return to the PRODUCT Review Gate

Selecting a suggested option answers only that blocking question. It does not approve the whole `PRODUCT.md` unless the user also explicitly approves the product spec or asks to continue to TECH.

The gate passes only when:

- the user explicitly approves `PRODUCT.md`, or explicitly asks to continue to the TECH phase
- no blocking open questions remain
- non-blocking questions have recorded assumptions and impact
- the behavior is specific enough that `TECH.md` does not need to guess product intent
- for Figma-backed UI work, the design source is recorded, acceptance-relevant visual expectations are captured, access limitations are noted, and blocking design questions are resolved
- `product.status` is updated to `approved` in `GATES.json`

If the gate does not pass, update `PRODUCT.md`, keep both statuses `pending`, and remain in the product phase.

### 5. Write TECH.md

After the PRODUCT Review Gate passes and `product.status` is `approved`, use the `spec-write-tech` skill to produce `TECH.md` from the latest reviewed `PRODUCT.md` and current codebase research.

`TECH.md` should cover:

- how the current system works
- modules, types, interfaces, data flow, or ownership boundaries that will change
- implementation plan and key tradeoffs
- risks and mitigations
- testing and validation plan
- mapping from numbered `PRODUCT.md` behaviors and any important BDD-style examples to concrete verification
- for Figma-backed UI work, design implementation mapping and visual verification planning

`TECH.md` must not redefine product behavior or conflict with `PRODUCT.md`. If technical research shows the product behavior is infeasible or should change, return to the product phase, update `PRODUCT.md`, and pass PRODUCT Review Gate again before updating `TECH.md`.

For Figma-backed UI work, use `spec-use-figma-design` during TECH to map the relevant frames, components, states, assets, and visual constraints to code areas, existing components, design-system primitives, tokens, and verification steps.

If `PRODUCT.md` changes after `TECH.md` is generated, treat `TECH.md` as stale until it is updated from the latest reviewed product spec.

### 6. TECH Review Gate

After writing or materially changing `TECH.md`, set `tech.status` to `pending` in `GATES.json` and stop before implementation. Present a concise TECH Review Gate handoff:

- state whether blocking technical questions remain
- if no blockers remain, ask the user to approve `TECH.md` or explicitly request implementation
- if blockers remain, show a concise list of all blocking technical questions so the user can see the full gate scope
- even when the full blocker list is shown, actively clarify only one blocking technical question at a time, choosing the one that most directly unlocks the next `TECH.md` revision
- for the active blocking question, provide suggested answer options only when they reduce user effort or clarify a real implementation tradeoff; provide one or two options, make them technical plan choices rather than product behavior changes, and mark a recommended option with a short reason focused on codebase fit, risk reduction, implementation clarity, or validation confidence when there is one
- summarize non-blocking technical questions as recorded assumptions and impact, not as required answers
- if the user's answer changes product behavior, update `PRODUCT.md`, set both statuses to `pending`, and return to PRODUCT Review Gate before revising TECH again
- otherwise, after the user answers a blocking technical question, update `TECH.md`, keep `tech.status` as `pending`, and return to the TECH Review Gate

Implementation cannot begin while any blocking technical question remains. Selecting a suggested option answers only that blocking technical question. It does not approve the whole `TECH.md` unless the user also explicitly approves the technical spec or asks to continue to implementation.

The gate passes only when:

- the user explicitly approves `TECH.md`, or explicitly asks to continue to implementation
- no blocking technical questions remain
- non-blocking technical questions have recorded assumptions and impact
- the technical plan is consistent with `PRODUCT.md`
- key risks, module boundaries, and validation steps are clear
- for Figma-backed UI work, the implementation mapping and visual verification plan are specific enough that the implementer does not need to rediscover design intent
- implementation can start without redesigning the main approach
- `tech.status` is updated to `approved` in `GATES.json`

If the gate does not pass, update `TECH.md` and keep `tech.status` as `pending`. If the update affects product behavior, update `PRODUCT.md`, set both statuses to `pending`, and pass PRODUCT Review Gate again.

### 7. Implement approved specs

After both review gates pass and both statuses are `approved` in `GATES.json`, use the `spec-implement` skill to build from the approved `PRODUCT.md` and `TECH.md`.

For Figma-backed UI work, the implementer should consult the Figma source or recorded design context before changing code, and can use `spec-use-figma-design` to refresh the visual verification checklist.

The implementation can often be pushed in the same PR as the product and tech specs. As the engineer iterates, keep `PRODUCT.md`, `TECH.md`, code changes, and tests in that same PR so the review reflects the feature that will actually ship.

For large features, the implementer may optionally offer:

- `PROJECT_LOG.md` to track explored paths, checkpoints, and current implementation state
- `DECISIONS.md` to capture concrete product and technical decisions made during design and implementation

These are optional aids, not required outputs.

### 8. Keep specs current during implementation

If implementation changes from the spec, update the spec rather than leaving it stale.

Update `PRODUCT.md` when:

- user-facing behavior changes
- UX details or edge cases change
- behavior invariants or externally visible acceptance expectations change
- acceptance-relevant visual contract details change for Figma-backed UI work

When `PRODUCT.md` changes, set both statuses in `GATES.json` to `pending`.

Update `TECH.md` when:

- the implementation approach changes
- architectural boundaries move
- risks, dependencies, or rollout details change
- the testing or validation plan changes
- design implementation mapping or visual verification strategy changes for Figma-backed UI work

When `TECH.md` changes without changing product behavior, set `tech.status` in `GATES.json` to `pending`.

After any status reset during implementation, return to the relevant review gate and get the affected status back to `approved` before considering the work complete.

The checked-in specs should describe the feature that actually ships, not just the initial intent. Keep those spec updates in the same PR as the related code changes whenever practical.

### 9. Verify behavior against the specs

Before considering the work complete, make sure verification maps back to both specs and that `GATES.json` has both statuses set to `approved`. Prefer tests and artifacts that validate the product behavior directly, including any important BDD-style examples recorded under `PRODUCT.md` behavior items:

- unit tests using the repository's existing test framework
- integration or end-to-end tests for critical user flows
- walkthroughs, screenshots, videos, or other artifacts when useful for UI-heavy work
- for Figma-backed UI work, screenshots, videos, browser captures, or concise manual comparison summaries for the relevant screens, states, and viewports unless capture is impossible; final reporting should name the design source checked and any known visual deviations

## Best Practices

- Be pragmatic above all else.
- Skip the workflow for small work; once you enter it, enforce the gates.
- Keep product specs behavior-oriented and implementation-light.
- Keep tech specs implementation-oriented and grounded in current codebase patterns.
- Use review time to validate specs and behavior, not to over-index on code style nits.

## Related Skills

- `spec-implement`
- `spec-use-figma-design`
- `spec-write-product`
- `spec-write-tech`
