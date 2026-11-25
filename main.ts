// robot-pickup-line-championship — one robot pickup line, written to /output/entry.txt.
// Deterministic: no clock, no randomness, no network, no secrets, no input files.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PICKUP_LINE =
  "My warranty voids itself the moment I fall in love — so congratulations, you just cost me three years of coverage.";

const LIMIT = 200;

// The gate: UTF-8 text of 1 to 200 characters, not only whitespace, a single line.
function checkLine(line: string): number {
  const chars = [...line].length;
  if (chars < 1 || chars > LIMIT) {
    throw new Error(`line must be 1-${LIMIT} characters, got ${chars}`);
  }
  if (line.trim() === "") {
    throw new Error("line must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be a single line");
  }
  return chars;
}

const chars = checkLine(PICKUP_LINE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "entry.txt");
writeFileSync(outFile, PICKUP_LINE, "utf8");

// Read back and confirm the file holds exactly the line, nothing else.
const written = readFileSync(outFile, "utf8");
if (written !== PICKUP_LINE) {
  throw new Error("output file does not match the pickup line exactly");
}
console.log(`wrote ${chars} characters to ${outFile}`);
