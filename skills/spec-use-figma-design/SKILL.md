---
name: spec-use-figma-design
description: Extract and apply Figma design context for spec-driven UI work across PRODUCT, TECH, and Loop Runner implementation phases. Use when a spec-driven UI feature has a Figma URL or fallback design material so visual intent becomes a product contract, implementation mapping, and verification checklist.
---

# spec-use-figma-design

Turn Figma-backed UI design context into phase-appropriate spec workflow material.

## Overview

Use this skill when a spec-driven feature has UI, interaction, layout, or visual design implications and the user provides a Figma URL or fallback design material. The goal is to make the design usable by future agents without relying on conversation memory.

This skill supports the staged LoopSpec workflow. It does not replace `PRODUCT.md`, `TECH.md`, `GATES.json`, Loop Runner, or human review gates. It must not approve gates, skip required specs, create alternate gate state, or require pixel-perfect validation by default.

## Inputs

Collect only the inputs needed for the current phase:

- Figma URL, ideally with a specific frame, node, screen, or component
- current phase: `PRODUCT`, `TECH`, or Loop Runner implementation
- feature scope: pages, components, flows, states, and viewports in scope
- existing product or design-system context, when available
- existing codebase context, when the phase needs implementation mapping
- fallback material such as screenshots, exports, recordings, or user-provided design notes when direct Figma access is unavailable

If direct Figma access is available in the current agent environment, inspect the relevant design source directly. If it is not available, use fallback material and record the limitation explicitly.

## What to extract

For Figma-backed UI work, identify the design details that affect acceptance:

- source frames, nodes, components, variants, annotations, and relevant assets
- screens and user-visible states, including default, hover, focus, active, selected, disabled, empty, loading, error, and success states when present
- layout structure, content hierarchy, spacing relationships, responsive behavior, and overflow behavior
- copy, labels, icon intent, imagery, and user-visible data formatting
- color, typography, radius, border, shadow, elevation, and motion details when they are acceptance-relevant
- accessibility and focus expectations that are visible or implied by the design
- missing states, unclear responsive behavior, unknown assets, design contradictions, and design-system conflicts

Do not overfit the output to pixel-perfect details unless the product spec explicitly requires that level of fidelity. Prefer user-visible intent and acceptance-relevant constraints.

## PRODUCT phase output

When the current phase is `PRODUCT`, produce a draft that can be incorporated into `PRODUCT.md`.

Output:

- `Design source` content with the Figma URL and specific frame, node, screen, or component references when available
- `Visual contract` content describing user-visible layout structure, content hierarchy, copy, interaction states, responsive expectations, accessibility and focus expectations, and acceptance-relevant visual constraints
- suggested numbered Behavior invariants for visual or interaction expectations that affect acceptance or regression risk
- blocking design questions for missing states, unclear responsive behavior, unknown assets, or contradictions that would force implementation to guess acceptance-critical behavior
- non-blocking design assumptions with their impact
- access limitations, such as unavailable Figma permissions or reliance on screenshots

Keep PRODUCT output implementation-light. Do not prescribe internal components, CSS strategy, framework techniques, state shape, or module boundaries.

## TECH phase output

When the current phase is `TECH`, produce a draft that can be incorporated into `TECH.md`.

Output:

- `Design implementation mapping` content that maps Figma screens, frames, components, states, and assets to code areas
- existing product components, design-system primitives, tokens, icons, assets, and styles that should be reused
- new or extended UI elements only when existing primitives cannot satisfy the approved visual contract cleanly
- responsive and state implementation notes grounded in the current codebase
- design-system conflicts and tradeoffs
- intentional Figma deviations, with reason, expected user-visible result, and whether PRODUCT re-approval is needed
- visual verification plan covering key screens, states, and viewports

TECH output may discuss components, tokens, CSS, state management, assets, and framework-specific choices because those belong in `TECH.md`, not `PRODUCT.md`.

## Loop Runner implementation output

When the current phase is Loop Runner implementation, produce or refresh a visual verification checklist from the approved specs and available design material.

Output:

- Figma source or fallback design context to check
- screens, states, and viewports that must be captured or manually compared
- `VERIFY.md` Design Verification entries for `feature_with_figma`
- expected artifacts such as screenshots, videos, browser captures, or concise manual comparison summaries
- known access limitations or capture limitations
- known visual deviations that should be reported before completion

If implementation reveals that the approved visual contract cannot be met, or matching the design would change user-visible behavior, update `PRODUCT.md` and/or `TECH.md`, reset the relevant `GATES.json` status, and return to the appropriate review gate.

## Fallbacks

Portable agents may not have Figma API, MCP, browser, or plugin access. In that case:

- ask for screenshots, exports, recordings, or design notes only when they are needed for the current phase
- proceed with recorded assumptions when the missing details are non-blocking
- treat missing acceptance-critical visual details as blocking questions
- clearly state which design details were inferred from fallback material instead of read directly from Figma

## Related Skills

- `spec-workflow`
- `spec-loop-runner`
- `spec-write-product`
- `spec-write-tech`
