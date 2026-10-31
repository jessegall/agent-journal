const PARTS = {shown: "Still shown", faded: "Removed"};

// a mark's lines as a round: one line to a memory, part|id|weight before|weight after; null for lines that are no round
export function roundOf(lines) {
    const rows = String(lines || "").split("\n").filter(Boolean).map((line) => line.split("|"));
    if (!rows.length || rows.some(([part, id, before, after]) => !PARTS[part] || !id || before === undefined || after === undefined)) return null;
    const change = ([part, , before, after]) => (part === "faded" ? "faded out at weight 0" : `weight ${before} to ${after}`);
    return Object.entries(PARTS)
        .map(([part, label]) => ({label, rows: rows.filter(([own]) => own === part).map((row) => ({id: Number(row[1]), change: change(row)}))}))
        .filter((part) => part.rows.length);
}
