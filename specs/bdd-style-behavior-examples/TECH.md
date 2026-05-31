# BDD-Style Behavior Examples Technical Spec

## Context

The approved product behavior is in `specs/bdd-style-behavior-examples/PRODUCT.md`. It keeps the project as behavior-first SDD while adding optional BDD-style examples under important Behavior invariants.

This repository has no runtime package, parser, or test harness. The implementation surface is Markdown documentation and skill instructions:

- `README.md:26` through `README.md:30` defines the public project positioning around reviewed `PRODUCT.md`, derived `TECH.md`, and `GATES.json`.
- `README.md:67` through `README.md:71` lists the core feature bullets, including behavior-first product specs.
- `skills/spec-driven-workflow/SKILL.md:104` through `skills/spec-driven-workflow/SKILL.md:121` describes the PRODUCT phase inputs and output boundary.
- `skills/spec-write-product/SKILL.md:80` through `skills/spec-write-product/SKILL.md:100` defines `## Behavior` as the core product-spec section and stable numbered invariants as the reference format.
- `skills/spec-write-product/SKILL.md:110` through `skills/spec-write-product/SKILL.md:129` lists the behavior coverage expectations that examples can clarify.
- `skills/spec-write-tech/SKILL.md:49` through `skills/spec-write-tech/SKILL.md:55` defines TECH sections, including product behavior mapping and testing/validation.
- `skills/spec-implement/SKILL.md:40` through `skills/spec-implement/SKILL.md:47` tells implementers to treat `PRODUCT.md` as the behavior source of truth and `TECH.md` as the architecture/validation source.
- `skills/spec-write-product/references/behavior-example.md:1` through `skills/spec-write-product/references/behavior-example.md:50` is the concrete model for future Behavior sections.

The main design constraint is to add a convention for examples without changing the staged workflow, `GATES.json`, or the fact that validation strategy belongs in `TECH.md`.

## Proposed changes

Update `README.md`:

- Describe the project as behavior-first Spec-Driven Development with optional BDD-style examples for ambiguous or high-risk behaviors.
- Extend the behavior-first feature bullet so readers understand that `B*` invariants remain the contract and `B*-E*` examples are optional clarifiers.
- Add a short usage/documentation note showing the intended shape at a high level, without making README a full spec-writing manual.

Update `skills/spec-driven-workflow/SKILL.md`:

- In the PRODUCT phase description, state that product behavior may include optional BDD-style examples under important numbered invariants when examples reduce ambiguity.
- In verification guidance, allow verification to map back to both behavior invariants and any important examples.
- Preserve the gate sequence and the rule that `TECH.md` is not generated before PRODUCT approval.

Update `skills/spec-write-product/SKILL.md`:

- Keep `## Behavior` as required and keep `B1`, `B2`, `B3` style invariants as the stable product contract.
- Add a dedicated "BDD-style examples" subsection after the core Behavior guidance and before Mermaid guidance.
- Define the example ID convention as `B<behavior-number>-E<example-number>`.
- Recommend the local shape:

```markdown
B4. When a user exports a filtered report, the exported file contains only records matching the active filters.

Examples for B4:
- Example B4-E1: Export respects active date filter
  Given the report is filtered to January 2026
  When the user exports the report as CSV
  Then the CSV contains only records dated within January 2026
```

- State when examples are encouraged: branch-heavy rules, permissions, state machines, approvals, filtering, exports, billing, migration, compatibility, and error handling.
- State when examples should be omitted: simple copy/layout changes, obvious happy paths, broad visual contracts, and behavior that is already clearer as a concise invariant.
- State that examples are product-facing, do not replace parent `B*` invariants, do not need to be exhaustive, and must not introduce implementation details or full-file Gherkin structure.
- State that conflicts between examples and invariants are blocking product questions.
- Update writing guidance to mention optional examples.

Update `skills/spec-write-tech/SKILL.md`:

- Expand Product behavior mapping so it can map both `B*` invariants and `B*-E*` examples to implementation areas.
- Expand Testing and validation so examples can map to unit tests, integration tests, end-to-end tests, manual checks, screenshots, or other verification evidence depending on risk.
- Preserve the rule that `PRODUCT.md` owns behavior and `TECH.md` owns validation planning.

Update `skills/spec-implement/SKILL.md`:

- In implementation and verification guidance, refer to approved behavior invariants and any important examples so implementers do not ignore `B*-E*` examples after TECH approval.
- Preserve all gate prerequisites and `GATES.json` rules.

Update `skills/spec-write-product/references/behavior-example.md`:

- Add a small BDD-style example block to one or two existing behavior items, preferably around malformed tables or export/copy behavior where scenarios clarify edge cases.
- Keep the sample mostly invariant-driven so it demonstrates that examples are optional and subordinate to `B*` behavior items.

Do not change:

- `GATES.json` schema or status values.
- Existing completed spec directories except this new spec.
- Any runtime package, tests, dependencies, or generated artifacts.

## Product behavior mapping

- B1-B4: Covered by preserving current required Behavior invariants in `spec-write-product`, updating README positioning, and making examples optional rather than mandatory.
- B5-B8: Covered by the proposed `Examples for B*` shape, stable `B*-E*` IDs, short titles, and lightweight Given / When / Then format in `spec-write-product`.
- B9-B14: Covered by product-facing constraints, no full-file Gherkin replacement, examples as clarifiers rather than source of truth, and conflict handling as a product blocker.
- B15-B17: Covered by `spec-write-tech` mapping and validation updates that reference both invariants and examples while keeping validation strategy out of `PRODUCT.md`.
- B18: Covered by leaving `GATES.json` unchanged and relying on existing product-spec material-change rules.
- B19: Covered by README and skill guidance updates.
- B20: Covered by stating the convention applies to future specs and materially revised existing specs, with no bulk migration.

## Testing and validation

- Run `jq . specs/bdd-style-behavior-examples/GATES.json` to confirm gate state JSON remains valid.
- Run `rg -n "BDD-style|B<behavior-number>-E<example-number>|Examples for B|Given / When / Then|Feature:|Scenario:|B\\*-E\\*" README.md skills specs/bdd-style-behavior-examples` to confirm the new guidance appears in the expected surfaces.
- Run `rg -n "Product behavior mapping|Testing and validation|examples" skills/spec-write-tech/SKILL.md skills/spec-implement/SKILL.md` to verify TECH and implementation guidance reference examples where needed.
- Inspect `skills/spec-write-product/SKILL.md` manually to confirm examples complement the Behavior section and do not replace stable numbered invariants.
- Inspect `skills/spec-write-product/references/behavior-example.md` manually to confirm examples are present but not required for every behavior item.
- Run `git diff --check` to catch whitespace errors.

## Risks and mitigations

- Risk: Agents may overuse examples and bloat every `PRODUCT.md`. Mitigation: explicitly say examples are optional and encouraged only when they reduce ambiguity.
- Risk: Agents may treat examples as a replacement for Behavior invariants. Mitigation: state that parent `B*` invariants remain the product contract and must be understandable without examples.
- Risk: Agents may turn `PRODUCT.md` into executable Gherkin. Mitigation: explicitly avoid full-file `Feature:` / `Scenario:` structures, tags, step definitions, and framework syntax.
- Risk: Important examples may be ignored during implementation. Mitigation: update `TECH.md` and implementation guidance to map and verify `B*-E*` examples when they are important.
