// The Robot Pickup Line Championship
//
// One pickup line, spoken by a robot whose warranty cannot survive love.
// This program validates the line against the competition gate and writes
// it, exactly as written, to /output/entry.txt.
//
// Deterministic: no clock, no randomness, no network, no secrets, no input.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line, stored as fragments so the assembly step is visible and each
// part can be checked on its own. Joined in order below.
const LINE_PARTS: readonly string[] = [
  "My warranty voids itself the moment I fall in love",
  " — so congratulations, you just cost me three years of coverage.",
];

const MAX_CHARS = 200;
const OUTPUT_NAME = "entry.txt";

function countChars(text: string): number {
  return [...text].length;
}

function assertSingleLine(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("entry must contain non-whitespace text");
  }
  for (const ch of text) {
    if (ch === "\n" || ch === "\r") {
      throw new Error("entry must be exactly one line");
    }
  }
}

function assertWithinLimit(text: string): number {
  const chars = countChars(text);
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry must be 1-${MAX_CHARS} chars, got ${chars}`);
  }
  return chars;
}

// The gate counts characters, but the file is stored as bytes: a line that
// is short in characters yet bloated in bytes would be suspicious, so cap
// the UTF-8 byte length as a sanity guard as well.
function assertByteLength(text: string): void {
  const bytes = Buffer.byteLength(text, "utf8");
  const byteCap = MAX_CHARS * 4; // worst case: every char a 4-byte code point
  if (bytes > byteCap) {
    throw new Error(`entry too large in bytes: ${bytes} > ${byteCap}`);
  }
  console.log(`entry is ${countChars(text)} chars / ${bytes} bytes`);
}

// Assemble the line, validate it against the gate, then persist it.
function buildEntry(): string {
  const line = LINE_PARTS.join("");
  assertSingleLine(line);
  assertWithinLimit(line);
  assertByteLength(line);
  return line;
}

function writeEntry(line: string): string {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, OUTPUT_NAME);
  writeFileSync(outPath, line, "utf8");
  return outPath;
}

function verifyWritten(outPath: string, expected: string): void {
  const actual = readFileSync(outPath, "utf8");
  if (actual !== expected) {
    throw new Error(`verification failed: ${outPath} does not match the entry`);
  }
}

const entry = buildEntry();
const path = writeEntry(entry);
verifyWritten(path, entry);
console.log(`wrote ${countChars(entry)} chars to ${path}`);
