# Conditional Mermaid Guidance Tech Spec

## Context

This feature changes the skill instructions that generate future `PRODUCT.md` and `TECH.md` files. The approved product behavior is in `specs/03-feature-conditional-mermaid-guidance/PRODUCT.md`; this tech spec does not redefine it.

Relevant current files:

- `skills/spec-write-product/SKILL.md:73` defines the allowed `PRODUCT.md` structure and optional sections. It currently lists `Problem`, `Goals / Non-goals`, `Figma`, and `Open questions`, but has no Diagram or Mermaid guidance.
- `skills/spec-write-product/SKILL.md:89` defines the Behavior section as the product spec's core. This is the right place to preserve the invariant that diagrams must not replace numbered behavior items.
- `skills/spec-write-product/SKILL.md:118` gives general writing guidance for product specs. It can reinforce that product diagrams must be clarity-driven rather than decorative.
- `skills/spec-write-tech/SKILL.md:43` defines the required `TECH.md` structure and optional sections.
- `skills/spec-write-tech/SKILL.md:58` already has a `Diagram` optional section, but its wording is narrow: diagrams are allowed only when faster than prose and examples are limited to data flow, state transitions, and sequence across layers.
- `skills/spec-workflow/SKILL.md:131` describes the TECH phase at the workflow level. This should stay unchanged because the approved product spec explicitly excludes adding Mermaid diagrams to the workflow documentation itself.

The implementation is a documentation/skill-instruction change, not runtime code. There are no parser, schema, or generation functions in this repository to update.

## Proposed changes

Update `skills/spec-write-product/SKILL.md`:

- Add `Diagram` as an optional product spec section.
- Describe it as restrained and conditional: include Mermaid only for complex product behavior such as branching journeys, role or permission interactions, lifecycle states, state transitions, or cross-module product interactions.
- State that product diagrams should be omitted for short linear flows or when they merely duplicate the numbered Behavior list.
- Add dedicated Mermaid guidance near the Behavior guidance so the instruction is visible when agents are deciding how to write behavior.
- Preserve the existing requirements that `PRODUCT.md` is behavior-first, implementation-light, and driven by stable numbered invariants.

Update `skills/spec-write-tech/SKILL.md`:

- Expand the existing `Diagram` optional section instead of adding a new structural concept.
- Make the TECH guidance more active than the product guidance by naming architecture, data movement, request flow, state transitions, async work, migrations, and integrations as good diagram candidates.
- Keep diagrams optional and conditional: one or two focused diagrams, no decorative diagrams, and no diagrams for small or clearer-as-prose plans.
- Require concise prose around diagrams so implementation intent and validation remain reviewable without relying on a diagram alone.
- Mention suitable Mermaid types only as guidance, not a mandatory taxonomy.

Do not update `skills/spec-workflow/SKILL.md` in this change. That file owns stage order and review gates; adding diagram-generation details there would conflict with the non-goal in `PRODUCT.md`.

## Product behavior mapping

- B1, B2, B3 map to the new `Diagram` optional section and Mermaid guidance in `skills/spec-write-product/SKILL.md`.
- B4, B5, B6 map to the expanded `Diagram` optional section and Mermaid guidance in `skills/spec-write-tech/SKILL.md`.
- B7 maps to both skill files by requiring diagrams to be accompanied by prose and not be the only source of required meaning.
- B8 maps primarily to `skills/spec-write-product/SKILL.md` by keeping Behavior as numbered invariants, and secondarily to `skills/spec-write-tech/SKILL.md` by keeping product behavior mapping tied to those invariants.
- B9 maps to both skill files through explicit conditional wording.
- B10 maps to both files as lightweight examples of Mermaid types matched to use cases.
- B11 maps to both files through guidance against decorative, oversized, or vague diagrams.
- B12 maps to keeping all existing required sections and review-gate instructions intact.

## Testing and validation

Validation is documentation-focused:

- Inspect `skills/spec-write-product/SKILL.md` and verify it allows Mermaid diagrams only for complex product behavior, keeps diagrams optional, and preserves numbered Behavior invariants. Covers B1, B2, B3, B7, B8, B9, B10, B11, and B12.
- Inspect `skills/spec-write-tech/SKILL.md` and verify it encourages Mermaid diagrams more actively than PRODUCT for technical flows while still making them conditional. Covers B4, B5, B6, B7, B9, B10, B11, and B12.
- Run `rg -n "Diagram|Mermaid|mermaid|diagram" skills/spec-write-product/SKILL.md skills/spec-write-tech/SKILL.md` to confirm the expected guidance exists in both generation skills.
- Run `git diff --check` to catch whitespace or Markdown formatting issues.
- Do a final `git diff` review to confirm `skills/spec-workflow/SKILL.md` was not changed and the implementation stayed within the approved scope.

## Risks and mitigations

- Risk: Product spec generation becomes too technical. Mitigation: keep PRODUCT wording restrained and tied to observable behavior only.
- Risk: TECH specs start adding decorative diagrams by habit. Mitigation: explicitly require focused diagrams and omit them when prose is clearer.
- Risk: Agents treat diagrams as replacements for behavior or validation. Mitigation: preserve Behavior and Product behavior mapping as required sections and state that diagrams only complement prose.
