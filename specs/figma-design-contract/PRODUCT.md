# Figma Design Contract Product Spec

## Summary

Improve the spec-driven workflow so Figma-backed UI work treats the design as a durable contract, not just a reference link. When a UI feature has a Figma source, future agents must capture the relevant visual intent in `PRODUCT.md`, map it to implementation choices in `TECH.md`, and verify the shipped UI against the design during implementation.

## Problem

Before this change, the workflow asked for a Figma mock and recorded its link, but it did not require the agent to read, extract, map, or verify design details. As a result, implementation could drift from the provided design while still technically satisfying the existing spec workflow.

## Goals / Non-goals

Goals:

- Make Figma-backed UI requirements explicit enough that later agents can continue work without relying on conversation memory.
- Preserve the existing staged workflow: PRODUCT before TECH, TECH before implementation.
- Keep product specs behavior-first while allowing user-visible visual and interaction constraints to become product acceptance expectations.
- Give implementation agents concrete design mapping and visual verification expectations.
- Add a reusable Figma design skill that can support PRODUCT, TECH, and IMPLEMENT phases.

Non-goals:

- Require pixel-perfect implementation for every UI change.
- Require Figma for UI work when no design exists.
- Add automated image-diff tooling or CI enforcement in this change.
- Store Figma exports, screenshots, or generated visual artifacts in every spec directory by default.
- Replace human review gates with automated design validation.

## Behavior

### Workflow Entry

B1. When a feature has UI, interaction, layout, or visual design implications, the workflow asks whether a Figma design source exists before drafting product behavior.

B2. If the user provides a Figma URL, the workflow treats that URL as design source material that must be interpreted during the relevant spec phases, not merely copied into `PRODUCT.md`.

B3. If no Figma source exists for UI work, the workflow records that absence explicitly and continues with assumptions or product questions as appropriate.

B4. If a Figma source exists but cannot be accessed or read by the agent, the workflow records the limitation, asks for screenshots or exported design context when needed, and does not pretend that visual details were verified.

B5. A UI change with a Figma source is considered behaviorally ambiguous until the relevant screens, components, states, and responsive expectations are identified or explicitly declared out of scope.

### PRODUCT Phase

B6. For Figma-backed UI work, `PRODUCT.md` includes a design source section that names the Figma URL and, when available, the specific frame, node, screen, or component references used for the spec.

B7. For Figma-backed UI work, `PRODUCT.md` captures a visual contract: the user-visible layout structure, content hierarchy, copy, interaction states, responsive expectations, accessibility and focus expectations, and other visual or interaction constraints that are acceptance-relevant.

B8. The visual contract remains product-facing. It describes what the user should see or experience, but it does not prescribe internal component boundaries, CSS implementation, state shape, or framework-specific techniques.

B9. The Behavior section references important visual and interaction expectations as stable numbered invariants when those expectations affect acceptance, regressions, or user-visible behavior.

B10. Missing Figma states, unclear responsive behavior, unknown assets, or design contradictions are classified as blocking questions when implementation would otherwise have to guess acceptance-critical behavior.

B11. Non-blocking design uncertainties can proceed only when `PRODUCT.md` records the assumed behavior and the impact of that assumption.

B12. The PRODUCT Review Gate for Figma-backed UI work passes only when the design source is recorded, acceptance-relevant visual expectations are captured, blocking design questions are resolved, and the user explicitly approves `PRODUCT.md` or asks to continue to TECH.

### TECH Phase

B13. For Figma-backed UI work, `TECH.md` includes a design implementation mapping that connects the relevant Figma screens, frames, components, states, and assets to the planned code areas.

B14. The design implementation mapping identifies existing product components, design-system primitives, tokens, styles, icons, and assets that should be reused when they match the Figma intent.

B15. The design implementation mapping calls out new or extended UI elements only when existing components or tokens cannot satisfy the Figma-backed behavior cleanly.

B16. `TECH.md` records any intentional deviation from Figma, including the reason, the expected user-visible result, and whether the deviation requires PRODUCT re-approval.

B17. `TECH.md` includes a visual verification plan for Figma-backed UI work. The plan names the key screens, states, and viewports that must be checked before implementation is considered complete.

B18. The TECH Review Gate for Figma-backed UI work passes only when the implementation mapping and visual verification plan are specific enough that the implementer does not need to rediscover the design intent.

### IMPLEMENT Phase

B19. Before implementing Figma-backed UI work, the implementer reads the approved specs and consults the Figma design source or recorded design context needed to understand the planned visual result.

B20. During implementation, if the design cannot be implemented as specified, or if matching the design would change user-visible behavior, the implementer updates `PRODUCT.md` and/or `TECH.md`, resets the relevant gate status, and returns to the appropriate review gate.

B21. Before considering Figma-backed UI work complete, the implementer verifies the UI against the visual verification plan in `TECH.md`.

B22. Completion evidence for Figma-backed UI work includes screenshots, videos, browser captures, or a concise manual comparison summary for the relevant screens, states, and viewports, unless the implementation environment makes visual capture impossible.

B23. If visual capture is impossible, the final implementation report states what could not be captured, why, and what manual checks were performed instead.

B24. The final implementation report names the Figma source or recorded design context that was checked and calls out any known visual deviations.

### Dedicated Figma Skill

B25. The workflow provides a dedicated `spec-use-figma-design` skill for extracting and applying Figma design context across PRODUCT, TECH, and IMPLEMENT phases.

B26. The dedicated skill accepts a Figma URL, the current workflow phase, the feature scope, and any available codebase or design-system context.

B27. If the agent cannot directly access Figma, the dedicated skill accepts screenshots, exports, or user-provided design notes as fallback input.

B28. In PRODUCT phase, the dedicated skill outputs a design source and visual contract draft suitable for inclusion in `PRODUCT.md`.

B29. In TECH phase, the dedicated skill outputs a design implementation mapping draft suitable for inclusion in `TECH.md`.

B30. In IMPLEMENT phase, the dedicated skill outputs or refreshes a visual verification checklist covering the relevant Figma frames, states, and viewports.

B31. The dedicated skill always reports access limitations, missing design states, design-system conflicts, and user decisions needed before safe implementation.

B32. The dedicated skill supports the staged spec workflow; it does not approve gates, skip required specs, or replace `PRODUCT.md`, `TECH.md`, or `GATES.json`.
