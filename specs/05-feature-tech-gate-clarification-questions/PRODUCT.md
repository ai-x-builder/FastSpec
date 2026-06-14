# Tech Gate Clarification Questions Product Spec

## Summary

Update the spec workflow guidance so agents actively surface unresolved TECH Review Gate questions after writing `TECH.md`. The TECH gate handoff should show the full set of technical blockers, clarify one blocker at a time, and request explicit approval or implementation only when no blockers remain.

## Problem

The current workflow requires stopping at TECH Review Gate, but it does not define how the agent should present technical blockers or unresolved assumptions. Agents may simply ask for approval, skip important implementation-plan questions, or ask too many technical questions at once before implementation can safely begin.

## Goals

- Make TECH Review Gate handoffs explicit and easy for users to answer.
- Keep technical blockers visible before implementation starts.
- Clarify one technical blocker at a time while still showing the full blocker scope.
- Limit suggested answer options for the active blocker to one or two when options are useful.
- Preserve the existing rule that implementation cannot begin until TECH is approved and no blocking technical questions remain.

## Non-goals

- Changing the `PRODUCT.md`, `TECH.md`, or `GATES.json` file layout.
- Changing the definition of `pending` and `approved` gate statuses.
- Adding tools, scripts, generated metadata, or automated gate enforcement.
- Requiring every TECH Review Gate to use a multiple-choice format.
- Allowing TECH to redefine product behavior that belongs in `PRODUCT.md`.

## Behavior

B1. After an agent creates or materially updates `TECH.md`, it stops at the TECH Review Gate before implementation.

B2. At the TECH Review Gate, the agent tells the user whether any blocking technical questions remain. If no blocking technical questions remain, the agent asks the user to approve `TECH.md` or explicitly request implementation.

B3. A blocking technical question is an unresolved issue that prevents the implementation plan from being safe to execute, such as unclear module ownership, incompatible architecture choices, unresolved migration or rollout risk, unclear validation strategy, or a dependency decision required before implementation.

B4. TECH blockers must stay technical. If a blocker changes product behavior, user-visible acceptance expectations, or externally observable semantics, the agent returns to the PRODUCT phase instead of resolving it only in TECH.

B5. If multiple blocking technical questions remain, the agent presents a concise list of all blocking technical questions so the user can see the full TECH Review Gate scope.

B6. Even when the full blocking-question list is shown, the agent asks the user to clarify one blocking technical question at a time. It prioritizes the question that most directly unlocks the next `TECH.md` revision.

B7. The agent continues this one-question-at-a-time loop until all blocking technical questions are resolved. Implementation cannot begin until no blocking technical questions remain.

B8. For each blocking technical question being actively clarified, the agent may provide suggested answer options only when those options reduce user effort or clarify a real implementation tradeoff. Suggested options are not required when an open-ended answer is better.

B9. When suggested options are provided for a blocking technical question, the agent presents one or two options. One option is acceptable when there is a clear recommended path and the user mainly needs to confirm or override it.

B10. Suggested options are concrete technical plan choices, not product behavior changes. Each option states the implementation impact, risk, validation impact, or workflow impact in concise language.

B11. When the agent has a recommended option, it marks that option as recommended and gives a short reason focused on codebase fit, risk reduction, implementation clarity, or validation confidence.

B12. Non-blocking technical questions do not block the gate handoff. The agent records the current assumption and impact in `TECH.md`, summarizes that assumption to the user, and allows the user to correct it during review.

B13. The TECH gate handoff distinguishes blocking technical questions from non-blocking technical assumptions. A user should be able to tell whether they must answer a question before implementation can begin.

B14. If the user answers a blocking technical question, the agent updates `TECH.md` to reflect the decision, keeps `tech.status` pending, and returns to the TECH Review Gate.

B15. If the user's answer changes product behavior, the agent updates `PRODUCT.md`, sets both statuses pending, and returns to the PRODUCT Review Gate before revising TECH again.

B16. If the user explicitly approves `TECH.md` or explicitly asks to continue to implementation while no blocking technical questions remain, the TECH Review Gate can pass and `tech.status` can be recorded as `approved` in `GATES.json`.

B17. The agent must not treat selection of a suggested option as approval of the whole technical spec unless the user also clearly approves `TECH.md` or asks to continue to implementation.
