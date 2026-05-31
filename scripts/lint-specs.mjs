#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import process from "node:process";

const root = process.cwd();
const specsDir = join(root, "specs");
const requiredSpecFiles = ["PRODUCT.md", "TECH.md", "GATES.json"];
const requiredTechSections = [
  "Context",
  "Proposed changes",
  "Product behavior mapping",
  "Testing and validation",
];
const allowedStatuses = new Set(["pending", "approved"]);
const specIdPattern =
  /^(?:[A-Z][A-Z0-9]+-\d+|gh-\d+|gl-\d+|[a-z0-9]+(?:-[a-z0-9]+)*)$/;

const errors = [];

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
}

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

if (errors.length > 0) {
  console.error(`Spec lint failed with ${errors.length} issue(s):`);
  for (const error of errors) {
    console.error(`- ${error.path}: ${error.message}`);
  }
  process.exit(1);
}

console.log("Spec lint passed.");
