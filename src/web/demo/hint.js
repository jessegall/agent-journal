const NOTE_FOR = 3200;
const EDGE = 8;
const GAP = 8;
const KEEPING = /keep this revision/i;
const TURNS = {
    send: "Press Send to carry on. Your message is already in the field.",
    approve: "Press Approve to carry on.",
    answer: "Pick the outlined answer to carry on.",
};

function reason(standIn, target) {
    const {player} = standIn;
    if (KEEPING.test(target.closest("button")?.textContent || ""))
        return "The recording keeps the document as written. You need not press anything here.";
    if (player.view.ended || player.finished) return "The lesson is over. Watch it again or pick another.";
    if (player.view.paused) return "The lesson is paused. Press Play to carry on.";
    if (player.playing) return "The agent is still working. Watch it first.";
    return TURNS[player.waiting.kind];
}

export function noticeReplay(standIn) {
    let note = null;
    let gone = null;
    const cleared = () => {
        if (note) note.remove();
        note = null;
    };
    window.addEventListener("replay-hint", ({detail}) => {
        cleared();
        clearTimeout(gone);
        note = document.createElement("div");
        note.className = "replay-hint";
        note.textContent = reason(standIn, detail.target);
        note.setAttribute("role", "status");
        Object.assign(note.style, {
            position: "fixed",
            zIndex: "10000",
            maxWidth: "min(260px, calc(100vw - 16px))",
            padding: "8px 12px",
            borderRadius: "10px",
            background: "var(--accent)",
            color: "#fff",
            font: "13px/1.4 var(--font, system-ui)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
            pointerEvents: "none",
        });
        document.body.append(note);
        const {width, height} = note.getBoundingClientRect();
        const {left, top, bottom} = detail.target.getBoundingClientRect();
        const below = bottom + GAP + height < innerHeight;
        note.style.left = `${Math.max(EDGE, Math.min(left, innerWidth - width - EDGE))}px`;
        note.style.top = `${below ? bottom + GAP : Math.max(EDGE, top - GAP - height)}px`;
        gone = setTimeout(cleared, NOTE_FOR);
    });
}
