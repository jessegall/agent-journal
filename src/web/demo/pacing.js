const FASTEST = 0.8;
const LONGEST = 5;
const BACKGROUND = 0.3;
const SUBJECT = 3;
const PRESS_SECONDS = 6;
const BEHIND_THE_SCENES = new Set(["agent", "nudge"]);
const MOVES = [
    ["send", (e) => e.type === "message" && e.action === "created"],
    ["approve", (e) => e.type === "plan" && e.action === "updated" && e.data.by === "approve"],
    ["answer", (e) => e.type === "question" && e.action === "completed"],
    ["answer", (e) => e.type === "dump" && e.action === "updated" && e.data.by === "answer"],
];

const newest = (moment) => Math.max(0, ...(moment.events || []).map((e) => e.id));
const freshEvents = (moment, before) => (moment.events || []).filter((e) => e.id > newest(before));

function moveIn(moment, before) {
    const fresh = freshEvents(moment, before).filter((e) => e.actor === "user");
    for (const [kind, is] of MOVES) {
        const event = fresh.find(is);
        if (event) return {kind, n: event.n, type: event.type};
    }
    return null;
}

export function movesOf(moments) {
    return moments.map((moment, at) => (at > 0 ? moveIn(moment, moments[at - 1]) : null)).map((move, at) => move && {...move, at});
}

export function stepSeconds(moments, at, subjects) {
    const fresh = freshEvents(moments[at], moments[at - 1]);
    if (fresh.length && fresh.every((e) => BEHIND_THE_SCENES.has(e.type))) return BACKGROUND;
    const recorded = Math.min(LONGEST, Math.max(FASTEST, moments[at].at - moments[at - 1].at));
    const changesSubject = fresh.some((e) => e.action === "created" && subjects.includes(e.type));
    return changesSubject ? Math.max(SUBJECT, recorded) : recorded;
}

export function lessonFacts(moments, subjects) {
    const moves = movesOf(moments).filter(Boolean);
    const stepped = moments
        .slice(1)
        .reduce((sum, _, at) => sum + (moves.some((m) => m.at === at + 1) ? 0 : stepSeconds(moments, at + 1, subjects)), 0);
    return {seconds: Math.round(stepped + moves.length * PRESS_SECONDS), presses: moves.length};
}

export function lengthLine({seconds, presses}) {
    const minutes = Math.round(seconds / 60);
    const long = seconds < 45 ? "Under a minute" : minutes <= 1 ? "About a minute" : `About ${minutes} minutes`;
    return `${long}, you press ${presses} ${presses === 1 ? "thing" : "things"}`;
}
