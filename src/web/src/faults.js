import {api} from "./api/client.js";
import {transport} from "./api/transport.js";
import {route} from "./route.js";

const BUDGET = 50;
const REPORTED_AFTER = BUDGET * 4;
const PAGE = 25;
const QUIET = 60000;
const SETTLE = 1000;
const KEPT = 200;
const reported = new Map();
const flying = new Map();
const CONSOLE = "/console";

export function report(kind, words, where, stack = "") {
    const key = `${kind}|${where || words}`;
    if (!words || !route.value.env || Date.now() - (reported.get(key) || 0) < QUIET) return;
    reported.set(key, Date.now());
    api.report({
        kind,
        message: String(words),
        where: String(where || location.pathname),
        stack: String(stack || ""),
    }).catch(() => {});
}

function watched(phase, method, url, body) {
    const href = new URL(url, location.origin);
    if (href.pathname.endsWith(CONSOLE)) return;
    const where = `${method} ${href.pathname}`;
    const same = body instanceof FormData ? where : `${where} ${JSON.stringify(body ?? null)}`;
    if (phase === "answered") {
        flying.set(same, flying.get(same) - 1);
        setTimeout(() => timed(href.href, where), SETTLE);
        return;
    }
    if (flying.get(same)) report("overlap", `two requests to ${where} were in flight at once`, where);
    const asked = href.searchParams.get("last");
    if (asked !== null && (Number(asked) === 0 || Number(asked) > PAGE))
        report("page", `${where} asked for ${asked === "0" ? "every row" : `${asked} rows`}`, where);
    flying.set(same, (flying.get(same) || 0) + 1);
}

function timed(href, where) {
    const entry = performance.getEntriesByName(href).pop();
    if (performance.getEntriesByType("resource").length > KEPT) performance.clearResourceTimings();
    if (!entry || !entry.responseStart) return;
    const took = Math.round(entry.responseStart - entry.requestStart);
    if (took > REPORTED_AFTER) report("slow", `${where} took ${took}ms`, where);
}

export function watchConsole() {
    transport.watch(watched);
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
