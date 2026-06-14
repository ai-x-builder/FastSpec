# Spec-Driven Workflow Optimization Product Spec

## Summary

Update the spec workflow skills so substantial work follows an explicit staged process: intake, spec necessity decision, PRODUCT creation, PRODUCT review gate, TECH creation, TECH review gate, implementation, and verification. Once a task enters spec-driven workflow, `PRODUCT.md` and `TECH.md` are both required and must be produced in sequence, not in parallel.

## Problem

Agents can currently produce `PRODUCT.md` and `TECH.md` together, start technical planning before product behavior is reviewed, or enter implementation without a clear gate. That makes it hard to tell whether the technical spec was derived from the product spec and increases the chance that implementation follows guessed behavior.

## Goals

- Keep small, local, low-risk work free from unnecessary spec ceremony.
- Make spec-driven workflow strict once it is chosen.
- Make `PRODUCT.md` the reviewed source of user-visible behavior.
- Make `TECH.md` a derived plan based on the latest reviewed `PRODUCT.md`.
- Prevent implementation from starting before both spec gates have passed.

## Non-goals

- Changing the `specs/<id>/` path convention.
- Adding new tooling, scripts, or generated metadata.
- Rewriting the behavior example reference.

## Behavior

B1. The workflow begins with intake. The agent collects the user request, linked ticket or issue, design context, target users, core scenarios, known constraints, and enough repository context to summarize the desired scope.

B2. During intake, the agent separates unresolved questions into blocking and non-blocking questions. Blocking questions prevent the current phase from advancing; non-blocking questions may proceed only when the agent records the current assumption and its impact.

B3. The agent explicitly decides whether the work needs spec-driven workflow. Small, local, low-risk fixes may skip the workflow with a brief rationale and proceed directly to implementation and verification.

B4. If the agent decides to enter spec-driven workflow, both `specs/<id>/PRODUCT.md` and `specs/<id>/TECH.md` become required outputs for that workflow.

B5. The product phase creates only `PRODUCT.md`. It describes user-visible behavior, consumer-facing API behavior, states, transitions, edge cases, permissions, failures, cancellations, and invariants. It does not include implementation plans, module boundaries, data flow, algorithms, or testing strategy.

B6. `PRODUCT.md` uses numbered, stable behavior invariants so `TECH.md` can map implementation and validation back to product behavior.

B7. `PRODUCT.md` records open questions as blocking or non-blocking. If any blocking open question remains, the workflow stays in the product phase.

B8. After creating or materially changing `PRODUCT.md`, the agent stops before generating `TECH.md` and presents the PRODUCT Review Gate. The gate passes only when the user explicitly approves the product spec or explicitly asks to continue to the TECH phase, and no blocking open questions remain.

B9. The tech phase starts only after the PRODUCT Review Gate passes. The agent reads the latest reviewed `PRODUCT.md`, researches the current codebase, and writes `TECH.md` as an implementation plan derived from that product behavior.

B10. `TECH.md` explains the current system, planned module/type/interface/data-flow changes, key tradeoffs, risks and mitigations, and the validation strategy. It maps important `PRODUCT.md` behavior invariants to concrete tests, checks, or manual verification steps.

B11. `TECH.md` must not redefine product behavior or conflict with `PRODUCT.md`. If technical research shows that a product behavior is infeasible or should change, the agent returns to the product phase, updates `PRODUCT.md`, and waits for PRODUCT Review Gate again before updating `TECH.md`.

B12. If `PRODUCT.md` changes after `TECH.md` is written, the existing `TECH.md` is considered stale until it is updated against the latest reviewed `PRODUCT.md`.

B13. After creating or materially changing `TECH.md`, the agent stops before implementation and presents the TECH Review Gate. The gate passes only when the user explicitly approves the technical spec or explicitly asks to continue to implementation, and the plan remains consistent with `PRODUCT.md`.

B14. Implementation starts only after both PRODUCT and TECH review gates have passed. The implementer treats `PRODUCT.md` as the source of truth for behavior and `TECH.md` as the source of truth for implementation structure, sequencing, tradeoffs, risks, and validation.

B15. During implementation, if behavior changes, `PRODUCT.md` is updated. If architecture, sequencing, module boundaries, risks, or validation strategy changes, `TECH.md` is updated. The relevant gate must be revisited when those changes invalidate the next phase.

B16. Verification checks the shipped work against both specs. The final report names the tests, checks, screenshots, recordings, or manual evidence used to validate the key product behaviors and technical validation plan.
