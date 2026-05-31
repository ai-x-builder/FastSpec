# BDD-Style Behavior Examples Product Spec

## Summary

Update the spec workflow so `PRODUCT.md` remains a behavior-first product contract while allowing optional BDD-style examples under important Behavior invariants. The examples should clarify concrete scenarios and edge cases without turning `PRODUCT.md` into a Gherkin test suite or changing the staged SDD gates.

## Problem

The current workflow already makes Behavior the core of `PRODUCT.md`, using stable numbered invariants such as `B1`, `B2`, and `B3`. Some behavior is easier to understand, review, and later test when paired with concrete examples. Without an explicit examples convention, agents may either omit useful scenarios or overcorrect by replacing product invariants with full BDD/Gherkin syntax.

## Goals

- Preserve behavior-first SDD as the project's primary workflow.
- Let `PRODUCT.md` include BDD-style examples when examples reduce ambiguity.
- Keep numbered Behavior invariants as the stable product contract.
- Let `TECH.md` map both invariants and examples to validation.
- Avoid adding new gate states, generated metadata, or tool-specific test framework requirements.

## Non-goals

- Replacing `B1` / `B2` / `B3` invariants with `Feature` / `Scenario` blocks.
- Requiring every Behavior invariant to include examples.
- Requiring Cucumber, Gherkin parsers, or executable BDD tooling.
- Moving validation and testing strategy out of `TECH.md`.
- Changing the `GATES.json` schema or gate approval semantics.

## Behavior

B1. `PRODUCT.md` keeps `## Behavior` as its core section. Behavior items remain stable, numbered, testable product invariants with IDs such as `B1`, `B2`, and `B3`.

B2. A Behavior invariant may include optional BDD-style examples when a concrete scenario helps reviewers understand intended behavior, edge cases, acceptance boundaries, or likely implementation misunderstandings.

B3. BDD-style examples are optional by default. The workflow encourages examples for behavior involving permissions, state machines, approval flows, filtering, exports, billing, migration, compatibility, error handling, or other branch-heavy product rules.

B4. The workflow does not require examples for simple copy changes, small layout changes, obvious happy paths, broad visual contracts, or behavior that is already clearer as a concise invariant.

B5. When examples are present, they are nested under or immediately after the relevant Behavior invariant so readers can see which product contract they clarify.

B6. Each example has a stable ID derived from the parent behavior ID, using the shape `B<behavior-number>-E<example-number>`, such as `B4-E1` and `B4-E2`.

B7. Each example has a short descriptive title. The title states the scenario being clarified, not the implementation mechanism.

B8. Each example may use lightweight Given / When / Then phrasing when that phrasing improves clarity:

```markdown
B4. When a user exports a filtered report, the exported file contains only records matching the active filters.

Examples for B4:
- Example B4-E1: Export respects active date filter
  Given the report is filtered to January 2026
  When the user exports the report as CSV
  Then the CSV contains only records dated within January 2026

- Example B4-E2: Export preserves headers for empty results
  Given the active filters match no records
  When the user exports the report as CSV
  Then the CSV is generated with headers and no data rows
```

B9. Given / When / Then examples remain product-facing. They describe observable preconditions, user or consumer actions, and observable outcomes. They do not describe internal modules, state layout, algorithms, selectors, mocks, fixtures, or framework APIs.

B10. The workflow avoids full-file Gherkin structure in `PRODUCT.md`. `Feature:`, global `Scenario:` suites, tags, step definitions, and executable-test syntax are not required and should not replace product prose.

B11. Examples clarify behavior but do not become the only source of the behavior. The parent `B*` invariant remains understandable and reviewable even if its examples are omitted.

B12. Examples do not need to be exhaustive. They should cover representative happy paths, important edge cases, or ambiguity-prone branches. The Behavior invariants still own the complete product contract.

B13. If an example reveals missing product behavior, the agent updates or adds the relevant `B*` invariant rather than relying on the example alone.

B14. If an example conflicts with its parent invariant or another Behavior item, the conflict is treated as a blocking product question until the product behavior is reconciled.

B15. `TECH.md` maps important Behavior invariants and any important examples to implementation areas and verification steps. A mapping may reference either an invariant alone, such as `B4`, or a specific example, such as `B4-E1`.

B16. `TECH.md` decides the verification level for examples. Depending on risk and repository patterns, examples may map to unit tests, integration tests, end-to-end tests, manual checks, screenshots, or other validation evidence.

B17. `PRODUCT.md` still does not include Validation, Success criteria, or Testing sections. Test planning remains in `TECH.md`; examples in `PRODUCT.md` clarify expected behavior rather than prescribe test implementation.

B18. `GATES.json` remains unchanged. Adding, editing, or removing examples is treated as a material product-spec change when it changes or clarifies acceptance-relevant behavior, so both gate statuses reset to `pending` under the existing rules.

B19. README and skill guidance describe the project as behavior-first Spec-Driven Development with optional BDD-style examples, making clear that BDD examples complement the SDD workflow rather than replacing it.

B20. Existing specs without BDD-style examples remain valid. The examples convention applies to future generated specs and to existing specs only when those specs are materially revised.
