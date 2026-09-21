import {api} from "./api.js";
import {route} from "./route.js";

const said = new Set();

function report(words, where, stack) {
    const key = `${words}|${where}`;
    if (!words || said.has(key) || !route.value.env) return;
    said.add(key);
    api("POST", `/${route.value.env}/console`, {
        said: String(words),
        where: String(where || location.pathname),
        stack: String(stack || ""),
    }).catch(() => {});
}

export function watchConsole() {
    window.addEventListener("error", (e) => report(e.message, `${e.filename}:${e.lineno}`, e.error && e.error.stack));
    window.addEventListener("unhandledrejection", (e) =>
        report(e.reason && (e.reason.message || e.reason), "", e.reason && e.reason.stack)
    );
    const was = console.error;
    console.error = (...parts) => {
        was(...parts);
        const thrown = parts.find((p) => p instanceof Error);
        report(thrown ? thrown.message : parts.map(String).join(" "), "", thrown && thrown.stack);
    };
}
