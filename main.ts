// Office Artifacts: The One-Line Placard Contest — make.fun text entry.
//
// The program checks the single judged line against the gate, then writes
// it to /output/entry.txt (the path the sealed gate reads) and to
// ./entry.txt as a local copy, so the run can be checked outside the sandbox.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

// One line, 159 characters, inside the 180-character cap. The placard
// treats a stapler as an ancient artifact: catalogue date, material,
// donor, and a ritual use. Three short clauses, one line — the brief asks
// for a placard, not a single sentence, so no sentence count is enforced.
const ENTRY = "Stapler, c. 2019, pressed steel and quiet resentment. Donated by the accounts team after it jammed during the audit. Ritual use: binding souls to spreadsheets.";

// Gate: the text must be non-empty and inside the character cap.
const LIMIT = 180;
const text = ENTRY.trim();
if (text.length === 0 || text.length > LIMIT) {
  throw new Error(`entry is ${text.length} characters; cap is ${LIMIT}`);
}

// A placard has three parts: the object and its date, the donor note,
// and the ritual use. Each part must survive. Split only where a
// sentence ends before a capitalised word, so "c. 2019" stays whole.
const parts = text.split(/(?<=[.!?])\s+(?=[A-Z])/).map((part) => part.trim());
if (parts.length !== 3) {
  throw new Error(`entry must have three placard clauses; found ${parts.length}`);
}
if (!/^Stapler, c\. \d{4}/.test(parts[0])) {
  throw new Error("the placard must open with the object and its date");
}
if (!/Donated by/.test(parts[1])) {
  throw new Error("the placard must name its donor");
}
if (!/^Ritual use:/.test(parts[2])) {
  throw new Error("the placard must close with its ritual use");
}

// One line, no padding: no line breaks and no doubled spaces.
if (text.includes("\n") || / {2,}/.test(text)) {
  throw new Error("entry must be a single line with single spaces");
}

// Write the judged artifact. The sandbox gate reads /output/entry.txt;
// the copy next to this script is what a local run can be checked against.
for (const target of ["/output/entry.txt", resolve("entry.txt")]) {
  try {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, text, "utf8");
  } catch {
    // /output exists only in the grading sandbox; the local copy remains.
  }
}

const words = text.split(/\s+/).length;
console.log(`${text.length} characters, ${words} words: ${text}`);
