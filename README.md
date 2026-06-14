# LoopSpec

<p align="center">
  <strong>Portable agent skills for spec-gated, stateful loop engineering.</strong>
</p>

<p align="center">
  <a href="https://github.com/ai-x-builder/LoopSpec/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License" /></a>
  <img src="https://img.shields.io/badge/skills-5-brightgreen" alt="Skill Count" />
  <img src="https://img.shields.io/badge/workflow-loop--spec-orange" alt="Workflow" />
  <img src="https://img.shields.io/badge/status-active-lightgrey" alt="Status" />
</p>

![intro](./assets/intro.png)

LoopSpec is a behavior-first workflow for agent-driven engineering work that should not rely on chat history alone. It turns product intent, technical planning, review approval, implementation state, verification evidence, and delivery reporting into durable repository artifacts.

The workflow has two halves:

- **Spec gates:** write and approve `PRODUCT.md` before `TECH.md`, then approve `TECH.md` before code changes.
- **Loop Runner:** execute the approved plan through small verified iterations, record resumable state, and finish with evidence plus a delivery report.

## Features

- Product-first specs: capture user-visible behavior as numbered `B*` invariants before technical planning.
- Review gates: persist PRODUCT and TECH approval state in a minimal `GATES.json`.
- Grounded tech plans: derive `TECH.md` from approved behavior and real codebase research.
- Loop Runner: plan, implement, verify, fix, re-verify, record, and decide each iteration.
- Resumable loop state: record current step, verification result, next action, blockers, risks, and stop conditions in `LOOP_STATE.json`.
- Verify Matrix: map product behavior, technical requirements, commands, and risks in `VERIFY.md`.
- Delivery reports: summarize shipped work, loop result, validation evidence, and follow-ups in `REPORT.md`.
- Figma support: turn design sources into visual contracts, implementation mappings, and design verification.
- Dependency-free linting: validate spec directories and loop artifacts with a small Node.js script.

## Install

Install the skills for the agent you use.

The repository path is `ai-x-builder/LoopSpec`. Existing `spec-*` skill identifiers remain stable compatibility names.

### Codex

```bash
npx skills add ai-x-builder/LoopSpec -y -g --agent codex
```

Codex uses the global universal skills directory:

```text
~/.agents/skills/<skill-name>/SKILL.md
```

### Claude Code

```bash
npx skills add ai-x-builder/LoopSpec -y -g --agent claude-code
```

Claude Code discovers global skills from:

```text
~/.claude/skills/<skill-name>/SKILL.md
```

If `CLAUDE_CONFIG_DIR` is set, the Claude Code global skills directory is `$CLAUDE_CONFIG_DIR/skills/`.

Avoid running the generic global command without `--agent`; some supported targets, such as PromptScript, do not support global skill installation and can report failures even when the skills are installed for other agents.

## Usage

Ask your agent to use the workflow in a target repository:

```text
Use LoopSpec to design and implement saved report filters.
```

For substantial work, the LoopSpec workflow is:

1. Intake the request, constraints, users, risks, and design sources.
2. Write `specs/<feature-id>/PRODUCT.md` as the behavior contract.
3. Stop at PRODUCT Review Gate until product behavior is approved.
4. Write `specs/<feature-id>/TECH.md` from the approved PRODUCT and real codebase research.
5. Stop at TECH Review Gate until the implementation plan is approved.
6. Run Loop Runner.
7. Complete `VERIFY.md` as the evidence matrix.
8. Generate `REPORT.md` before claiming completion.

Small bug fixes, narrow UI tweaks, and straightforward refactors can still skip the workflow when specs would not improve execution or review.

## Loop Runner

Loop Runner is the implementation engine in LoopSpec. It starts only when:

- `PRODUCT.md`, `TECH.md`, and `GATES.json` exist.
- `product.status` is `approved`.
- `tech.status` is `approved`.
- `TECH.md` reflects the latest approved `PRODUCT.md`.
- No blocking product or technical question remains.

Once active, the runner repeats this loop:

```text
Plan -> Implement -> Verify -> Fix -> Re-verify -> Record -> Decide
```

Each iteration is intentionally small and reviewable. The runner hydrates only the context needed for the next step, chooses an atomic implementation delta, edits the code, runs the smallest useful verification, classifies the result, updates loop artifacts, then decides whether to continue, stop successfully, block, or return to a review gate.

Loop Runner writes implementation evidence under `specs/<feature-id>/`:

- `LOOP_STATE.json`: current profile, iteration, step goal, scope, last action, last verification, next action, blockers, risks, and decision.
- `VERIFY.md`: mapping from approved PRODUCT behavior and TECH requirements to commands, artifacts, results, design checks, pending items, and residual risks.
- `REPORT.md`: final summary of shipped work, spec and gate state, loop result, verification evidence, known limitations, and follow-ups.

Supported runner profiles:

- `feature`: new product behavior.
- `feature_with_figma`: Figma-backed UI work with design verification.
- `bugfix`: defect reproduction, root cause, smallest patch, and regression checks.
- `refactor`: behavior-preserving structural work with baseline and post-change verification.

Loop Runner stops successfully only when approved behavior is implemented, required technical checks pass or have documented non-blocking limitations, `VERIFY.md` has no blocking pending item, `LOOP_STATE.json` has no blockers, `REPORT.md` exists, and no unapproved spec change is needed.

Loop Runner escalates instead of guessing when product behavior must change, the technical plan no longer fits, required context or tools are missing, verification cannot run with a useful fallback, `max_iterations` is reached, or the working tree becomes unsafe.

## Spec Layout

```text
specs/<feature-id>/
├── PRODUCT.md
├── TECH.md
├── GATES.json
├── LOOP_STATE.json
├── VERIFY.md
└── REPORT.md
```

`PRODUCT.md`, `TECH.md`, and `GATES.json` are required once a task enters LoopSpec. `LOOP_STATE.json`, `VERIFY.md`, and `REPORT.md` are created during Loop Runner implementation.

`<feature-id>` can be a ticket id like `APP-1234`, issue id like `gh-4567` or `gl-7890`, or a short kebab-case name.

`GATES.json` has one supported shape:

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

Only `pending` and `approved` are valid gate statuses. Loop state belongs in `LOOP_STATE.json`, not `GATES.json`.

## Skills

The `spec-*` skill names are stable compatibility identifiers. In documentation and prompts, refer to the workflow as LoopSpec.

- [`spec-workflow`](./skills/spec-workflow/SKILL.md): orchestrates the staged LoopSpec workflow.
- [`spec-write-product`](./skills/spec-write-product/SKILL.md): writes `PRODUCT.md` and stops at PRODUCT review.
- [`spec-write-tech`](./skills/spec-write-tech/SKILL.md): writes `TECH.md` after PRODUCT approval.
- [`spec-loop-runner`](./skills/spec-loop-runner/SKILL.md): executes stateful implementation loops after both gates pass.
- [`spec-use-figma-design`](./skills/spec-use-figma-design/SKILL.md): extracts Figma-backed design context for specs and verification.

Example specs live in [`specs`](./specs). The current LoopSpec example with loop artifacts is [`specs/08-feature-loop-runner-implement`](./specs/08-feature-loop-runner-implement).

## Documentation

- [Workflow](./docs/workflow.md): why the staged LoopSpec workflow exists and how it runs.
- [Loop Runner](./docs/loop-runner.md): runner core, profiles, artifacts, result classifications, and escalation.
- [Skills](./docs/skills.md): what each skill owns and how the skills coordinate.
- [GATES.json](./docs/gates-json.md): why gate state is persisted and how status transitions work.
- [Figma Workflow](./docs/figma-workflow.md): how Figma design context becomes specs, implementation mapping, and verification.

## Linting

```bash
node scripts/lint-specs.mjs
```

To require loop artifacts for a completed implementation:

```bash
node scripts/lint-specs.mjs --spec specs/<feature-id> --require-loop-artifacts
```

## Current Scope

LoopSpec currently includes loop state, verification matrix, delivery report, one runner core, four profiles, result classification, and gate escalation. It does not include trace replay, dashboards, cost reports, multi-agent coordination, or automatic CI orchestration.

## License

MIT
