# Product Gate Clarification Options Product Spec

## Summary

Update the spec workflow guidance so agents actively surface PRODUCT Review Gate blockers after writing `PRODUCT.md`, while keeping the interaction narrow. When suggestions are useful, agents should offer only one or two high-signal options instead of a longer menu.

## Problem

The current workflow requires stopping at the PRODUCT Review Gate, but it does not define the shape of the handoff clearly enough. Agents may ask too many questions, present too many suggested answers, or turn non-blocking assumptions into avoidable user work before TECH can begin.

## Goals

- Make PRODUCT Review Gate handoff messages easier for users to answer.
- Keep blocking questions explicit enough that agents do not guess product behavior.
- Limit suggested answers to one or two focused options when options are useful.
- Preserve the existing rule that TECH cannot begin while blocking product questions remain.

## Non-goals

- Changing the `PRODUCT.md`, `TECH.md`, or `GATES.json` file layout.
- Changing the definition of `pending` and `approved` gate statuses.
- Adding new tools, scripts, or automation.
- Requiring a multiple-choice format for every PRODUCT Review Gate.

## Behavior

B1. After an agent creates or materially updates `PRODUCT.md`, it stops at the PRODUCT Review Gate before writing `TECH.md`.

B2. At the PRODUCT Review Gate, the agent tells the user whether any blocking product questions remain. If no blocking product questions remain, the agent asks the user to approve `PRODUCT.md` or explicitly request the TECH phase.

B3. If blocking product questions remain, the agent asks only the questions that are required to make the product behavior safe to specify. It avoids asking broad preference questions, implementation questions, or questions whose answer can be recorded as a non-blocking assumption.

B4. If multiple blocking product questions remain, the agent presents a concise list of all blocking questions so the user can see the full PRODUCT Review Gate scope.

B5. Even when the full blocking-question list is shown, the agent asks the user to clarify one blocking question at a time. It prioritizes the question that most directly unlocks the next PRODUCT revision, then returns to the PRODUCT Review Gate after updating `PRODUCT.md`.

B6. The agent continues this one-question-at-a-time loop until all blocking product questions are resolved. TECH cannot begin until no blocking product questions remain.

B7. For each blocking question being actively clarified, the agent may provide suggested answer options only when those options reduce user effort or clarify a real product tradeoff. Suggested options are not required when the best next step is an open-ended answer.

B8. When suggested options are provided for a blocking question, the agent presents one or two options. One option is acceptable when there is a clear recommended path and the user mainly needs to confirm or override it.

B9. Suggested options are concrete product choices, not technical implementation plans. Each option states the user-visible behavior or workflow impact in concise language.

B10. When the agent has a recommended option, it marks that option as recommended and gives a short reason. The reason focuses on product behavior, user effort, or workflow clarity rather than implementation convenience.

B11. Non-blocking product questions do not block the gate handoff. The agent records the current assumption and impact in `PRODUCT.md`, summarizes that assumption to the user, and allows the user to correct it during review.

B12. The gate handoff distinguishes blocking questions from non-blocking assumptions. A user should be able to tell whether they must answer a question before TECH can begin.

B13. If the user answers a blocking question, the agent updates `PRODUCT.md` to reflect the decision, keeps both gate statuses pending, and returns to the PRODUCT Review Gate.

B14. If the user explicitly approves `PRODUCT.md` or explicitly asks to continue to TECH while no blocking product questions remain, the PRODUCT Review Gate can pass and `product.status` can be recorded as `approved` in `GATES.json`.

B15. The agent must not treat selection of a suggested option as approval of the whole product spec unless the user also clearly approves `PRODUCT.md` or asks to continue to TECH.
