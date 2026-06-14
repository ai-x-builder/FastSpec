# Figma Design Contract Tech Spec

## Context

This change updates the Markdown skill instructions that drive future spec workflow behavior. The approved product behavior is in `specs/06-feature-figma-design-contract/PRODUCT.md`; this tech spec maps that behavior to concrete documentation and skill changes.

Relevant pre-change surfaces:

- `skills/spec-driven-workflow/SKILL.md:83` — workflow intake already collects linked design material.
- `skills/spec-driven-workflow/SKILL.md:113` — workflow asked whether a Figma mock existed, but did not require design extraction, mapping, or verification.
- `skills/spec-driven-workflow/SKILL.md:225` — final verification allows screenshots or videos when useful for UI-heavy work.
- `skills/spec-write-product/SKILL.md:63` — Figma guidance recorded the mock link and explicit absence only.
- `skills/spec-write-product/SKILL.md:73` — `PRODUCT.md` structure had optional `Figma` but no visual contract section.
- `skills/spec-write-tech/SKILL.md:43` — `TECH.md` structure had no Figma-backed design mapping requirement.
- `skills/spec-write-tech/SKILL.md:53` — validation already owns screenshots and manual verification, which is the right place to add visual verification planning.
- `skills/spec-implement/SKILL.md:86` — implementation verification currently prefers screenshots/videos only when useful.
- `README.md:9` and `README.md:170` — public docs list four skills and must be updated when `spec-use-figma-design` is added.

The repository has no runtime package, parser, or test harness. The implementation surface is the skill Markdown files, README, and this spec directory.

## Proposed changes

Update `skills/spec-driven-workflow/SKILL.md`:

- In intake and PRODUCT phase guidance, treat Figma URLs as design source material that must be interpreted when provided, not only recorded.
- For UI work with Figma, instruct agents to use `spec-use-figma-design` during PRODUCT to produce a design source and visual contract draft.
- In the PRODUCT Review Gate, add Figma-backed criteria: design source recorded, acceptance-relevant visual expectations captured, access limitations recorded, and blocking design questions resolved.
- In the TECH phase guidance, require Figma-backed `TECH.md` files to include design implementation mapping and visual verification planning.
- In the TECH Review Gate, add Figma-backed criteria: implementation mapping and visual verification plan are specific enough to implement without rediscovering design intent.
- In implementation and final verification guidance, require design-source consultation and visual comparison evidence for Figma-backed UI work unless the environment makes capture impossible.
- Keep `GATES.json` unchanged; do not add Figma-specific statuses or metadata.

Update `skills/spec-write-product/SKILL.md`:

- Rename or broaden the current `Figma mocks` guidance into design-source guidance.
- Keep the existing behavior that non-visual work skips Figma questions and UI work with no mock records explicit absence.
- For Figma-backed UI work, require a `Design source` section that includes the Figma URL and specific frame/node/screen/component references when available.
- Add a `Visual contract` optional section, required when a Figma source exists, for user-visible layout structure, content hierarchy, copy, states, responsive expectations, accessibility/focus expectations, and acceptance-relevant visual constraints.
- Require important visual or interaction expectations to appear as numbered Behavior invariants when they affect acceptance or regression risk.
- Classify missing states, unclear responsive behavior, asset uncertainty, and design contradictions as blocking or non-blocking product questions.
- Keep PRODUCT implementation-light: no internal component boundaries, CSS strategy, state shape, or framework-specific techniques.
- Add `spec-use-figma-design` to related skills.

Update `skills/spec-write-tech/SKILL.md`:

- Add `Design implementation mapping` as a conditional required section for Figma-backed UI work.
- Require mapping from Figma screens/frames/components/states/assets to code areas, existing components, design-system primitives, tokens, icons, and assets.
- Require new or extended UI elements only when existing primitives cannot satisfy the Figma-backed behavior cleanly.
- Require intentional Figma deviations to be recorded with reason, user-visible result, and whether PRODUCT re-approval is needed.
- Expand `Testing and validation` guidance so Figma-backed UI work names screens, states, and viewports for visual verification.
- Add TECH gate criteria for Figma-backed implementation mapping and visual verification readiness.
- Add `spec-use-figma-design` to related skills.

Update `skills/spec-implement/SKILL.md`:

- In the read-specs step, require implementers to consult the Figma design source or recorded design context for Figma-backed UI work.
- During implementation, state that design infeasibility or user-visible design changes require spec updates and the relevant gate reset.
- In verification, require screenshots, videos, browser captures, or concise manual comparison summaries for Figma-backed UI screens/states/viewports unless capture is impossible.
- Require final reports to name the Figma source or recorded design context checked and any known visual deviations.
- Add `spec-use-figma-design` to related skills.

Add `skills/spec-use-figma-design/SKILL.md`:

- This new skill is a portable helper, not a gate owner.
- It accepts Figma URL, current phase (`PRODUCT`, `TECH`, or `IMPLEMENT`), feature scope, and available codebase/design-system context.
- If direct Figma access is available, it instructs the agent to inspect the relevant frames, components, variants, annotations, assets, and design tokens.
- If direct Figma access is unavailable, it instructs the agent to request or use screenshots, exports, or user-provided design notes, and to record access limitations explicitly.
- In PRODUCT phase, it outputs a design source and visual contract draft.
- In TECH phase, it outputs a design implementation mapping draft and design-system conflict notes.
- In IMPLEMENT phase, it outputs or refreshes a visual verification checklist.
- It must not approve gates, skip specs, create alternate gate state, or require pixel-perfect validation by default.

Update `README.md`:

- Change the skill count badge from 4 to 5.
- Add `spec-use-figma-design` to the documentation links, architecture diagram, core modules table, and project structure.
- Mention Figma-backed UI design handling in Features or Usage without making Figma mandatory for all UI work.

Do not change the `GATES.json` schema. Do not add scripts, CI checks, automated image diffing, binary screenshots, or generated design artifacts in this implementation.

## Product behavior mapping

- B1-B5: Covered by workflow intake updates and `spec-use-figma-design` fallback/access-limitation guidance.
- B6-B12: Covered by `spec-write-product` design source, visual contract, behavior invariant, question classification, and PRODUCT gate updates.
- B13-B18: Covered by `spec-write-tech` design implementation mapping, token/component reuse guidance, intentional deviation handling, visual verification planning, and TECH gate updates.
- B19-B24: Covered by `spec-implement` design-source consultation, spec-update rules for design infeasibility, visual evidence requirements, and final report guidance.
- B25-B32: Covered by adding `skills/spec-use-figma-design/SKILL.md` with phase-specific inputs, outputs, fallbacks, limitations, and boundaries.

## Testing and validation

Validate this documentation-only implementation with repository checks and targeted review:

- Run `jq . specs/06-feature-figma-design-contract/GATES.json` to verify gate state JSON.
- Run `find skills specs -name '*.md' -print` to confirm the new skill and spec files are discoverable.
- Run `rg -n "spec-use-figma-design|Design source|Visual contract|Design implementation mapping|visual verification|Figma-backed|Figma" skills README.md specs/06-feature-figma-design-contract` to confirm the intended guidance appears in the expected surfaces.
- Run `git diff --check` to catch Markdown whitespace issues.
- Manually inspect the five skill files to verify they preserve staged gates and do not add Figma-specific fields to `GATES.json`.
- Manually inspect README to verify skill count, links, architecture diagram, module table, and project structure stay consistent.

## Risks and mitigations

- Risk: The workflow becomes too heavy for small UI tweaks. Mitigation: keep spec workflow optional for small work, but require the Figma contract once a Figma-backed UI task enters the workflow.
- Risk: Agents over-interpret visual contract as pixel-perfect acceptance. Mitigation: explicitly say pixel-perfect validation is not the default and require known deviations to be documented instead.
- Risk: Portable agents may not have Figma API or MCP access. Mitigation: make direct Figma inspection preferred, with screenshots, exports, or user notes as first-class fallbacks.
- Risk: PRODUCT specs become implementation-heavy. Mitigation: keep visual contract user-visible and move component/token/CSS mapping to TECH.
- Risk: The new skill becomes disconnected from the workflow. Mitigation: reference it from all four existing skills and README.
