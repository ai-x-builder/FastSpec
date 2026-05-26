# Conditional Mermaid Guidance Product Spec

## Summary

Update the generated spec guidance so agents may add Mermaid diagrams to `PRODUCT.md` and `TECH.md` only when those diagrams clarify meaningful behavior or design. `TECH.md` should encourage diagrams more actively for architecture and flow, while `PRODUCT.md` should remain restrained and use diagrams only for complex product behavior.

## Problem

Generated specs need room for diagrams when flows, states, or architecture are hard to understand in prose alone. At the same time, forcing Mermaid into every `PRODUCT.md` or `TECH.md` would add noise, duplicate simple checklists, and make product specs feel more technical than necessary.

## Goals

- Make Mermaid diagrams an optional clarity tool in generated specs.
- Encourage `TECH.md` to use diagrams for non-trivial architecture, data flow, sequence, state, async, migration, and integration scenarios.
- Keep `PRODUCT.md` more conservative, using diagrams only when product behavior itself has branches, lifecycle states, role interactions, or multi-module user journeys.
- Prevent decorative, redundant, or boilerplate diagrams from becoming required output.

## Non-goals

- Adding Mermaid diagrams to the spec workflow documentation itself.
- Requiring every generated `PRODUCT.md` or `TECH.md` to contain a diagram.
- Replacing prose behavior invariants in `PRODUCT.md` or implementation plans in `TECH.md`.
- Defining a full diagram style guide beyond when diagrams should or should not appear.

## Behavior

B1. When an agent generates `PRODUCT.md`, Mermaid diagrams are optional and restrained. The generated product spec should include a diagram only when it helps readers understand product behavior that is not easily captured by a short list of numbered invariants.

B2. `PRODUCT.md` diagrams are appropriate for user journeys with meaningful branches, role or permission interactions, object lifecycle states, complex state transitions, or cross-module product interactions that affect what the user or consumer observes.

B3. `PRODUCT.md` should omit diagrams for simple linear flows, narrow wording changes, small behavior tweaks, or cases where a diagram would merely restate the numbered Behavior list.

B4. When an agent generates `TECH.md`, Mermaid diagrams are encouraged more actively than in `PRODUCT.md`, but remain optional. The generated tech spec should include a diagram when architecture, data movement, request flow, state transitions, async work, migration sequencing, or integrations are faster to understand visually than in prose alone.

B5. `TECH.md` should prefer one or two focused diagrams over many broad diagrams. A diagram should answer a concrete implementation question, such as how components interact, how data moves, how a request proceeds through layers, or how a background process transitions between states.

B6. `TECH.md` should omit diagrams when the implementation plan is small, single-file, or already clearer as prose and bullets. A diagram must not be added only to satisfy a template habit.

B7. Mermaid diagrams in either spec must complement the surrounding text. Each diagram should be accompanied by concise prose explaining the decision, behavior, or flow that matters; the diagram must not be the only place where required behavior or implementation intent is described.

B8. Mermaid diagrams must not replace stable numbered product behaviors. `PRODUCT.md` remains behavior-first, and `TECH.md` continues to map implementation and validation back to those numbered product behaviors.

B9. The generated guidance should make clear that diagrams are conditional: useful for non-trivial flows, state transitions, architecture, and data movement, but unnecessary when they duplicate a short linear checklist.

B10. If a generated spec includes a Mermaid diagram, the diagram should use a Mermaid type that matches the need: flowchart for branching flows, state diagram for lifecycles, sequence diagram for cross-system interactions, and architecture-style flowchart for system boundaries.

B11. Generated specs should avoid decorative diagrams, oversized diagrams, or diagrams with vague node labels. Diagram content should be specific enough that reviewers can tell why it was included.

B12. Existing generated spec requirements remain intact. `PRODUCT.md` still focuses on observable behavior, states, transitions, edge cases, and invariants; `TECH.md` still focuses on current system context, proposed changes, behavior mapping, risks, and validation.
