import { splitSimpleCsvLine, csvEncodeField } from "./csv.js";
import { splitIntoBlocks } from "./segment.js";

// ---------- Transformations ----------
function toVertical(allLines: string[]): string {
  const blocks = splitIntoBlocks(allLines);
  const outBlocks: string[] = [];

  for (const block of blocks) {
    const preserved: string[] = [];
    let i = 0;

    // 1) Preserve leading comment lines (// ...) and any non-header lines
    // until we hit the header line that starts with '#'
    while (i < block.length && !block[i].trim().startsWith("#")) {
      preserved.push(block[i]);
      i++;
    }

    // If no header found, keep block as-is
    if (i >= block.length) {
      outBlocks.push(block.join("\n"));
      continue;
    }

    const header = block[i];
    const values = block[i + 1];

    // If header exists but values row is missing, keep block as-is
    if (values === undefined) {
      outBlocks.push(block.join("\n"));
      continue;
    }

    const keys = splitSimpleCsvLine(header);
    const vals = splitSimpleCsvLine(values);

    const maxLen = Math.max(keys.length, vals.length);
    const SEP = "\t";

    const rows: string[] = [];
    for (let k = 0; k < maxLen; k++) {
      rows.push(`${keys[k] ?? ""}${SEP}${vals[k] ?? ""}`);
    }

    // 2) Output: preserved comments first, then the KV rows
    const out = [...preserved, ...rows].join("\n");

    outBlocks.push(out);
  }

  return outBlocks.join("\n\n") + "\n";
}

function toHorizontal(allLines: string[]): string {
  const blocks = splitIntoBlocks(allLines);
  const outBlocks: string[] = [];

  for (const block of blocks) {
    const preserved: string[] = [];
    const keys: string[] = [];
    const values: string[] = [];

    let pendingKey: string | null = null;

    const flushPending = () => {
      if (pendingKey !== null) {
        keys.push(pendingKey);
        values.push("");
        pendingKey = null;
      }
    };

    for (let idx = 0; idx < block.length; idx++) {
      const rawLine = block[idx];
      const trimmed = rawLine.trim();
      if (!trimmed) continue;

      // Preserve comment lines exactly (and don't attach them as values)
      if (trimmed.startsWith("//")) {
        // if we had a pending key and hit a comment, keep waiting for a value
        preserved.push(rawLine);
        continue;
      }

      // If we are waiting for a value line for a previous "#Key" line:
      if (pendingKey !== null) {
        // If the next meaningful line is another key, then previous key had empty value
        if (trimmed.startsWith("#")) {
          keys.push(pendingKey);
          values.push("");
          pendingKey = null;
          // fall through to process this key line normally
        } else {
          // This line becomes the value (keep it as-is, including quotes)
          keys.push(pendingKey);
          values.push(trimmed);
          pendingKey = null;
          continue;
        }
      }

      // Now handle key lines
      if (trimmed.startsWith("#")) {
        // Case A: "#Key    Value" (single-line KV)
        const m = trimmed.match(/^(\S+)\s+(.+)$/);
        if (m) {
          keys.push(m[1].trim());
          values.push(m[2].trim());
          continue;
        }

        // Case B: "#Key" alone (value expected on next non-comment line)
        pendingKey = trimmed; // whole token is the key
        continue;
      }

      // Non-key, non-comment lines with no pending key => preserve
      preserved.push(rawLine);
    }

    // If file ends with a pending key, give it empty value
    flushPending();

    if (keys.length === 0) {
      outBlocks.push(block.join("\n"));
      continue;
    }

    const csvBlock =
      `${keys.join(",")}\n` + `${values.map(csvEncodeField).join(",")}`;

    const out =
      preserved.length > 0 ? `${preserved.join("\n")}\n${csvBlock}` : csvBlock;

    outBlocks.push(out);
  }

  return outBlocks.join("\n\n") + "\n";
}

function convertBlockToVertical(blockLines: string[]): string[] {
  const preserved: string[] = [];
  let i = 0;

  // Preserve leading lines until header (#...)
  while (i < blockLines.length && !blockLines[i].trim().startsWith("#")) {
    preserved.push(blockLines[i]);
    i++;
  }

  if (i >= blockLines.length) return blockLines;

  const header = blockLines[i];
  const values = blockLines[i + 1];
  if (values === undefined) return blockLines;

  const keys = splitSimpleCsvLine(header);
  const vals = splitSimpleCsvLine(values);

  const maxLen = Math.max(keys.length, vals.length);
  const SEP = "\t";

  const rows: string[] = [];
  for (let k = 0; k < maxLen; k++) {
    rows.push(`${keys[k] ?? ""}${SEP}${vals[k] ?? ""}`);
  }

  return [...preserved, ...rows];
}

function convertBlockToHorizontal(blockLines: string[]): string[] {
  const preserved: string[] = [];
  const keys: string[] = [];
  const values: string[] = [];

  let pendingKey: string | null = null;

  const flushPending = () => {
    if (pendingKey !== null) {
      keys.push(pendingKey);
      values.push("");
      pendingKey = null;
    }
  };

  for (let idx = 0; idx < blockLines.length; idx++) {
    const rawLine = blockLines[idx];
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("//")) {
      preserved.push(rawLine);
      continue;
    }

    // If we are waiting for a value-only line
    if (pendingKey !== null) {
      if (trimmed.startsWith("#")) {
        // next key arrives => previous key had empty value
        keys.push(pendingKey);
        values.push("");
        pendingKey = null;
        // fall through and process this key line
      } else {
        keys.push(pendingKey);
        values.push(trimmed); // keep quotes etc
        pendingKey = null;
        continue;
      }
    }

    if (trimmed.startsWith("#")) {
      // "#Key    Value"
      const m = trimmed.match(/^(\S+)\s+(.+)$/);
      if (m) {
        keys.push(m[1].trim());
        values.push(m[2].trim());
        continue;
      }

      // "#Key" alone
      pendingKey = trimmed;
      continue;
    }

    // Anything else preserved
    preserved.push(rawLine);
  }

  flushPending();

  if (keys.length === 0) return blockLines;

  const headerLine = keys.join(",");
  const valueLine = values.map(csvEncodeField).join(",");

  const out: string[] = [];
  if (preserved.length > 0) out.push(...preserved);
  out.push(headerLine);
  out.push(valueLine);
  return out;
}
export {
  toVertical,
  toHorizontal,
  convertBlockToVertical,
  convertBlockToHorizontal,
};
