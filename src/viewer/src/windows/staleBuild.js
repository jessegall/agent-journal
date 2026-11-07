import {transport} from "../api/transport.js";
import {reloadWhenFree} from "../platform/busyField.js";

const STORAGE_KEY = "journal.stale-build-reload";
const BUNDLE = 'script[type="module"][src*="/assets/index-"]';
const bundleOf = (page) => page.querySelector(BUNDLE)?.getAttribute("src") ?? "";

// after a restart a tab may hold an older build than the server now serves, and only a new page load brings the new one; a field being typed in holds the reload
export async function reloadIfNewBuild(page = document, ask = (url, init) => transport.quietRead(url, init), reload = () => reloadWhenFree(window)) {
    const running = bundleOf(page);
    const answer = running ? await ask("/viewer/", {cache: "no-store"}).catch(() => null) : null;
    if (!answer?.ok) return false;
    const served = bundleOf(new DOMParser().parseFromString(await answer.text(), "text/html"));
    if (!served || served === running) return false;
    reload();
    return true;
}

// when the server last asked had started: a later start may run other code after an install, and this page holds its windows from before
let knownStart = "";

export function reloadForNewStart(startedAt, reload = () => reloadWhenFree(window)) {
    if (!startedAt) return false;
    const isNew = Boolean(knownStart) && knownStart !== startedAt;
    knownStart = startedAt;
    if (isNew) reload();
    return isNew;
}

// a window file newer than the kit this page holds in memory names an export the old kit lacks: only a new page load fixes that
export const isStaleBuild = (error) => /does not provide an export/.test(String(error?.message ?? ""));

// reloads the page for this failure, once, so a file that really lacks the export shows its failure and does not reload for ever
export function reloadForNewBuild(error, storage = window.sessionStorage, reload = () => window.location.reload()) {
    try {
        if (storage.getItem(STORAGE_KEY) === error.message) return false;
        storage.setItem(STORAGE_KEY, error.message);
    } catch {
        return false;
    }
    reload();
    return true;
}

export function forgetBuildReload(storage = window.sessionStorage) {
    try {
        storage.removeItem(STORAGE_KEY);
    } catch {
        return;
    }
}
