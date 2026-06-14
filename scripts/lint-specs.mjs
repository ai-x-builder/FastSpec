#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import process from "node:process";

const root = process.cwd();
const specsDir = join(root, "specs");
const requiredSpecFiles = ["PRODUCT.md", "TECH.md", "GATES.json"];
const loopArtifactFiles = ["LOOP_STATE.json", "VERIFY.md", "REPORT.md"];
const requiredTechSections = [
  "Context",
  "Proposed changes",
  "Product behavior mapping",
  "Testing and validation",
];
const requiredVerifySections = [
  "Summary",
  "Product Verification",
  "Technical Verification",
  "Commands",
  "Remaining Risks",
];
const requiredReportSections = [
  "Summary",
  "Specs and gates",
  "Loop result",
  "Verification evidence",
  "Risks and follow-ups",
];
const allowedStatuses = new Set(["pending", "approved"]);
const allowedTaskTypes = new Set([
  "feature",
  "feature_with_figma",
  "bugfix",
  "refactor",
]);
const allowedProfiles = new Set([
  "feature",
  "feature_with_figma",
  "bugfix",
  "refactor",
]);
const allowedLoopStatuses = new Set([
  "not_started",
  "running",
  "passed",
  "blocked",
  "needs_product_review",
  "needs_tech_review",
]);
const allowedDecisions = new Set([
  "continue",
  "stop_success",
  "stop_blocked",
  "escalate_product",
  "escalate_tech",
]);
const allowedVerificationResults = new Set([
  "passed",
  "failed_compile",
  "failed_test",
  "failed_lint",
  "failed_ui_check",
  "failed_design_check",
  "failed_reproduce",
  "blocked_missing_context",
  "blocked_missing_tool",
  "blocked_spec_conflict",
  "needs_product_review",
  "needs_tech_review",
]);
const specIdPattern =
  /^(?:[A-Z][A-Z0-9]+-\d+|gh-\d+|gl-\d+|[a-z0-9]+(?:-[a-z0-9]+)*)$/;

const errors = [];
const options = parseArgs(process.argv.slice(2));

function parseArgs(args) {
  const parsed = {
    requireLoopArtifacts: false,
    spec: null,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--require-loop-artifacts") {
      parsed.requireLoopArtifacts = true;
      continue;
    }

    if (arg === "--spec") {
      const value = args[index + 1];

      if (!value) {
        console.error("--spec requires a spec id or path");
        process.exit(2);
      }

      parsed.spec = value;
      index += 1;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }

    console.error(`Unknown argument: ${arg}`);
    printHelp();
    process.exit(2);
  }

  return parsed;
}

function printHelp() {
  console.log(`Usage: node scripts/lint-specs.mjs [--spec <id-or-path>] [--require-loop-artifacts]

Options:
  --spec <id-or-path>          Lint only one spec directory.
  --require-loop-artifacts     Require LOOP_STATE.json, VERIFY.md, and REPORT.md for the selected spec(s).
`);
}

function rel(path) {
  return relative(root, path) || ".";
}

function addError(path, message) {
  errors.push({ path: rel(path), message });
}

function readText(path) {
  return readFileSync(path, "utf8");
}

function hasSection(markdown, sectionName) {
  const expected = sectionName.toLowerCase();

  return markdown.split(/\r?\n/).some((line) => {
    const match = line.match(/^##\s+(.+?)\s*$/);
    return match?.[1].trim().toLowerCase() === expected;
  });
}

function exactKeys(value, expectedKeys) {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    JSON.stringify(Object.keys(value).sort()) ===
      JSON.stringify([...expectedKeys].sort())
  );
}

function isPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function hasKeys(value, keys) {
  return isPlainObject(value) && keys.every((key) => key in value);
}

function lintGateFile(path) {
  let gates;

  try {
    gates = JSON.parse(readText(path));
  } catch (error) {
    addError(path, `must contain valid JSON (${error.message})`);
    return;
  }

  if (!exactKeys(gates, ["version", "product", "tech"])) {
    addError(path, "must contain only version, product, and tech keys");
    return;
  }

  if (gates.version !== 1) {
    addError(path, "version must be 1");
  }

  for (const gateName of ["product", "tech"]) {
    const gate = gates[gateName];

    if (!exactKeys(gate, ["status"])) {
      addError(path, `${gateName} must contain only a status key`);
      continue;
    }

    if (!allowedStatuses.has(gate.status)) {
      addError(
        path,
        `${gateName}.status must be "pending" or "approved", got ${JSON.stringify(
          gate.status,
        )}`,
      );
    }
  }
}

function lintProduct(path) {
  const product = readText(path);

  if (!hasSection(product, "Summary")) {
    addError(path, "must include a ## Summary section");
  }

  if (!hasSection(product, "Behavior")) {
    addError(path, "must include a ## Behavior section");
  }

  if (!/^B1\./m.test(product)) {
    addError(path, "must include at least one Behavior invariant starting at B1");
  }
}

function lintTech(path) {
  const tech = readText(path);

  for (const section of requiredTechSections) {
    if (!hasSection(tech, section)) {
      addError(path, `must include a ## ${section} section`);
    }
  }
}

function lintLoopState(path) {
  let state;

  try {
    state = JSON.parse(readText(path));
  } catch (error) {
    addError(path, `must contain valid JSON (${error.message})`);
    return null;
  }

  if (!isPlainObject(state)) {
    addError(path, "must contain a JSON object");
    return null;
  }

  const requiredKeys = [
    "version",
    "feature_id",
    "task_type",
    "profile",
    "phase",
    "iteration",
    "status",
    "current_step",
    "last_action",
    "last_verification",
    "next_action",
    "decision",
    "blockers",
    "risks",
    "stop_conditions",
  ];

  if (!hasKeys(state, requiredKeys)) {
    const missing = requiredKeys.filter((key) => !(key in state));
    addError(path, `missing required key(s): ${missing.join(", ")}`);
  }

  if (state.version !== 1) {
    addError(path, "version must be 1");
  }

  if (!allowedTaskTypes.has(state.task_type)) {
    addError(path, `task_type must be one of ${quotedList(allowedTaskTypes)}`);
  }

  if (!allowedProfiles.has(state.profile)) {
    addError(path, `profile must be one of ${quotedList(allowedProfiles)}`);
  }

  if (state.phase !== "loop_runner_implement") {
    addError(path, 'phase must be "loop_runner_implement"');
  }

  if (!Number.isInteger(state.iteration) || state.iteration < 0) {
    addError(path, "iteration must be a non-negative integer");
  }

  if (!allowedLoopStatuses.has(state.status)) {
    addError(path, `status must be one of ${quotedList(allowedLoopStatuses)}`);
  }

  if (!allowedDecisions.has(state.decision)) {
    addError(path, `decision must be one of ${quotedList(allowedDecisions)}`);
  }

  if (!Array.isArray(state.blockers)) {
    addError(path, "blockers must be an array");
  }

  if (!Array.isArray(state.risks)) {
    addError(path, "risks must be an array");
  }

  if (!isPlainObject(state.current_step)) {
    addError(path, "current_step must be an object");
  } else if (!hasKeys(state.current_step, ["id", "goal", "scope"])) {
    addError(path, "current_step must include id, goal, and scope");
  } else if (!Array.isArray(state.current_step.scope)) {
    addError(path, "current_step.scope must be an array");
  }

  if (!isPlainObject(state.last_verification)) {
    addError(path, "last_verification must be an object");
  } else {
    if (!hasKeys(state.last_verification, ["type", "command", "result", "summary"])) {
      addError(
        path,
        "last_verification must include type, command, result, and summary",
      );
    }

    if (!allowedVerificationResults.has(state.last_verification.result)) {
      addError(
        path,
        `last_verification.result must be one of ${quotedList(
          allowedVerificationResults,
        )}`,
      );
    }
  }

  if (!isPlainObject(state.stop_conditions)) {
    addError(path, "stop_conditions must be an object");
  }

  if (isSuccessfulLoopState(state) && Array.isArray(state.blockers) && state.blockers.length > 0) {
    addError(path, "successful loop state must not contain blockers");
  }

  return state;
}

function isSuccessfulLoopState(state) {
  return state?.status === "passed" || state?.decision === "stop_success";
}

function quotedList(set) {
  return [...set].map((value) => `"${value}"`).join(", ");
}

function lintVerify(path, loopState) {
  const verify = readText(path);

  for (const section of requiredVerifySections) {
    if (!hasSection(verify, section)) {
      addError(path, `must include a ## ${section} section`);
    }
  }

  if (loopState?.profile === "feature_with_figma" && !hasSection(verify, "Design Verification")) {
    addError(path, 'must include a ## Design Verification section for profile "feature_with_figma"');
  }
}

function lintReport(path) {
  const report = readText(path);

  for (const section of requiredReportSections) {
    if (!hasSection(report, section)) {
      addError(path, `must include a ## ${section} section`);
    }
  }
}

function resolveSpecTarget(spec) {
  if (!spec) {
    return null;
  }

  const byId = join(specsDir, spec);

  if (existsSync(byId)) {
    return byId;
  }

  const asPath = resolve(root, spec);

  if (existsSync(asPath)) {
    return asPath;
  }

  addError(join(specsDir, spec), "spec directory does not exist");
  return null;
}

function lintLoopArtifacts(path, required) {
  const loopStatePath = join(path, "LOOP_STATE.json");
  let loopState = existsSync(loopStatePath) ? lintLoopState(loopStatePath) : null;
  const requireAllArtifacts = required || isSuccessfulLoopState(loopState);

  for (const file of loopArtifactFiles) {
    const filePath = join(path, file);

    if (requireAllArtifacts && !existsSync(filePath)) {
      addError(path, `missing ${file}`);
    }
  }

  const verifyPath = join(path, "VERIFY.md");
  const reportPath = join(path, "REPORT.md");

  if (existsSync(verifyPath)) {
    lintVerify(verifyPath, loopState);
  }

  if (existsSync(reportPath)) {
    lintReport(reportPath);
  }
}

function lintSpecDirectory(path, id) {
  if (!specIdPattern.test(id)) {
    addError(
      path,
      "directory name must be a ticket id, gh-<id>, gl-<id>, or kebab-case feature id",
    );
  }

  for (const file of requiredSpecFiles) {
    const filePath = join(path, file);
    if (!existsSync(filePath)) {
      addError(path, `missing ${file}`);
    }
  }

  const productPath = join(path, "PRODUCT.md");
  const techPath = join(path, "TECH.md");
  const gatesPath = join(path, "GATES.json");

  if (existsSync(productPath)) {
    lintProduct(productPath);
  }

  if (existsSync(techPath)) {
    lintTech(techPath);
  }

  if (existsSync(gatesPath)) {
    lintGateFile(gatesPath);
  }

  const hasAnyLoopArtifact = loopArtifactFiles.some((file) =>
    existsSync(join(path, file)),
  );

  if (options.requireLoopArtifacts || hasAnyLoopArtifact) {
    lintLoopArtifacts(path, options.requireLoopArtifacts);
  }
}

const singleSpecPath = resolveSpecTarget(options.spec);

if (singleSpecPath) {
  if (!statSync(singleSpecPath).isDirectory()) {
    addError(singleSpecPath, "spec target must be a directory");
  } else {
    lintSpecDirectory(singleSpecPath, basename(singleSpecPath));
  }
} else if (!options.spec) {
  if (!existsSync(specsDir)) {
    addError(specsDir, "specs directory is missing");
  } else {
    const entries = readdirSync(specsDir).filter((entry) => !entry.startsWith("."));
    const specDirectories = [];

    for (const entry of entries) {
      const entryPath = join(specsDir, entry);
      const stats = statSync(entryPath);

      if (!stats.isDirectory()) {
        addError(entryPath, "specs direct children must be spec directories");
        continue;
      }

      specDirectories.push(entry);
      lintSpecDirectory(entryPath, entry);
    }

    if (specDirectories.length === 0) {
      addError(specsDir, "must contain at least one spec directory");
    }
  }
}

if (errors.length > 0) {
  console.error(`Spec lint failed with ${errors.length} issue(s):`);
  for (const error of errors) {
    console.error(`- ${error.path}: ${error.message}`);
  }
  process.exit(1);
}

console.log("Spec lint passed.");
