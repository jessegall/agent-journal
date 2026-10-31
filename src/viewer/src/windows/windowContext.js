import {computed, ref} from "vue";
import {matches} from "./windowSubscriptions.js";
export {WINDOW_CONTEXT, useWindow} from "@journal/window-kit";

const FAILURES = {1: "refused", 2: "usage", 3: "fault"};
const READ_COALESCE_MS = 100;
const WORD = /"([^"]*)"|'([^']*)'|(\S+)/g;

// what every window is given: its name, environment and agent, whether it is shown, what it may run, its follows
// through the host, whether it is only looked at, and the one row it is shown for (a share session), read and run, which never throw and answer {ok, value} or {ok, failure, error}, and its own settings
export function windowContext({window, environment, agent, visible, permissions, events = [], subscriptions, open, options = ref({}), declared = [], readOnly = false, shared = null}) {
    const recent = new Map();
    const read = (line) => {
        const last = recent.get(line);
        if (last && performance.now() - last.at < READ_COALESCE_MS) return last.answer;
        const answer = lineResult(window, line, environment);
        recent.set(line, {answer, at: performance.now()});
        return answer;
    };
    return {
        window,
        environment,
        agent,
        visible: computed(() => visible()),
        permissions,
        readOnly,
        shared,
        read,
        run: (line) => lineResult(window, line, environment),
        follow: (patterns, heard) => subscriptions.follow(window, patterns.filter((pattern) => events.some((declared) => matches(declared, pattern))), heard, visible),
        open,
        face: document.documentElement.classList.contains("phone") ? "phone" : "person",
        option: (key) => computed(() => options.value[key] ?? declared.find((option) => option.key === key)?.default),
        setting: async (key, fallback) => {
            const answer = await read(`window setting ${window} ${key}`);
            return answer.ok ? answer.value.value : fallback;
        },
        keep: (key, value) => lineResult(window, ["window", "save-setting", window, key, JSON.stringify(value)], environment),
    };
}

// the words of a refusal the journal printed as JSON, else the text as it came
export function refusalWords(text) {
    try {
        const refusal = JSON.parse(text);
        return [refusal.refusal, refusal.error, refusal.message].find((words) => typeof words === "string") ?? text;
    } catch (error) {
        return text;
    }
}

export async function lineResult(window, line, environment) {
    try {
        const response = await fetch("/api/line", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({window, line: Array.isArray(line) ? line : lineWords(line), environment})});
        const answer = await response.json();
        return answer.code === 0 ? {ok: true, value: answer.value} : {ok: false, failure: FAILURES[answer.code] || "fault", error: refusalWords(answer.error)};
    } catch (error) {
        return {ok: false, failure: "unreachable", error: String(error)};
    }
}

export function lineWords(line) {
    return [...line.matchAll(WORD)].map((match) => match[1] ?? match[2] ?? match[3]);
}
