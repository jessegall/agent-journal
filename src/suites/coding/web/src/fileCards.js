const SMALL_ROWS = 6;
const SMALL_CHARS = 44;

const small = (card) => card.rows.length <= SMALL_ROWS && card.rows.every((row) => row.text.length <= SMALL_CHARS);
const joins = (card, edit) => card.path === edit.path;
const tagged = (edit) => edit.rows.map((row) => ({...row, edit: edit.id}));
const numbers = (rows) => rows.map((row) => row.line).filter(Boolean);

function merged(card, edit, rows) {
    const first = numbers(rows)[0];
    const gap = first && card.last_line ? first - card.last_line - 1 : 0;
    const between = gap ? [{line_type: "fold", line: null, text: "", hidden: Math.max(gap, 0), edit: edit.id}] : [];
    return {...card, rows: [...card.rows, ...between, ...rows], last_line: numbers(rows).at(-1) ?? card.last_line, added: card.added + edit.added, removed: card.removed + edit.removed, created_at: edit.created_at, latest: edit.id};
}

function land(cards, edit) {
    const last = cards[cards.length - 1];
    const waiting = Boolean(last && last.half && last.alone);
    const before = cards.slice(0, -1);
    const rows = tagged(edit);
    if (last && joins(last, edit)) {
        const card = merged(last, edit, rows);
        return [...before, waiting && !small(card) ? {...card, half: false, alone: false} : card];
    }
    const card = {...edit, rows, last_line: numbers(rows).at(-1) ?? 0, latest: edit.id};
    const fits = small(card);
    const kept = last ? [waiting ? {...last, half: fits, alone: false} : last] : [];
    return [...before, ...kept, {...card, half: fits, alone: fits && !waiting}];
}

// the edits, oldest first, as version 4's feed drew them: edits of one file one after the other join one card, and two small cards in a row share a line of the feed
export const cardsOf = (edits) => edits.map((edit) => ({...edit, rows: JSON.parse(edit.rows || "[]")})).reduce(land, []);
