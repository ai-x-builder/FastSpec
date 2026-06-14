# Loop Runner Implement Technical Spec

## Context

This feature upgrades the repository from a spec-first documentation workflow into LoopSpec, where implementation after the PRODUCT and TECH gates runs through a stateful Loop Runner with durable verification and reporting artifacts. The approved product behavior is in `PRODUCT.md`; this TECH describes the implementation that should ship after TECH approval and records the codebase evidence used to evaluate it.

The repository is Markdown- and script-based. There is no application runtime, package manifest, or CI configuration in the workspace. The implementation surface is therefore the portable skill contracts under `skills/`, user-facing docs under `README.md` and `docs/`, the dependency-free lint script under `scripts/`, and the example spec artifacts under `specs/08-feature-loop-runner-implement/`.

Codebase research evidence:

- `specs/08-feature-loop-runner-implement/PRODUCT.md:3` through `specs/08-feature-loop-runner-implement/PRODUCT.md:18` define the LoopSpec upgrade goal, including `spec-loop-runner` as the single implementation skill.
- `specs/08-feature-loop-runner-implement/PRODUCT.md:29` through `specs/08-feature-loop-runner-implement/PRODUCT.md:83` define B1-B28, including gate semantics, runner profiles, loop artifacts, lint compatibility, and MVP exclusions.
- `README.md:1` through `README.md:21` now brand the repository as LoopSpec and split the workflow into spec gates and Loop Runner.
- `README.md:77` through `README.md:123` document the public flow, runner preconditions, loop iteration model, runner profiles, and stop / escalation conditions.
- `README.md:125` through `README.md:167` document the spec layout and the five shipped skills, with `spec-loop-runner` as the implementation skill.
- `docs/workflow.md:40` through `docs/workflow.md:60` show the canonical flow ending in Loop Runner Implement, Verify Matrix, and `REPORT.md`.
- `docs/workflow.md:134` through `docs/workflow.md:176` define TECH Review Gate and Loop Runner preconditions.
- `docs/workflow.md:203` through `docs/workflow.md:217` define how specs return to PRODUCT or TECH review when behavior or technical plans change.
- `docs/skills.md:1` through `docs/skills.md:18` document the five-skill map and show `spec-workflow` routing implementation to `spec-loop-runner`.
- `docs/skills.md:88` through `docs/skills.md:157` describe `spec-loop-runner` ownership and its coordination with `spec-use-figma-design`.
- `docs/gates-json.md:11` through `docs/gates-json.md:58` preserve the minimal `GATES.json` shape and explicitly keep loop state out of gate state.
- `docs/gates-json.md:154` through `docs/gates-json.md:191` document valid gate transitions, including PRODUCT and TECH gate resets.
- `skills/spec-workflow/SKILL.md:1` through `skills/spec-workflow/SKILL.md:16` define the top-level LoopSpec workflow.
- `skills/spec-workflow/SKILL.md:47` through `skills/spec-workflow/SKILL.md:76` define the minimal gate model and reset behavior.
- `skills/spec-workflow/SKILL.md:169` through `skills/spec-workflow/SKILL.md:229` route approved implementation to Loop Runner and require verification matrix plus report evidence.
- `skills/spec-loop-runner/SKILL.md:18` through `skills/spec-loop-runner/SKILL.md:32` require both gates before implementation.
- `skills/spec-loop-runner/SKILL.md:61` through `skills/spec-loop-runner/SKILL.md:87` define the shared runner core and gate return boundaries.
- `skills/spec-loop-runner/SKILL.md:88` through `skills/spec-loop-runner/SKILL.md:158` define the four MVP profiles.
- `skills/spec-loop-runner/SKILL.md:160` through `skills/spec-loop-runner/SKILL.md:185` define result classifications and gate escalation behavior.
- `skills/spec-loop-runner/SKILL.md:187` through `skills/spec-loop-runner/SKILL.md:260` define the loop state and verification matrix artifact shape.
- `skills/spec-use-figma-design/SKILL.md:74` through `skills/spec-use-figma-design/SKILL.md:87` feed Figma-backed visual checks into Loop Runner verification rather than a separate implementation process.
- `scripts/lint-specs.mjs:7` through `scripts/lint-specs.mjs:30` define required spec and loop artifact section checks.
- `scripts/lint-specs.mjs:31` through `scripts/lint-specs.mjs:72` define gate, loop status, decision, and verification result enums.
- `scripts/lint-specs.mjs:79` through `scripts/lint-specs.mjs:126` implement `--spec`, `--require-loop-artifacts`, and `--help`.
- `scripts/lint-specs.mjs:167` through `scripts/lint-specs.mjs:203` preserve the exact `GATES.json` validation.
- `scripts/lint-specs.mjs:231` through `scripts/lint-specs.mjs:363` validate `LOOP_STATE.json`, `VERIFY.md`, and `REPORT.md` structure and enums.
- `scripts/lint-specs.mjs:397` through `scripts/lint-specs.mjs:459` keep historical spec lint compatible while validating loop artifacts when present or explicitly required.

Existing tests and validation are limited to the lint script. No package-managed unit test framework is present. The discovered validation commands are `node scripts/lint-specs.mjs`, `node scripts/lint-specs.mjs --help`, and `node scripts/lint-specs.mjs --spec specs/08-feature-loop-runner-implement --require-loop-artifacts`.

Non-blocking technical assumptions:

- Markdown-first skill and docs changes are the right implementation medium; no generated docs, runtime package, or additional dependency is needed.
- Loop artifact linting should remain structural and enum-focused so future agents can record repository-specific notes without fighting strict schemas.
- The existing `specs/08-feature-loop-runner-implement/` loop artifacts are valid implementation evidence, but they must continue to reflect the current gate state.

## Proposed changes

The implementation is organized around four ownership boundaries: workflow documentation, implementation skill behavior, lint validation, and feature-local loop evidence.

Update public docs and workflow skills:

- Keep the repository branded as LoopSpec in `README.md` and public docs while preserving stable `spec-*` skill directory names and existing install conventions.
- Keep the high-level flow as `PRODUCT -> Gate -> TECH -> Gate -> Loop Runner Implement -> Verify Matrix -> Report`.
- Keep PRODUCT and TECH as the only approval gates. Do not add loop state, timestamps, approvers, hashes, or custom statuses to `GATES.json`.
- Route all approved implementation work through `spec-loop-runner`; do not ship a second compatibility implementation entry point.
- Align `spec-use-figma-design` so Figma-backed UI work contributes visual verification entries to Loop Runner and `VERIFY.md`.

Define `spec-loop-runner` as the implementation engine:

- Require `PRODUCT.md`, `TECH.md`, `GATES.json`, `product.status = "approved"`, and `tech.status = "approved"` before starting or resuming implementation.
- Define one shared runner core: Gate Check, Context Hydration, Delta Planning, Atomic Implementation, Verification, Result Classification, State Update, and Decision.
- Support the four MVP profiles: `feature`, `feature_with_figma`, `bugfix`, and `refactor`.
- Define required loop artifacts: `LOOP_STATE.json`, `VERIFY.md`, and `REPORT.md`.
- Define the stable verification result classifications from PRODUCT B14.
- Stop and escalate to PRODUCT Review Gate when behavior changes; stop and escalate to TECH Review Gate when implementation strategy, module boundaries, dependency choices, or validation strategy must change.

Extend `scripts/lint-specs.mjs` without adding dependencies:

- Preserve default compatibility: historical spec directories still require only `PRODUCT.md`, `TECH.md`, and `GATES.json`.
- Add `--spec <id-or-path>` so agents can lint a single spec directory.
- Add `--require-loop-artifacts` so a completed implementation can require `LOOP_STATE.json`, `VERIFY.md`, and `REPORT.md`.
- Validate loop artifacts whenever they exist, even when not required.
- Validate `LOOP_STATE.json` as JSON with required fields from PRODUCT B13, `version = 1`, `phase = "loop_runner_implement"`, supported task/profile/status/decision values, and supported `last_verification.result` values.
- Validate `VERIFY.md` section presence for `Summary`, `Product Verification`, `Technical Verification`, `Commands`, and `Remaining Risks`; require `Design Verification` when the loop profile is `feature_with_figma`.
- Validate `REPORT.md` section presence for `Summary`, `Specs and gates`, `Loop result`, `Verification evidence`, and `Risks and follow-ups`.
- Reject successful loop states that still contain blockers, so a loop cannot claim success while carrying unresolved blockers.

Keep feature-local evidence current:

- `GATES.json` records only PRODUCT and TECH approval state.
- `LOOP_STATE.json` records the current Loop Runner status, decision, blockers, risks, and last verification.
- `VERIFY.md` records product behavior evidence, technical evidence, command results, and remaining risks.
- `REPORT.md` records the final gate state, loop result, verification evidence, and follow-up status.

The main tradeoff is lint strictness. A full schema for `VERIFY.md` and `REPORT.md` would catch more detail-level mistakes but would also make evidence files brittle and hard to adapt to different repositories. This plan validates artifact presence, required sections, and stable enum values, which covers the product contract without over-constraining free-form evidence.

## Product behavior mapping

- B1 and B5-B6 map to `README.md`, `docs/workflow.md`, `skills/spec-workflow/SKILL.md`, and `skills/spec-loop-runner/SKILL.md`, which present Loop Runner Implement as the post-gate implementation model and define the shared runner core.
- B2 maps to the LoopSpec branding in `README.md` and docs while preserving `spec-*` skill names and spec directory conventions.
- B3, B20, and B21 map to unchanged `GATES.json` shape validation, gate transition docs, and runner escalation rules.
- B4 maps to preflight checks in `spec-loop-runner`, `spec-workflow`, README, and workflow docs.
- B7-B11 map to the profile sections in `spec-loop-runner`, `docs/loop-runner.md`, and `README.md`.
- B12-B14 map to `LOOP_STATE.json` artifact guidance plus lint validation of required fields and allowed result/status values.
- B15-B17 map to `VERIFY.md` and `REPORT.md` templates in `spec-loop-runner` and `docs/loop-runner.md`, plus feature-local evidence files.
- B18-B19 map to successful stop conditions, escalation rules, and the lint safeguard that rejects successful loop states with blockers.
- B22-B23 map to `docs/skills.md`, `README.md`, and `spec-workflow`, which route implementation through `spec-loop-runner` with no alternate shipped implementation skill.
- B24-B26 map to the lint CLI behavior: default historical compatibility, optional implementation-phase strictness, and validation of loop artifacts when present.
- B27 maps to the MVP exclusions documented in `README.md`, `docs/workflow.md`, and `docs/loop-runner.md`.
- B28 maps to the updated public docs and skills that no longer present the old implementation model as the primary path.

## Testing and validation

Validation for TECH approval and final Loop Runner completion should use these checks:

- `node scripts/lint-specs.mjs` verifies all spec directories, preserves compatibility with historical specs, and validates present loop artifacts.
- `node scripts/lint-specs.mjs --help` verifies the new CLI option surface is discoverable.
- `node scripts/lint-specs.mjs --spec specs/08-feature-loop-runner-implement --require-loop-artifacts` verifies this feature's implementation-phase artifacts are complete enough for Loop Runner completion once both gates are approved.
- A temporary copied spec with an invalid `LOOP_STATE.json` verification result should be rejected by lint, proving B14 and B25 enum validation.
- A temporary copied successful loop missing `REPORT.md` should be rejected by lint, proving B17-B18 completion requirements.
- A temporary copied successful loop with a non-empty `blockers` array should be rejected by lint, proving B18 cannot pass with unresolved blockers.
- `rg -n "Implement and verify|Verify against PRODUCT and TECH|spec-safe implementation" README.md docs skills` should not find old primary implementation wording.
- `rg -n "spec-loop-runner|Loop Runner|VERIFY.md|REPORT.md|LOOP_STATE.json" README.md docs skills specs/08-feature-loop-runner-implement` should show the runner and artifacts across public entry points.
- Manual review of `docs/gates-json.md`, `skills/spec-workflow/SKILL.md`, and `scripts/lint-specs.mjs` should confirm `GATES.json` remains minimal and loop state lives only in loop artifacts.

Behavior evidence mapping:

- B1-B2: documentation inspection of README and workflow docs.
- B3-B4 and B20-B21: lint inspection and documentation inspection of gate semantics.
- B5-B18: skill and docs inspection for runner core, profiles, artifacts, classifications, stop rules, and report requirements.
- B22-B23: docs and skill map inspection that `spec-loop-runner` is the only implementation skill.
- B24-B26: the default and feature-specific lint commands.
- B27-B28: search and documentation inspection for MVP exclusions and old workflow wording.

TECH has no blocking technical questions. Loop Runner may claim successful completion only when both gate statuses are approved, required validation passes, `VERIFY.md` has no blocking pending item, `LOOP_STATE.json` has no blockers, and `REPORT.md` exists.

## Risks and mitigations

- Risk: a future agent treats `LOOP_STATE.json` as approval state. Mitigation: gate docs, workflow docs, and `spec-loop-runner` all state that only `GATES.json` stores PRODUCT and TECH approval.
- Risk: a removed compatibility implementation entry point leaves stale references. Mitigation: search public docs and skills for removed implementation wording and keep `spec-loop-runner` as the sole implementation path.
- Risk: lint validation becomes too strict for varied repositories. Mitigation: validate structural sections and stable enum fields while allowing free-form evidence content.
- Risk: feature-local evidence drifts from gate state. Mitigation: update `GATES.json`, `LOOP_STATE.json`, `VERIFY.md`, and `REPORT.md` together whenever a gate changes.
- Risk: the rebrand breaks installation expectations. Mitigation: keep stable `spec-*` skill identifiers and document the repository path separately from installed skill names.
