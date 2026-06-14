# Gate Status JSON Product Spec

## Summary

Persist spec workflow review gate state in each spec directory so future agents can determine whether PRODUCT and TECH review gates have passed without relying only on conversation history.

## Problem

The current spec workflow defines PRODUCT and TECH review gates, but the gate pass state lives only in the conversation or reviewer memory. When a later agent reads the repository, it can see `PRODUCT.md` and `TECH.md`, but it cannot reliably know whether each document has been approved for the next phase.

## Goals

- Add a minimal checked-in `GATES.json` file per spec directory.
- Keep the gate state simple enough for agents and humans to update by hand.
- Preserve the existing staged workflow: PRODUCT before TECH, TECH before implementation.
- Avoid content hashes, revision ids, approval audit fields, or multiple spec artifact support.

## Non-goals

- Detecting manual edits automatically after approval.
- Recording who approved a gate or when approval happened.
- Supporting more than one `PRODUCT.md` or one `TECH.md` in a spec directory.
- Adding CI, pre-commit hooks, or external validation tooling in the first version.

## Assumptions

- Existing spec directories do not need to be backfilled immediately; add `GATES.json` when an existing spec is touched again.
- Agents and humans who modify `PRODUCT.md` or `TECH.md` are responsible for updating `GATES.json` in the same workflow step.

## Behavior

B1. Each spec directory that uses spec-driven workflow contains exactly one gate state file at `specs/<id>/GATES.json`.

B2. `GATES.json` uses this minimal JSON shape:

```json
{
  "version": 1,
  "product": {
    "status": "pending"
  },
  "tech": {
    "status": "pending"
  }
}
```

B3. `version` is required and starts at `1`.

B4. `product.status` and `tech.status` are required and may only be `pending` or `approved`.

B5. A new spec directory starts with both statuses set to `pending`.

B6. Creating or materially modifying `PRODUCT.md` sets both `product.status` and `tech.status` to `pending`.

B7. The PRODUCT Review Gate passes only when the existing review conditions are satisfied and `product.status` is updated to `approved` in `GATES.json`.

B8. Writing `TECH.md` may start only when `product.status` is `approved`.

B9. Creating or materially modifying `TECH.md` sets `tech.status` to `pending` while leaving `product.status` unchanged unless the change also affects product behavior.

B10. The TECH Review Gate passes only when the existing review conditions are satisfied and `tech.status` is updated to `approved` in `GATES.json`.

B11. Implementation may start only when both `product.status` and `tech.status` are `approved`.

B12. If a TECH revision changes product behavior, the workflow updates `PRODUCT.md`, sets both statuses to `pending`, and returns to the PRODUCT Review Gate.

B13. If a user explicitly approves `PRODUCT.md` or explicitly asks to continue to TECH, the agent records that by setting `product.status` to `approved`.

B14. If a user explicitly approves `TECH.md` or explicitly asks to continue to implementation, the agent records that by setting `tech.status` to `approved`.

B15. The JSON file is the source of truth for gate pass state, while `PRODUCT.md` and `TECH.md` remain the source of truth for product behavior and technical implementation plans.
