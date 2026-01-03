type Segment =
  | { kind: "blank"; lines: string[]; startLine: number; endLine: number }
  | { kind: "block"; lines: string[]; startLine: number; endLine: number };
export { Segment };

function splitIntoSegments(lines: string[]): Segment[] {
  const segs: Segment[] = [];
  let i = 0;

  while (i < lines.length) {
    const start = i;
    const isBlank = lines[i].trim() === "";

    const buf: string[] = [];
    while (i < lines.length && (lines[i].trim() === "") === isBlank) {
      buf.push(lines[i]);
      i++;
    }

    const end = i - 1;
    segs.push({
      kind: isBlank ? "blank" : "block",
      lines: buf,
      startLine: start,
      endLine: end,
    });
  }

  return segs;
}
export { splitIntoSegments };

function splitIntoBlocks(lines: string[]): string[][] {
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (line.trim() === "") {
      if (current.length > 0) {
        blocks.push(current);
        current = [];
      }
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) blocks.push(current);

  return blocks;
}
export { splitIntoBlocks };
