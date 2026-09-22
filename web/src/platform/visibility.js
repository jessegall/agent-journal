import {reactive} from "vue";
import {reload} from "../sync/rows.js";
import {missed} from "../domain/records.js";
import {store} from "../state/store.js";

const AWAY_AFTER = 60000;
const PICKING_FOR = 20000;
let picking = 0;

export const away = reactive({open: false, since: 0, back: 0, left: 0, hidden: false});
export const flash = reactive({at: Date.now()});

function left() {
    away.left = away.left || Date.now();
    if (Date.now() < picking) return;
    away.hidden = true;
    flash.at = Date.now();
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

async function back() {
    if (document.visibilityState === "visible") away.hidden = false;
    if (document.visibilityState !== "visible" || !away.left) return;
    const since = away.left;
    away.left = 0;
    if (Date.now() - since < AWAY_AFTER || store.settings?.viewer?.away === false) return;
    await reload();
    if (!missed(since).length) return;
    Object.assign(away, {open: true, since, back: Date.now()});
}

document.addEventListener("visibilitychange", () => (document.hidden ? left() : back()));
window.addEventListener("blur", () => left());
window.addEventListener("focus", back);

export function showAway() {
    Object.assign(away, {open: true, since: away.since || Date.now() - 86400000, back: Date.now()});
}
