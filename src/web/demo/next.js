const BUTTONS = {send: ".compose-send.ready", approve: ".plan-card-start"};

function uncovered(el) {
    const r = el.getBoundingClientRect();
    if (r.width < 4) return false;
    const hit = document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2);
    return Boolean(hit && el.contains(hit));
}

function choices(standIn, move) {
    if (move.fork) return Object.keys(standIn.demo.branches);
    const row = (standIn.state.rows[move.type] || []).find((one) => one.n === move.n);
    if (!row) return [];
    return move.type === "dump" ? row.data.question?.guesses || [] : (row.data.options || []).map((option) => option.title);
}

const labelled = (labels) => [...document.querySelectorAll("button")].filter((b) => labels.some((label) => b.textContent.trim().startsWith(label)));

export function nextButtons(standIn) {
    const move = standIn.player.waiting;
    if (!move || standIn.player.playing) return [];
    const found = move.kind in BUTTONS ? [...document.querySelectorAll(BUTTONS[move.kind])] : labelled(choices(standIn, move));
    return found.filter(uncovered);
}
