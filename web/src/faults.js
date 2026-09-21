import {api} from "./api/client.js";
import {route} from "./route.js";

const BUDGET = 50;
const PAGE = 25;
const QUIET = 60000;
const SETTLE = 1000;
const KEPT = 200;
const told = new Map();
const flying = new Map();
let reporting = false;

export function report(kind, words, where, stack = "") {
    const key = `${kind}|${where || words}`;
    if (!words || !route.value.env || Date.now() - (told.get(key) || 0) < QUIET) return;
    told.set(key, Date.now());
    reporting = true;
    api.report({
        kind,
        said: String(words),
        where: String(where || location.pathname),
        stack: String(stack || ""),
    })
        .catch(() => {})
        .finally(() => (reporting = false));
}

function endpoint(input, init) {
    const url = new URL(typeof input === "string" ? input : input.url, location.origin);
    return `${(init && init.method) || (input && input.method) || "GET"} ${url.pathname}`;
}

function watchFetch() {
    const was = window.fetch.bind(window);
    window.fetch = async (input, init) => {
        const where = endpoint(input, init);
        if (reporting) return was(input, init);
        if (flying.get(where)) report("overlap", `two requests to ${where} were in flight at once`, where);
        const asked = new URL(typeof input === "string" ? input : input.url, location.origin).searchParams.get("last");
        if (asked !== null && (Number(asked) === 0 || Number(asked) > PAGE))
            report("page", `${where} asked for ${asked === "0" ? "every row" : `${asked} rows`}`, where);
        flying.set(where, (flying.get(where) || 0) + 1);
        try {
            return await was(input, init);
        } finally {
            flying.set(where, flying.get(where) - 1);
            setTimeout(() => timed(new URL(typeof input === "string" ? input : input.url, location.origin).href, where), SETTLE);
        }
    };
}

function timed(href, where) {
    const entry = performance.getEntriesByName(href).pop();
    if (performance.getEntriesByType("resource").length > KEPT) performance.clearResourceTimings();
    if (!entry || !entry.responseStart) return;
    const took = Math.round(entry.responseStart - entry.requestStart);
    if (took > BUDGET) report("slow", `${where} took ${took}ms`, where);
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
