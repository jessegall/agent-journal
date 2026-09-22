import {reactive} from "vue";
import {reload} from "../sync/rows.js";
import {missed} from "../domain/records.js";
import {store} from "../state/store.js";

const AWAY_AFTER = 60000;

export const away = reactive({open: false, since: 0, back: 0, left: 0, hidden: false});
export const flash = reactive({at: Date.now()});

function left() {
    away.left = away.left || Date.now();
    away.hidden = true;
    flash.at = Date.now();
}

async function back() {
    away.hidden = false;
    if (document.visibilityState !== "visible" || !away.left) return;
    const since = away.left;
    away.left = 0;
    if (Date.now() - since < AWAY_AFTER || store.settings?.viewer?.away === false) return;
    await reload();
    if (!missed(since).length) return;
    Object.assign(away, {open: true, since, back: Date.now()});
}

document.addEventListener("visibilitychange", () => (document.hidden ? left() : back()));
window.addEventListener("blur", left);
window.addEventListener("focus", back);

export function showAway() {
    Object.assign(away, {open: true, since: away.since || Date.now() - 86400000, back: Date.now()});
}
