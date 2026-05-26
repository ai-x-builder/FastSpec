# Gate Status JSON Tech Spec

## Context

`PRODUCT.md` defines a minimal per-spec `GATES.json` that records only PRODUCT and TECH gate status. The current workflow already has staged gates, but the pass state is described only as a conversational prerequisite:

- `skills/spec-driven-workflow/SKILL.md:14` lists `PRODUCT.md` and `TECH.md` as the required artifacts, but not `GATES.json`.
- `skills/spec-driven-workflow/SKILL.md:88` and `skills/spec-driven-workflow/SKILL.md:116` define the PRODUCT and TECH review gates.
- `skills/spec-write-product/SKILL.md:23` requires stopping at PRODUCT Review Gate after creating or materially changing `PRODUCT.md`.
- `skills/spec-write-tech/SKILL.md:27` requires confirming PRODUCT Review Gate before writing `TECH.md`.
- `skills/spec-implement/SKILL.md:27` requires confirming both review gates before implementation.

The repository is documentation-first for this workflow: the implementation surface is the skill Markdown files that agents read and follow. There is no existing parser, CLI, CI check, or test harness for spec state.

## Proposed Changes

Update the workflow documentation in place, keeping the current staged model intact.

1. In `skills/spec-driven-workflow/SKILL.md`, add `specs/<id>/GATES.json` as the required gate-state artifact once a task enters spec-driven workflow. Define the minimal schema exactly as:

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

2. In `skills/spec-driven-workflow/SKILL.md`, add the shared state rules:
   - new spec directories start with both statuses `pending`
   - creating or materially changing `PRODUCT.md` sets both statuses to `pending`
   - PRODUCT gate approval sets `product.status` to `approved`
   - writing or materially changing `TECH.md` sets `tech.status` to `pending`
   - TECH gate approval sets `tech.status` to `approved`
   - TECH may start only when `product.status` is `approved`
   - implementation may start only when both statuses are `approved`

3. In `skills/spec-write-product/SKILL.md`, update the product phase instructions so creating or materially changing `PRODUCT.md` also creates or updates sibling `GATES.json` with both statuses `pending`. The PRODUCT Review Gate section should say that passing the gate includes setting `product.status` to `approved`.

4. In `skills/spec-write-tech/SKILL.md`, update prerequisites to require sibling `GATES.json` and `product.status == "approved"` before writing `TECH.md`. When `TECH.md` is created or materially changed, `tech.status` should be set to `pending`. Passing TECH Review Gate should include setting `tech.status` to `approved`.

5. In `skills/spec-implement/SKILL.md`, update prerequisites to require sibling `GATES.json` and both `product.status` and `tech.status` equal to `approved` before implementation starts. Keep the existing requirement that `TECH.md` must be based on the latest reviewed `PRODUCT.md`; because the schema has no hashes or revisions, this remains a workflow responsibility rather than an automatic check.

6. Do not add scripts, hooks, hash checks, reviewed revision fields, approval timestamps, approver fields, or migration logic for existing spec directories.

## Product Behavior Mapping

- B1-B5: Covered by adding `GATES.json` as a required per-spec artifact and documenting its exact initial schema.
- B6-B7: Covered by product-phase update rules in `spec-driven-workflow` and `spec-write-product`.
- B8: Covered by TECH prerequisites in `spec-write-tech`.
- B9-B10: Covered by TECH update and approval rules in `spec-driven-workflow` and `spec-write-tech`.
- B11: Covered by implementation prerequisites in `spec-implement`.
- B12: Covered by the product-affecting TECH revision rule that resets both statuses and returns to PRODUCT Review Gate.
- B13-B14: Covered by explicit gate pass instructions that update the matching status to `approved`.
- B15: Covered by documenting `GATES.json` as the source of truth for gate pass state while keeping `PRODUCT.md` and `TECH.md` as the content sources of truth.

## Testing and Validation

Validate the documentation-only implementation with focused repository checks:

- Run `jq . specs/gate-status-json/GATES.json` to verify the example gate state file is valid JSON.
- Run `rg "GATES\\.json|product\\.status|tech\\.status|pending|approved" skills specs/gate-status-json` to confirm all relevant skill docs and this spec mention the new gate-state contract.
- Review `skills/spec-driven-workflow/SKILL.md`, `skills/spec-write-product/SKILL.md`, `skills/spec-write-tech/SKILL.md`, and `skills/spec-implement/SKILL.md` to ensure no references introduce `sha256`, `reviewedRevision`, timestamps, approvers, or multi-artifact support.
- Confirm no implementation code, scripts, hooks, or CI files are added.

## Risks and Mitigations

- Risk: Without hashes or revision ids, manual edits after approval can leave `GATES.json` stale. Mitigation: make same-step gate updates explicit in every skill that creates or modifies `PRODUCT.md` or `TECH.md`.
- Risk: Agents may forget to create `GATES.json` for new specs. Mitigation: list it in the core workflow artifacts and in both spec-writing phase instructions.
- Risk: Existing spec directories will not all have `GATES.json`. Mitigation: document that existing specs are backfilled only when touched again, matching the accepted product assumption.
