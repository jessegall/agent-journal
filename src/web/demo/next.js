const all = (selector) => [...document.querySelectorAll(selector)];
const labelled = (label) => all("button").filter((b) => b.textContent.trim().startsWith(label));

const FOUND = {
    send: () => all(".compose-send.ready"),
    approve: () => all(".plan-card-start"),
    answer: (standIn, move) => labelled(standIn.player.recorded(move)),
};

function uncovered(el) {
    const r = el.getBoundingClientRect();
    if (r.width < 4) return false;
    const hit = document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2);
    return Boolean(hit && el.contains(hit));
}

export function nextButtons(standIn) {
    const move = standIn.player.waiting;
    if (!move || standIn.player.playing) return [];
    return FOUND[move.kind](standIn, move).filter(uncovered);
}
