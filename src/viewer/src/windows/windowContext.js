import {computed} from "vue";
export {WINDOW_CONTEXT, useWindow} from "@journal/window-kit";

const FAILURES = {1: "refused", 2: "usage", 3: "fault"};
const READ_COALESCE_MS = 100;
const WORD = /"([^"]*)"|'([^']*)'|(\S+)/g;

// what every window is given: its name, environment and agent, whether it is shown, what it may run, its follows
// through the host, read and run, which never throw and answer {ok, value} or {ok, failure, error}, and its own settings
export function windowContext({window, environment, agent, visible, permissions, subscriptions, open}) {
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
        read,
        run: (line) => lineResult(window, line, environment),
        follow: (patterns, heard) => subscriptions.follow(window, patterns, heard, visible),
        open,
        setting: async (key, fallback) => {
            const answer = await read(`window setting ${window} ${key}`);
            return answer.ok ? JSON.parse(answer.value.value) : fallback;
        },
        keep: (key, value) => lineResult(window, ["window", "save-setting", window, key, JSON.stringify(value)], environment),
    };
}

export async function lineResult(window, line, environment) {
    try {
        const response = await fetch("/api/line", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({window, line: Array.isArray(line) ? line : lineWords(line), environment})});
        const answer = await response.json();
        return answer.code === 0 ? {ok: true, value: answer.value} : {ok: false, failure: FAILURES[answer.code] || "fault", error: answer.error};
    } catch (error) {
        return {ok: false, failure: "unreachable", error: String(error)};
    }
}

export function lineWords(line) {
    return [...line.matchAll(WORD)].map((match) => match[1] ?? match[2] ?? match[3]);
}
