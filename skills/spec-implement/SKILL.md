---
name: spec-implement
description: Implement an approved feature only after PRODUCT.md and TECH.md have both passed their review gates, keeping specs and code aligned in the same PR as implementation evolves. Use after the relevant product and technical specs are approved enough to start building.
---

# spec-implement

Implement an approved feature from reviewed `PRODUCT.md` and `TECH.md`.

## Overview

Use this skill only after the relevant product and technical specs are approved enough to start implementation. The goal is to build the feature described by the specs while keeping the checked-in specs and the implementation aligned as the work evolves.

Approved specs should live directly under an id-named directory in `specs/`, for example:

- `specs/APP-1234/PRODUCT.md`, `specs/APP-1234/TECH.md`, and `specs/APP-1234/GATES.json`
- `specs/gh-4567/PRODUCT.md`, `specs/gh-4567/TECH.md`, and `specs/gh-4567/GATES.json`
- `specs/gl-7890/PRODUCT.md`, `specs/gl-7890/TECH.md`, and `specs/gl-7890/GATES.json`
- `specs/vertical-tabs-hover-sidecar/PRODUCT.md`, `specs/vertical-tabs-hover-sidecar/TECH.md`, and `specs/vertical-tabs-hover-sidecar/GATES.json`

The id should match the sibling `PRODUCT.md`, `TECH.md`, and `GATES.json` files. For work that entered spec-driven workflow, all three files are required before implementation. If a change is small enough that both specs would be excessive, it should skip spec-driven workflow instead of using this skill.

In many cases, the implementation should be pushed in the same PR as the product and tech specs. As the engineer iterates, changes to `PRODUCT.md`, `TECH.md`, and the code should all be pushed in that same PR so review stays anchored to the feature that will actually ship.

## Prerequisites

Before using this skill:

- confirm that `PRODUCT.md` exists
- confirm that `TECH.md` exists
- confirm that `GATES.json` exists
- confirm that `product.status` is `approved` in `GATES.json`, which is the persisted record that PRODUCT Review Gate passed
- confirm that `tech.status` is `approved` in `GATES.json`, which is the persisted record that TECH Review Gate passed
- confirm that `TECH.md` is based on the latest reviewed `PRODUCT.md`

If `TECH.md` or `GATES.json` is missing, either status is not `approved`, or `PRODUCT.md` changed after `TECH.md` without a corresponding TECH update, do not implement yet. Return to the relevant spec phase.

## Workflow

### 1. Read the approved specs first

Treat:

- `PRODUCT.md` as the source of truth for user-facing behavior
- `TECH.md` as the source of truth for architecture, sequencing, tradeoffs, risks, and validation

Make sure you understand the expected behavior, constraints, risks, and validation plan before writing code.

### 2. Offer optional implementation aids for large features

For large or long-running features, optionally offer one of these aids to the user before implementation begins:

- `PROJECT_LOG.md` to track checkpoints, explored paths, partial findings, and current implementation state
- `DECISIONS.md` to capture concrete product and technical decisions made during spec design and implementation

These are optional aids, not required deliverables. Offer them when they would reduce confusion or help future agents avoid re-exploring the same paths.

### 3. Plan and implement against the specs

Break the work into concrete implementation steps, then implement the feature against the approved specs.

During implementation:

- keep behavior aligned with `PRODUCT.md`
- keep architecture and sequencing aligned with `TECH.md`
- add or update tests and verification artifacts as the work lands

Use the same PR for the specs and implementation when practical so the full feature evolution is reviewable in one place.

### 4. Update specs as the implementation evolves

If implementation reveals that the intended behavior or design should change, update the checked-in specs rather than letting them go stale.

In particular:

- update `PRODUCT.md` when user-facing behavior, UX, edge cases, behavior invariants, or externally visible acceptance expectations change
- update `TECH.md` when architecture, sequencing, module boundaries, or validation strategy change
- update `GATES.json` in the same step: PRODUCT changes set both statuses to `pending`; TECH-only changes set `tech.status` to `pending`
- after any status reset, return to the relevant review gate and get the affected status back to `approved` before considering implementation complete
- keep those updates in the same PR as the corresponding code changes

If a `PRODUCT.md` change invalidates `TECH.md`, update `TECH.md` from the latest reviewed product spec before continuing broad implementation.

The PR should describe the feature that actually ships, not just the initial draft of the specs.

### 5. Verify against the specs

Before considering the work complete, verify that the code matches both current specs and that `GATES.json` has both statuses set to `approved`.

Prefer:

- unit tests using the repository's existing test framework
- integration or end-to-end tests for important user flows
- manual verification artifacts, screenshots, or videos when useful for UI-heavy work

## Best Practices

- Keep specs and code synchronized throughout implementation.
- Prefer updating the spec immediately when decisions change rather than batching spec cleanup until the end.
- Use optional tracking documents only when they add real value for a complex feature.
- Keep the same PR coherent: spec updates, code changes, tests, and optional tracking docs should all support the same feature narrative.

## Related Skills

- `spec-driven-workflow`
- `spec-write-product`
- `spec-write-tech`
