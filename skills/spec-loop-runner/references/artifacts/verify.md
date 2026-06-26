# VERIFY.md

Use this structure:

```markdown
# Verification Matrix

## Summary

| Item | Status |
|---|---|
| Product behaviors verified | passed |
| Technical checks verified | passed |
| Build passed | passed |
| Tests passed | passed |
| Manual checks required | none |
| Remaining blockers | none |

## Product Verification

| ID | Product Behavior | Verification Method | Result | Notes |
|---|---|---|---|---|
| B1 | <behavior> | <test or inspection> | passed | <evidence> |

## Technical Verification

| ID | Technical Requirement | Verification Method | Result | Notes |
|---|---|---|---|---|
| T1 | <requirement> | <test or inspection> | passed | <evidence> |

## Commands

| Command | Result | Notes |
|---|---|---|
| <verification command or manual check> | passed | <evidence summary> |

## Remaining Risks

- None.
```

For `feature_with_figma`, add:

```markdown
## Design Verification

| ID | Design Requirement | Verification Method | Result | Notes |
|---|---|---|---|---|
| D1 | <requirement> | <screenshot/manual/inspection> | passed | <evidence> |
```

`VERIFY.md` should be updated throughout implementation, not only at the end.
