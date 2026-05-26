# Tech Gate Clarification Questions Tech Spec

## Context

The approved product behavior is in `specs/tech-gate-clarification-questions/PRODUCT.md`. This change updates the Markdown skill instructions that govern spec workflow behavior after `TECH.md` is written.

Relevant current files:

- `skills/spec-driven-workflow/SKILL.md:160` defines the top-level TECH Review Gate.
- `skills/spec-driven-workflow/SKILL.md:162` says the agent stops before implementation, but it does not describe how to present technical blockers or assumptions.
- `skills/spec-driven-workflow/SKILL.md:164` through `skills/spec-driven-workflow/SKILL.md:168` defines TECH gate pass conditions.
- `skills/spec-driven-workflow/SKILL.md:170` handles failed TECH gates and product-affecting revisions.
- `skills/spec-write-tech/SKILL.md:97` defines the TECH Review Gate inside the TECH-writing skill.
- `skills/spec-write-tech/SKILL.md:99` says the agent stops before implementation, but it does not define a gate handoff shape.
- `skills/spec-write-tech/SKILL.md:101` through `skills/spec-write-tech/SKILL.md:105` defines TECH gate pass conditions.
- `skills/spec-write-tech/SKILL.md:107` handles failed TECH gates and product-affecting revisions.

The repo implements workflow behavior through skill text, so this implementation is a documentation/instruction change rather than runtime code.

## Proposed Changes

Update `skills/spec-driven-workflow/SKILL.md` in the TECH Review Gate section:

- Add a concise TECH Review Gate handoff before the existing pass criteria.
- Require the agent to state whether blocking technical questions remain.
- If no blockers remain, require the agent to ask the user to approve `TECH.md` or explicitly request implementation.
- If blockers remain, require a concise list of all blocking technical questions so the user can see the full gate scope.
- Require the agent to clarify only one blocking technical question at a time, prioritizing the question that most directly unlocks the next `TECH.md` revision.
- State that implementation cannot begin while any blocking technical question remains.
- For the active blocker, allow suggested answer options only when they reduce user effort or clarify a real implementation tradeoff.
- Limit suggested options to one or two.
- Require suggested options to be technical plan choices rather than product behavior changes.
- Require recommended options to include a short reason focused on codebase fit, risk reduction, implementation clarity, or validation confidence.
- Summarize non-blocking technical questions as recorded assumptions and impact, not as required answers.
- State that selecting a suggested option answers only the active technical blocker and does not approve the whole `TECH.md`.
- Preserve the existing rule that product-affecting answers return to PRODUCT and reset both statuses.

Update `skills/spec-write-tech/SKILL.md` in the TECH Review Gate section with the same operational detail, using it as the more explicit source for the TECH-writing phase:

- Add "Gate handoff requirements" under `## TECH Review Gate`.
- Preserve the existing pass criteria and failed-gate behavior.
- Clarify that active blockers are technical blockers: module ownership, architecture choice, migration or rollout risk, validation strategy, dependency choice, or another decision required before implementation.
- Clarify that product behavior changes cannot be resolved only in TECH and must return to PRODUCT.
- Keep `TECH.md` as the place where non-blocking technical assumptions and impact are recorded.

Do not change `skills/spec-implement/SKILL.md`. It already requires both gate statuses to be approved before implementation starts; the handoff behavior belongs to the TECH gate, not the implementation skill.

## Product Behavior Mapping

- B1 maps to preserving the stop-before-implementation rule in both TECH Review Gate sections.
- B2 maps to stating whether blocking technical questions remain and asking for TECH approval or implementation only when none remain.
- B3 maps to defining blocking technical questions in `skills/spec-write-tech/SKILL.md`.
- B4 and B15 map to preserving and expanding the product-affecting revision path back to PRODUCT.
- B5 maps to showing the full concise list of blocking technical questions when multiple blockers remain.
- B6 and B7 map to the one-question-at-a-time clarification loop and no implementation while blockers remain.
- B8 through B11 map to the suggested-option rules for the active technical blocker.
- B12 and B13 map to summarizing non-blocking technical assumptions and impact separately from required blocker answers.
- B14 maps to updating `TECH.md`, keeping `tech.status` pending, and returning to TECH Review Gate after a blocker answer.
- B16 maps to preserving the approval condition and `tech.status = approved` transition.
- B17 maps to the explicit statement that choosing a suggested option does not approve the whole technical spec.

## Testing and Validation

Validation is text-based because the change is instruction-only:

- Inspect `skills/spec-driven-workflow/SKILL.md` and confirm the TECH Review Gate describes blocker presence, no-blocker approval prompt, full blocker list, one-question-at-a-time clarification, one or two suggested options, non-blocking assumptions, no implementation while blockers remain, and product-affecting return to PRODUCT. Covers B1-B17 at the top-level workflow.
- Inspect `skills/spec-write-tech/SKILL.md` and confirm the TECH-writing skill contains the same gate handoff behavior, including the definition of blocking technical questions and the product-behavior boundary. Covers B1-B17 for the actual TECH phase skill.
- Inspect `skills/spec-implement/SKILL.md` and confirm no change is required because it already requires approved PRODUCT and TECH gate states before implementation.
- Inspect `specs/tech-gate-clarification-questions/GATES.json` and confirm `product.status` is `approved` and `tech.status` remains `pending` after writing this TECH spec.
- Run `git diff --check` to catch trailing whitespace or patch formatting issues.

## Risks and Mitigations

- Risk: Agents may treat every implementation detail as a blocker. Mitigation: define blocking technical questions as decisions required before safe implementation; non-blocking assumptions should be recorded with impact instead.
- Risk: TECH gate questions may drift into product decisions. Mitigation: state that product behavior changes must return to PRODUCT and reset both statuses.
- Risk: Duplicating top-level and TECH-writing guidance can drift. Mitigation: keep the top-level workflow concise and make `spec-write-tech` the more explicit operational source for TECH Review Gate behavior.
