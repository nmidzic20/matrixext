import { splitIntoSegments } from "./segment.js";

function isHorizontalBlock(blockLines: string[]): boolean {
  // Find first two non-empty, non-comment lines
  const content = blockLines
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("//"));

  if (content.length < 2) return false;

  const header = content[0];
  const values = content[1];

  // Horizontal header is "#..." with commas; values line also comma-ish
  if (!header.startsWith("#") || !header.includes(",")) return false;

  const headerCommas = (header.match(/,/g) || []).length;
  const valueCommas = (values.match(/,/g) || []).length;

  return headerCommas >= 1 && valueCommas >= 1;
}

function isVerticalBlock(blockLines: string[]): boolean {
  // Vertical if it contains at least one line starting with # that is not a comma-separated header
  // (allow commas in value part; don't disqualify by comma presence)
  for (const raw of blockLines) {
    const t = raw.trim();
    if (!t || t.startsWith("//")) continue;
    if (!t.startsWith("#")) continue;

    // Consider it vertical if it has whitespace after key OR key-only line
    // (not just "#a,#b,#c")
    if (!t.includes(",")) return true;

    // If it includes commas but also contains whitespace between key and value, it's vertical
    // e.g. "#RepeatingGroups    \"a, b\""
    if (/^#\S+\s+/.test(t)) return true;
  }
  return false;
}
export { isHorizontalBlock, isVerticalBlock };

type FileMode = "horizontal" | "vertical" | "mixed";

function detectFileMode(lines: string[]): FileMode {
  const segments = splitIntoSegments(lines);

  let h = 0;
  let v = 0;

  for (const seg of segments) {
    if (seg.kind !== "block") continue;

    if (isHorizontalBlock(seg.lines)) h++;
    else if (isVerticalBlock(seg.lines)) v++;
    else {
      // Unknown blocks: treat as vertical-ish so we don't aggressively horizontalize them
      v++;
    }
  }

  if (h > 0 && v > 0) return "mixed";
  if (h > 0) return "horizontal";
  return "vertical";
}
export { detectFileMode };
