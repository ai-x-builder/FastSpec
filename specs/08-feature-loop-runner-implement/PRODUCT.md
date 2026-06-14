# Loop Runner Implement Product Spec

## Summary

Upgrade the project from a spec-first workflow into LoopSpec, where implementation after the PRODUCT and TECH gates is a stateful loop with durable verification evidence and a final delivery report. The new flow is `PRODUCT -> Gate -> TECH -> Gate -> Loop Runner Implement -> Verify Matrix -> Report`.

## Problem

The current workflow records product intent, technical planning, and gate approval, but the implementation phase is still described mostly as a safe coding loop that relies on conversation context and final validation. Agents need a durable, auditable execution model that records each implementation iteration, verification result, failure classification, and gate return decision.

## Goals

- Introduce Loop Runner Implement as the required implementation model after both review gates pass.
- Keep the existing PRODUCT and TECH gate semantics intact.
- Make `spec-loop-runner` the single implementation skill after both review gates pass.
- Add durable loop artifacts that future agents and reviewers can inspect.
- Support feature, Figma-backed feature, bugfix, and refactor implementation profiles.
- Rebrand the project documentation around LoopSpec while keeping install paths and repository layout practical.

## Non-goals

- Changing the minimal `GATES.json` schema.
- Requiring existing completed specs to backfill loop artifacts.
- Adding trace replay, dashboards, multi-agent coordination, cost reporting, or CI orchestration.
- Introducing executable BDD, Figma pixel-perfect requirements, or tool-specific implementation frameworks.

## Behavior

B1. The documented high-level workflow is updated from `PRODUCT -> Gate -> TECH -> Gate -> Implement -> Verify` to `PRODUCT -> Gate -> TECH -> Gate -> Loop Runner Implement -> Verify Matrix -> Report`.

B2. The project presents this upgraded workflow as LoopSpec in user-facing documentation. Existing install paths, skill directory conventions, and spec directory conventions remain usable without forcing repository consumers to rename their local setup.

B3. The PRODUCT and TECH review gates remain the only approval gates. `GATES.json` continues to record only `version`, `product.status`, and `tech.status`, with statuses limited to `pending` and `approved`.

B4. Implementation may start only when `PRODUCT.md`, `TECH.md`, and `GATES.json` exist and `GATES.json` has both `product.status = "approved"` and `tech.status = "approved"`.

B5. After both gates pass, the primary implementation behavior is Loop Runner Implement. It executes work as repeated iterations of planning the next smallest meaningful step, implementing it, verifying it, recording state, and deciding whether to continue, stop, block, or return to a gate.

B6. Loop Runner Implement has one shared runner core that applies to all supported task types. The core always covers gate checking, context hydration, delta planning, atomic implementation, verification, result classification, state update, and continue / stop / escalate decisions.

B7. Loop Runner Implement supports four MVP profiles: `feature`, `feature_with_figma`, `bugfix`, and `refactor`.

B8. The `feature` profile focuses on complete product behavior delivery, including main paths, relevant error or empty states, compatibility with existing behavior, and technical requirements from `TECH.md`.

B9. The `feature_with_figma` profile extends `feature` with design-source awareness and visual verification. It records design verification for UI structure, copy, layout, design tokens, assets, interaction states, and known visual deviations when those expectations are acceptance-relevant.

B10. The `bugfix` profile requires reproduction or an explicit inability to reproduce before patching. It records the root cause, applies the smallest safe patch, verifies the original bug path, and checks adjacent regression paths.

B11. The `refactor` profile requires a behavior baseline before structural changes. It verifies that observable behavior remains unchanged and stops if the refactor requires a product behavior change or an unapproved public-interface change.

B12. Each implementation loop persists state in `LOOP_STATE.json` under the relevant `specs/<id>/` directory.

B13. `LOOP_STATE.json` records enough information for another agent to resume or audit the loop, including the feature id, task type, profile, loop phase, iteration number, status, current step, last action, last verification, next action, decision, blockers, risks, and stop conditions.

B14. Each loop verification result is classified with a stable result value. The supported MVP classifications are `passed`, `failed_compile`, `failed_test`, `failed_lint`, `failed_ui_check`, `failed_design_check`, `failed_reproduce`, `blocked_missing_context`, `blocked_missing_tool`, `blocked_spec_conflict`, `needs_product_review`, and `needs_tech_review`.

B15. `VERIFY.md` is the durable verification matrix for a loop implementation. It maps product behaviors, technical requirements, verification commands, results, pending manual checks, and remaining risks.

B16. For `feature_with_figma`, `VERIFY.md` also includes design verification entries covering the acceptance-relevant visual and interaction expectations available from the approved design context.

B17. `REPORT.md` is generated before successful completion. It summarizes the delivered change, spec and gate state, loop result, verification evidence, remaining risks, incomplete items, and follow-up recommendations.

B18. Successful completion requires that required product behaviors are implemented, required technical checks pass or have documented non-blocking limitations, `VERIFY.md` has no blocking pending item, no blocker remains, and `REPORT.md` exists.

B19. Loop Runner Implement stops and escalates instead of continuing when product behavior must change, the technical approach must change, verification cannot be executed, required context or tools are missing, the maximum iteration count is reached, a destructive or unsafe change is required, or the agent cannot choose a safe next step.

B20. If implementation reveals a required product behavior change, the workflow returns to PRODUCT Review Gate and resets gate state according to the existing gate rules.

B21. If implementation reveals a technical-plan change without product behavior change, the workflow returns to TECH Review Gate and resets only `tech.status` according to the existing gate rules.

B22. `spec-loop-runner` is the only shipped implementation skill. There is no separate compatibility entry point or alternate implementation process.

B23. The skills documentation lists `spec-loop-runner` as a shipped skill and shows how it coordinates with `spec-workflow` and `spec-use-figma-design`.

B24. The lint command remains compatible with existing completed specs. Existing spec directories without `LOOP_STATE.json`, `VERIFY.md`, or `REPORT.md` remain valid by default.

B25. When loop artifacts exist, linting validates their basic structure and allowed result/status values so malformed loop state or verification artifacts are caught early.

B26. The lint command supports an implementation-phase mode for a specific spec that requires `LOOP_STATE.json`, `VERIFY.md`, and `REPORT.md`, allowing agents to verify loop completion without forcing all historical specs to add those files.

B27. Documentation clearly states that optional future artifacts such as `TRACE.jsonl`, dashboards, replay, cost reporting, multi-agent coordination, and CI orchestration are out of MVP scope.

B28. Existing examples and docs that describe the old implementation phase are updated so future users do not see two competing implementation models.
