const PREFIX = "demo:";
const OWNED = [PREFIX, "journal.", "events:"];

export const BUILD = __DEMO_BUILD__;
const key = `${PREFIX}${BUILD}:state`;

export function readState() {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (e) {
        return null;
    }
}

export function writeState(state) {
    try {
        localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
        return;
    }
}

function clear(store) {
    Object.keys(store)
        .filter((name) => OWNED.some((prefix) => name.startsWith(prefix)))
        .forEach((name) => store.removeItem(name));
}

export function forgetEarlierBuilds() {
    if (readState()) return;
    try {
        clear(localStorage);
        clear(sessionStorage);
    } catch (e) {
        return;
    }
}

export function restart() {
    try {
        clear(localStorage);
        clear(sessionStorage);
    } catch (e) {
        return;
    }
    location.reload();
}
