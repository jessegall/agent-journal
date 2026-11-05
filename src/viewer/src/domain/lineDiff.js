// the lines two texts share and the ones each has alone, found by the longest common run of lines
export function lineDiff(before, after) {
    const old = before.split("\n");
    const fresh = after.split("\n");
    const lengths = old.map(() => new Array(fresh.length + 1).fill(0));
    lengths.push(new Array(fresh.length + 1).fill(0));
    for (let row = old.length - 1; row >= 0; row -= 1) {
        for (let column = fresh.length - 1; column >= 0; column -= 1) {
            lengths[row][column] = old[row] === fresh[column] ? lengths[row + 1][column + 1] + 1 : Math.max(lengths[row + 1][column], lengths[row][column + 1]);
        }
    }
    const lines = [];
    let row = 0;
    let column = 0;
    while (row < old.length || column < fresh.length) {
        if (row < old.length && column < fresh.length && old[row] === fresh[column]) {
            lines.push({key: `old:${row}`, type: "same", text: old[row]});
            row += 1;
            column += 1;
        } else if (column < fresh.length && (row === old.length || lengths[row][column + 1] >= lengths[row + 1][column])) {
            lines.push({key: `new:${column}`, type: "added", text: fresh[column]});
            column += 1;
        } else {
            lines.push({key: `old:${row}`, type: "removed", text: old[row]});
            row += 1;
        }
    }
    return lines;
}
