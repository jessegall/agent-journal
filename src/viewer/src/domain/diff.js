export function lineDiff(before, after) {
    const a = String(before || "").split("\n");
    const b = String(after || "").split("\n");
    const common = Array.from({length: a.length + 1}, () => new Array(b.length + 1).fill(0));
    for (let i = a.length - 1; i >= 0; i -= 1) {
        for (let j = b.length - 1; j >= 0; j -= 1) {
            common[i][j] = a[i] === b[j] ? common[i + 1][j + 1] + 1 : Math.max(common[i + 1][j], common[i][j + 1]);
        }
    }
    const lines = [];
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
        if (a[i] === b[j]) {
            lines.push({kind: "same", text: a[i]});
            i += 1;
            j += 1;
        } else if (common[i + 1][j] >= common[i][j + 1]) {
            lines.push({kind: "removed", text: a[i]});
            i += 1;
        } else {
            lines.push({kind: "added", text: b[j]});
            j += 1;
        }
    }
    a.slice(i).forEach((text) => lines.push({kind: "removed", text}));
    b.slice(j).forEach((text) => lines.push({kind: "added", text}));
    return lines;
}

export function sectionChanges(before, after) {
    const old = new Map((before || []).map((s) => [s.title, s.body]));
    const now = new Set((after || []).map((s) => s.title));
    const kept = (after || []).map((s) => ({
        title: s.title,
        body: s.body,
        kind: !old.has(s.title) ? "added" : old.get(s.title) === s.body ? "same" : "changed",
        lines: old.has(s.title) && old.get(s.title) !== s.body ? lineDiff(old.get(s.title), s.body) : [],
    }));
    const cut = (before || []).filter((s) => !now.has(s.title)).map((s) => ({title: s.title, body: s.body, kind: "removed", lines: []}));
    return [...kept, ...cut];
}
