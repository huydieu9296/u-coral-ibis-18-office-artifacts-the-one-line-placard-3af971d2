import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// A single line, at most 180 characters: a museum placard for an
// ordinary office object as an ancient artifact — catalogue date,
// material and donor included.
const ENTRY =
  "Stapler, c. 2019, pressed steel and quiet resentment. Donated by the accounts team after it jammed during the audit. Ritual use: binding souls to spreadsheets.";

const HERE = dirname(fileURLToPath(import.meta.url));

// The entry text is also kept in entry.txt next to this script. If it is
// present it must agree with the embedded entry; if it is absent (for
// example a harness that copies only main.ts) the embedded text is used.
let TEXT = ENTRY;
const entryPath = join(HERE, "entry.txt");
if (existsSync(entryPath)) {
  const fromFile = readFileSync(entryPath, "utf8").trim();
  if (fromFile.length > 0 && fromFile !== ENTRY) {
    throw new Error("entry.txt does not match the entry embedded in main.ts");
  }
}

if (TEXT.length < 1 || TEXT.length > 180) {
  throw new Error(`entry must be 1-180 characters, got ${TEXT.length}`);
}
if (TEXT.includes("\n")) {
  throw new Error("entry must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), TEXT, "utf8");
console.log(`wrote ${TEXT.length} characters to ${join(outDir, "entry.txt")}`);
