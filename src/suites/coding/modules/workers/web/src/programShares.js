export function sharesAfter(rows, program, value) {
    if (!rows.some((row) => row.id === program)) return rows;
    if (rows.length === 1) return rows.map((row) => ({...row, share: 100}));
    const share = Math.max(0, Math.min(100, Math.round(Number(value) / 5) * 5));
    const others = rows.filter((row) => row.id !== program);
    const total = others.reduce((sum, row) => sum + row.share, 0);
    const units = (100 - share) / 5;
    const portions = others.map((row) => ({id: row.id, units: units * (total ? row.share / total : 1 / others.length)}));
    const rounded = new Map(portions.map((row) => [row.id, Math.floor(row.units)]));
    const remaining = units - [...rounded.values()].reduce((sum, count) => sum + count, 0);
    const order = [...portions].sort((left, right) => (right.units % 1) - (left.units % 1));
    for (const row of order.slice(0, remaining)) rounded.set(row.id, rounded.get(row.id) + 1);
    return rows.map((row) => ({...row, share: row.id === program ? share : rounded.get(row.id) * 5}));
}
