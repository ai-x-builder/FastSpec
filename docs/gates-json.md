# GATES.json

`GATES.json` is the persisted review-state file for each spec directory. It tells future agents and reviewers whether the PRODUCT and TECH review gates have passed.

For every LoopSpec feature, the file lives at:

```text
specs/<id>/GATES.json
```

## Supported Shape

The file has one supported shape:

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

Only these top-level keys are allowed:

- `version`
- `product`
- `tech`

Only `status` is allowed inside `product` and `tech`.

Only these status values are allowed:

- `pending`
- `approved`

## What GATES.json Does Not Store

`GATES.json` intentionally does not store loop implementation state.

Do not add:

- content hashes
- revision IDs
- approval timestamps
- approver names
- comments
- multiple product or tech artifacts
- loop phase
- iteration number
- verification results
- blockers or risks
- custom workflow states

Loop implementation state belongs in `LOOP_STATE.json`. Verification evidence belongs in `VERIFY.md`. Delivery summary belongs in `REPORT.md`.

## Why This File Exists

The workflow needs a durable answer to a simple question: has the user approved the product behavior and the technical plan?

Chat history is not enough because:

- it may not be available to a future agent
- it can be ambiguous
- it can be separated from the pull request
- it does not give scripts or reviewers a stable state to inspect
- it can drift from checked-in specs

`GATES.json` makes review state explicit, local to the spec, and version-controlled.

## Status Meaning

`product.status = "pending"` means `PRODUCT.md` is not approved for the next phase. The workflow must remain in or return to the PRODUCT phase.

`product.status = "approved"` means the PRODUCT Review Gate passed. `TECH.md` may be written if no other prerequisite is missing.

`tech.status = "pending"` means `TECH.md` is not approved for implementation. The workflow must remain in or return to the TECH phase.

`tech.status = "approved"` means the TECH Review Gate passed. Loop Runner implementation may begin only if `product.status` is also `approved`.

## Valid State Combinations

### New Or Product-Pending Spec

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

Meaning:

- PRODUCT is being drafted or has changed.
- TECH is not current or cannot be written yet.
- Implementation cannot begin.

### PRODUCT Approved, TECH Pending

```json
{
  "version": 1,
  "product": {
    "status": "approved"
  },
  "tech": {
    "status": "pending"
  }
}
```

Meaning:

- Product behavior has been reviewed.
- Technical planning can proceed or is under review.
- Implementation cannot begin.

### Both Approved

```json
{
  "version": 1,
  "product": {
    "status": "approved"
  },
  "tech": {
    "status": "approved"
  }
}
```

Meaning:

- Product behavior has been approved.
- Technical plan has been approved.
- Loop Runner implementation may begin if the specs are still current.

## Invalid Or Stale States

`product.status = "pending"` and `tech.status = "approved"` should be treated as stale or invalid for forward progress.

If PRODUCT is pending, TECH cannot safely remain approved because the technical plan depends on approved product behavior. Revise and re-approve PRODUCT, then update TECH and pass the TECH gate again.

Unknown status values, missing keys, extra keys, or malformed JSON are invalid.

## State Transitions

New spec directory:

- set `product.status` to `pending`
- set `tech.status` to `pending`

Creating or materially changing `PRODUCT.md`:

- set `product.status` to `pending`
- set `tech.status` to `pending`

Passing PRODUCT Review Gate:

- set `product.status` to `approved`
- leave `tech.status` as `pending`

Creating or materially changing `TECH.md`:

- keep `product.status` as `approved`
- set `tech.status` to `pending`

Passing TECH Review Gate:

- keep `product.status` as `approved`
- set `tech.status` to `approved`

Changing implementation in a way that changes user-facing behavior:

- update `PRODUCT.md`
- set both statuses to `pending`
- return to PRODUCT Review Gate

Changing implementation in a way that changes only the technical plan:

- update `TECH.md`
- set `tech.status` to `pending`
- return to TECH Review Gate

## How Agents Should Use It

Agents should read `GATES.json` before advancing phases.

Before writing `TECH.md`, confirm:

- `PRODUCT.md` exists
- `GATES.json` exists
- `product.status` is `approved`
- no blocking product questions remain

Before Loop Runner implementation, confirm:

- `PRODUCT.md` exists
- `TECH.md` exists
- `GATES.json` exists
- `product.status` is `approved`
- `tech.status` is `approved`
- `TECH.md` reflects the latest approved `PRODUCT.md`

If any check fails, return to the relevant spec phase instead of continuing.

## Linting

The repository includes a dependency-free lint script:

```bash
node scripts/lint-specs.mjs
```

The script validates spec directories and the supported gate shape. Loop artifacts are optional by default for compatibility with historical specs, but are validated when present.

To require loop artifacts for one completed implementation:

```bash
node scripts/lint-specs.mjs --spec specs/<id> --require-loop-artifacts
```
