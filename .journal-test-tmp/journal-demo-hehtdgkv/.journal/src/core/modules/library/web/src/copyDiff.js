// the lines of two texts as the rows a diff card draws: a line only in the first text is removed, a line only in the second is added
export function diffRows(first, second) {
    const before = first === "" ? [] : first.split("\n");
    const after = second === "" ? [] : second.split("\n");
    const common = Array.from({length: before.length + 1}, () => new Array(after.length + 1).fill(0));
    for (let i = before.length - 1; i >= 0; i--) {
        for (let j = after.length - 1; j >= 0; j--) {
            common[i][j] = before[i] === after[j] ? common[i + 1][j + 1] + 1 : Math.max(common[i + 1][j], common[i][j + 1]);
        }
    }
    const rows = [];
    let i = 0;
    let j = 0;
    while (i < before.length || j < after.length) {
        if (i < before.length && j < after.length && before[i] === after[j]) rows.push({line_type: "ctx", line: j + 1, text: after[j++]}) && i++;
        else if (j < after.length && (i === before.length || common[i][j + 1] >= common[i + 1][j])) rows.push({line_type: "add", line: j + 1, text: after[j++]});
        else rows.push({line_type: "del", line: null, text: before[i++]});
    }
    return {rows, added: rows.filter((row) => row.line_type === "add").length, removed: rows.filter((row) => row.line_type === "del").length};
}
