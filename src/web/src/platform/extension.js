import {store} from "../state/store.js";

export function tellExtension(kind, extra = {}) {
    window.postMessage({source: "journal-page", kind, ...extra}, window.location.origin);
}

export function tellShell(op, extra = {}) {
    window.parent.postMessage({source: "journal-page", kind: "shell", op, ...extra}, "*");
}

function answered(e) {
    if (e.source !== window || e.origin !== window.location.origin || !e.data || e.data.source !== "journal-extension") return;
    if (e.data.kind === "here") {
        store.extension.here = true;
        store.extension.holding = !!e.data.holding;
        store.detached = store.detached || store.extension.holding;
    }
    if (e.data.kind === "detached") {
        store.extension.pending = false;
        store.extension.holding = true;
        store.extension.everywhere = e.data.everywhere !== false;
        store.detached = true;
    }
    if (e.data.kind === "attached") {
        store.extension.pending = false;
        store.extension.holding = false;
        store.detached = false;
    }
    if (e.data.kind === "failed") {
        store.extension.pending = false;
        store.extension.holding = false;
    }
}

window.addEventListener("message", answered);
tellExtension("hello");

export function detach(on) {
    if (on) {
        store.detached = true;
        if (store.extension.here) {
            store.extension.pending = true;
            tellExtension("detach");
        }
    } else {
        store.detached = false;
        store.extension.pending = false;
        if (store.extension.here && store.extension.holding) tellExtension("attach");
        store.extension.holding = false;
    }
}
