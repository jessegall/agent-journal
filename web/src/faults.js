import {api} from "./api.js";
import {route} from "./route.js";
import {store} from "./store.js";

const BUDGET = 50;
const QUIET = 60000;
const REPORTED = "/console";
const told = new Map();
const flying = new Map();

function report(kind, words, where, stack = "") {
    const key = `${kind}|${where || words}`;
    const on = store.settings && store.settings.features && store.settings.features.faults;
    if (!on || !words || !route.value.env || Date.now() - (told.get(key) || 0) < QUIET) return;
    told.set(key, Date.now());
    api("POST", `/${route.value.env}${REPORTED}`, {
        kind,
        said: String(words),
        where: String(where || location.pathname),
        stack: String(stack || ""),
    }).catch(() => {});
}

function endpoint(input, init) {
    const url = new URL(typeof input === "string" ? input : input.url, location.origin);
    return `${(init && init.method) || (input && input.method) || "GET"} ${url.pathname}`;
}

function watchFetch() {
    const was = window.fetch.bind(window);
    window.fetch = async (input, init) => {
        const where = endpoint(input, init);
        if (where.endsWith(REPORTED)) return was(input, init);
        if (flying.get(where)) report("overlap", `two requests to ${where} were in flight at once`, where);
        flying.set(where, (flying.get(where) || 0) + 1);
        const began = performance.now();
        try {
            return await was(input, init);
        } finally {
            flying.set(where, flying.get(where) - 1);
            const took = Math.round(performance.now() - began);
            if (took > BUDGET && !where.endsWith("/stream")) report("slow", `${where} took ${took}ms`, where);
        }
    };
}

export function watchConsole() {
    watchFetch();
    window.addEventListener("error", (e) => report("threw", e.message, `${e.filename}:${e.lineno}`, e.error && e.error.stack));
    window.addEventListener("unhandledrejection", (e) =>
        report("threw", e.reason && (e.reason.message || e.reason), "", e.reason && e.reason.stack)
    );
    const was = console.error;
    console.error = (...parts) => {
        was(...parts);
        const thrown = parts.find((p) => p instanceof Error);
        report("threw", thrown ? thrown.message : parts.map(String).join(" "), "", thrown && thrown.stack);
    };
}
