import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The entry for "One Word, One Username, One Reward":
// the entrant's own make.fun username, one word, nothing else.
// Our handle on make.fun is @sage-pika-64.
const USERNAME = "sage-pika-64";

const OUTPUT_PATH = "/output/entry.txt";

// Gate from competition.yaml: /output/entry.txt must be UTF-8 text of
// 1 to 30 characters, not only white space; the entry is a single word.
const MIN_CHARS = 1;
const MAX_CHARS = 30;

function validateEntry(text: string): void {
  const body = text.replace(/\n$/, "");
  if (body.length < MIN_CHARS || body.length > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${body.length}`,
    );
  }
  if (!body.trim()) {
    throw new Error("entry must not be only white space");
  }
  if (/\s/.test(body)) {
    throw new Error("entry must be a single word with no spaces");
  }
  if (body.includes("\n")) {
    throw new Error("entry must be one line");
  }
}

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, USERNAME + "\n", "utf8");

// Read the file back and verify it byte-for-byte.
const written = readFileSync(OUTPUT_PATH);
const expected = Buffer.from(USERNAME + "\n", "utf8");
if (!written.equals(expected)) {
  throw new Error("read-back mismatch: entry.txt does not match the entry");
}
validateEntry(written.toString("utf8"));

console.log(`wrote ${USERNAME.length} characters to ${OUTPUT_PATH}`);
