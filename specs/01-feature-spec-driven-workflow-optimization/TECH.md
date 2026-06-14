# Spec-Driven Workflow Optimization Technical Spec

## Context

The product spec in `specs/01-feature-spec-driven-workflow-optimization/PRODUCT.md` requires a stricter staged workflow: product first, technical planning second, and implementation only after both review gates pass.

This repository contains four spec workflow skills under `skills/`:

- `skills/spec-driven-workflow/SKILL.md:12` is the umbrella workflow and owns the decision to skip small work or enter the gated flow.
- `skills/spec-write-product/SKILL.md:23` owns the product-only phase and PRODUCT Review Gate.
- `skills/spec-write-tech/SKILL.md:25` owns reviewed-product prerequisites, codebase research, product behavior mapping, and TECH Review Gate.
- `skills/spec-implement/SKILL.md:25` owns implementation prerequisites and spec synchronization during implementation.

The contract is: skipping workflow is still allowed for small work, but once the workflow is chosen, `PRODUCT.md` and `TECH.md` are mandatory staged artifacts with review gates between phases.

## Proposed Changes

Update `skills/spec-driven-workflow/SKILL.md` to become the orchestration source of truth:

- Keep the pragmatic spec necessity decision.
- Replace optional `TECH.md` language with: once spec-driven workflow is chosen, `PRODUCT.md` and `TECH.md` are both required.
- Add a gated workflow covering intake, spec necessity decision, product spec, PRODUCT Review Gate, tech spec, TECH Review Gate, implementation, spec synchronization, and verification.
- Define that a direct user instruction to continue to the next named phase counts as the review signal when no blocking open questions remain.
- State that `TECH.md` is stale when `PRODUCT.md` changes after TECH generation.

Update `skills/spec-write-product/SKILL.md`:

- Clarify that the skill produces only `PRODUCT.md`.
- Require stable numbered behavior invariants for downstream mapping.
- Require open questions to be labeled blocking or non-blocking.
- Require the agent to stop at the PRODUCT Review Gate after writing or materially changing `PRODUCT.md`.
- Keep implementation details, validation planning, and technical tradeoffs out of `PRODUCT.md`.

Update `skills/spec-write-tech/SKILL.md`:

- Require a reviewed `PRODUCT.md` before writing `TECH.md`.
- Require codebase research before drafting.
- Add an explicit product behavior mapping section.
- Require technical infeasibility or product-behavior changes to return to PRODUCT rather than redefining behavior in TECH.
- Require the agent to stop at the TECH Review Gate after writing or materially changing `TECH.md`.

Update `skills/spec-implement/SKILL.md`:

- Require both approved `PRODUCT.md` and approved `TECH.md`.
- Remove product-only implementation language.
- Require stale TECH detection when PRODUCT changed after TECH.
- Keep specs synchronized during implementation and verification.

## Product Behavior Mapping

- B1-B4: Covered by the new `spec-driven-workflow` intake and spec necessity stages.
- B5-B8: Covered by `spec-write-product` product-only output, open question classification, stable behavior IDs, and PRODUCT Review Gate.
- B9-B13: Covered by `spec-write-tech` reviewed-product prerequisite, code research, behavior mapping, stale TECH handling, and TECH Review Gate.
- B14-B16: Covered by `spec-implement` prerequisites, spec synchronization rules, and final verification expectations.

## Testing and Validation

- Review all four updated `SKILL.md` files for the old optional TECH language:
  - `rg "when present|TECH.md is optional|product spec alone|PRODUCT.md alone|when warranted|did not warrant|does not warrant" skills`
- Verify the intended staged terms are present:
  - `rg "PRODUCT Review Gate|TECH Review Gate|blocking open question|stale" skills`
- Verify the split spec exists:
  - `test -f specs/01-feature-spec-driven-workflow-optimization/PRODUCT.md`
  - `test -f specs/01-feature-spec-driven-workflow-optimization/TECH.md`
- Inspect `git diff --check` to catch whitespace errors.

## Risks and Mitigations

- Risk: The stricter workflow could overburden small changes. Mitigation: keep the explicit "skip workflow for small, local, low-risk work" decision.
- Risk: Agents may stall waiting for review signals. Mitigation: define explicit user approval or a direct request to continue to the next named phase as a valid gate signal when no blocking questions remain.
- Risk: TECH may drift after PRODUCT changes. Mitigation: state that TECH becomes stale and must be updated from the latest reviewed PRODUCT.
