import {nextTick} from "vue";
import {reload} from "../sync/rows.js";
import {missed} from "../domain/records.js";
import {store} from "../state/store.js";
import {ui} from "../state/ui.js";

const AWAY_AFTER = 60000;
const PICKING_FOR = 20000;
let picking = 0;

function left() {
    ui.away.left = ui.away.left || Date.now();
    if (Date.now() < picking) return;
    ui.away.hidden = true;
    ui.flash.at = Date.now();
}

export function pickingFiles() {
    picking = Date.now() + PICKING_FOR;
}

const FILE_INPUT = 'input[type="file"]';

document.addEventListener(
    "click",
    (e) => {
        const at = e.target instanceof Element ? e.target : null;
        if (at && (at.matches(FILE_INPUT) || at.closest("label")?.querySelector(FILE_INPUT))) pickingFiles();
    },
    true
);

let reading = null;

// one read of the latest page however many ways the reader came back at once: the tab shown, the window focused, the page restored
function readLatest() {
    reading ||= reload().finally(() => (reading = null));
    return reading;
}

// the chat shows what came while the tab was hidden all at once: arrivals wait on nothing until the latest page is read and drawn
async function shown() {
    Object.assign(ui.away, {tabHidden: false, readingLatest: true});
    try {
        await readLatest();
        await nextTick();
    } finally {
        ui.away.readingLatest = false;
    }
}

function tabChanged() {
    if (document.hidden) {
        ui.away.tabHidden = true;
        return left();
    }
    shown();
    back();
}

async function back() {
    if (document.visibilityState === "visible") Object.assign(ui.away, {hidden: false, returnedAt: Date.now()});
    if (document.visibilityState !== "visible" || !ui.away.left) return;
    const since = ui.away.left;
    ui.away.left = 0;
    if (Date.now() - since < AWAY_AFTER || store.settings?.viewer?.away === false) return;
    await readLatest();
    if (!missed(since).length) return;
    Object.assign(ui.away, {open: true, since, back: Date.now()});
}

document.addEventListener("visibilitychange", tabChanged);
window.addEventListener("blur", () => left());
window.addEventListener("focus", back);
window.addEventListener("pageshow", back);

export function showAway() {
    Object.assign(ui.away, {open: true, since: ui.away.since || Date.now() - 86400000, back: Date.now()});
}
