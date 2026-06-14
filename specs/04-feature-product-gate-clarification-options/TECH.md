# Product Gate Clarification Options Tech Spec

## Context

The approved product behavior is in `specs/04-feature-product-gate-clarification-options/PRODUCT.md`. This tech spec translates that behavior into changes to the spec workflow skill text; it does not redefine the PRODUCT Review Gate behavior.

Relevant current files:

- `skills/spec-workflow/SKILL.md:119` defines the top-level PRODUCT Review Gate.
- `skills/spec-workflow/SKILL.md:121` says the agent stops before technical planning, but it does not describe how to present blockers or how to ask clarification questions.
- `skills/spec-workflow/SKILL.md:123` through `skills/spec-workflow/SKILL.md:127` defines the gate pass conditions.
- `skills/spec-workflow/SKILL.md:129` says failed gates stay in the product phase.
- `skills/spec-write-product/SKILL.md:56` through `skills/spec-write-product/SKILL.md:61` classifies blocking and non-blocking questions before writing.
- `skills/spec-write-product/SKILL.md:86` defines how open questions are represented in `PRODUCT.md`.
- `skills/spec-write-product/SKILL.md:140` through `skills/spec-write-product/SKILL.md:150` defines the PRODUCT Review Gate inside the product-writing skill.

The repo implements these workflows as Markdown skill instructions, so the implementation is documentation/instruction text rather than runtime code.

## Proposed Changes

Update `skills/spec-workflow/SKILL.md` in the PRODUCT Review Gate section:

- Add gate handoff guidance after the "stop before technical planning" sentence.
- Require the agent to say whether blocking product questions remain.
- When blockers remain, require a concise list of all blocking product questions.
- Require the agent to actively clarify one blocking question at a time, prioritizing the question that unlocks the next PRODUCT revision.
- State that the agent returns to PRODUCT Review Gate after updating `PRODUCT.md` from each blocking answer, with gate statuses still pending.
- State that TECH cannot begin while any blocking product question remains.
- For the currently active blocking question, allow suggested options only when they reduce user effort or clarify a real product tradeoff.
- Limit suggested options to one or two.
- Require suggested options to be product-behavior choices, not implementation plans.
- Require recommended options to be marked with a short product-focused reason.
- Clarify that selecting a suggested option does not approve the whole `PRODUCT.md` unless the user also approves the spec or asks to continue to TECH.
- Keep existing gate pass conditions and `GATES.json` rules intact.

Update `skills/spec-write-product/SKILL.md` in the PRODUCT Review Gate section with the same operational detail, but make it the more explicit source for the product-writing phase:

- Add a short "Gate handoff" paragraph or bullet list under `## PRODUCT Review Gate`.
- Preserve the existing pass criteria and failure behavior.
- Cross-reference existing open-question classification instead of changing the `PRODUCT.md` file structure.
- Keep non-blocking behavior tied to recorded assumptions and impact.

Do not change `skills/spec-write-tech/SKILL.md`. Its prerequisites already require approved PRODUCT state and no remaining blocking product questions; the new behavior is owned by the PRODUCT phase and top-level workflow.

## Product Behavior Mapping

- B1 maps to preserving the existing stop-before-TECH rule in both `skills/spec-workflow/SKILL.md` and `skills/spec-write-product/SKILL.md`.
- B2 maps to the new gate handoff requirement to state whether blocking product questions remain and request approval or TECH only when none remain.
- B3 maps to limiting active clarification to product-behavior blockers and excluding broad preference or implementation questions.
- B4 maps to showing a concise list of all blocking product questions when multiple blockers remain.
- B5 and B6 map to the one-question-at-a-time clarification loop and the return to PRODUCT Review Gate after each PRODUCT revision.
- B7 through B10 map to the suggested-option rules for the active blocking question.
- B11 and B12 map to preserving non-blocking assumptions as recorded assumptions with impact, and making the handoff distinguish blockers from assumptions.
- B13 maps to the failed-gate path: update `PRODUCT.md`, keep statuses pending, and remain in the product phase.
- B14 maps to preserving the existing approval condition and `product.status = approved` transition.
- B15 maps to the explicit statement that choosing a suggested option does not approve the whole product spec.

## Testing and Validation

Validation is text-based because the change is instruction-only:

- Inspect `skills/spec-workflow/SKILL.md` and confirm the PRODUCT Review Gate describes the full blocker list, one-question-at-a-time clarification, 1-2 suggested options, non-blocking assumptions, and no TECH while blockers remain. Covers B1-B15 at the top-level workflow.
- Inspect `skills/spec-write-product/SKILL.md` and confirm the product-writing skill contains the same gate handoff behavior without changing the required `PRODUCT.md` structure. Covers B1-B15 for the actual product phase skill.
- Inspect `skills/spec-write-tech/SKILL.md` and confirm no change is required because it already treats approved PRODUCT and no remaining blockers as prerequisites.
- Inspect `specs/04-feature-product-gate-clarification-options/GATES.json` and confirm `product.status` is `approved` and `tech.status` remains `pending` after writing this TECH spec.
- Run `git diff --check` to catch trailing whitespace or patch formatting issues.

## Risks and Mitigations

- Risk: Duplicating gate handoff guidance in two skill files can drift over time. Mitigation: keep the top-level workflow concise and make `spec-write-product` the detailed operational guidance for the product phase.
- Risk: Agents may over-ask by listing all blockers and then asking all of them at once. Mitigation: state both requirements together: show the complete blocker list, but clarify only one active blocker per turn.
- Risk: Suggested options may become technical designs. Mitigation: explicitly constrain options to user-visible behavior or workflow impact.
