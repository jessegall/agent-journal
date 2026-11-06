import {lineBatch} from "./lineBatch.js";
import {afterSkeletonMinimum} from "../../kit/skeletonMinimum.js";
import {transport} from "../api/transport.js";
import {computed, ref} from "vue";
import {matches} from "./windowSubscriptions.js";
import {covered, serverBack} from "../state/updating.js";
export {OPEN_VIEW, WINDOW_CONTEXT, useWindow} from "@journal/window-kit";

// the page a pane stage draws, given to the windows in its panes
export const PANE_PAGE = Symbol("pane-page");

// what a page gives the inspector to draw the sections modules add to it; a page that provides none, such as a share, draws no section
export const INSPECTOR_HOST = Symbol("inspector-host");

const FAILURES = {1: "refused", 2: "usage", 3: "fault"};
const READ_COALESCE_MS = 100;
const QUIET_AFTER_READS_MS = 50;
const WORD = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g;
const QUOTED = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;

// what every window is given: its name, environment, agent and page, whether it is shown, what it may run, its follows
// through the host, the search it declares, whether it is only looked at, and the one row it is shown for (a share session), read and run, which never throw and answer {ok, value} or {ok, failure, error}, and its own settings, one of its pane's options written through setOption
export function windowContext({window, environment, agent, visible, permissions, events = [], subscriptions, open, options = ref({}), declared = [], page = null, setOption = () => {}, autoScroll = "", tabs = [], sources = [], links = {}, search = {}, readOnly = false, shared = null}) {
    const recent = new Map();
    // every request this window makes carries this signal, so the window ending (a tab switched, the page left) cancels them all
    const requests = new AbortController();
    // true once the window's first reads have answered and no read followed them, which is when its skeleton gives way; it stays true, so a later read never brings the skeleton back
    const answered = ref(false);
    const startedAt = performance.now();
    let reading = 0;
    let quiet = 0;
    let markLoaded = () => {};
    // resolved once the window has answered, or has ended, which is when a deferred read may go: an ended window's signal cancels it before it leaves
    const loaded = new Promise((resolve) => (markLoaded = resolve));
    requests.signal.addEventListener("abort", markLoaded, {once: true});
    const settle = () => {
        clearTimeout(quiet);
        quiet = setTimeout(() => {
            if (reading !== 0) return;
            afterSkeletonMinimum(startedAt, () => {
                answered.value = true;
                markLoaded();
            });
        }, QUIET_AFTER_READS_MS);
    };
    const readNow = (line, unbatched) => {
        reading += 1;
        return lineResult(window, line, environment, requests.signal, unbatched).finally(() => {
            reading -= 1;
            settle();
        });
    };
    // a deferred read is not counted among the reads the window waits for, and leaves once the window has loaded
    const readAfterLoad = (line, unbatched) => {
        settle();
        return loaded.then(() => (requests.signal.aborted ? CANCELLED : lineResult(window, line, environment, requests.signal, unbatched)));
    };
    const read = (line, {unbatched = false, deferred = false} = {}) => {
        const last = recent.get(line);
        if (last && performance.now() - last.at < READ_COALESCE_MS) return last.answer;
        const answer = deferred && !answered.value ? readAfterLoad(line, unbatched) : readNow(line, unbatched);
        recent.set(line, {answer, at: performance.now()});
        return answer;
    };
    return {
        answered,
        settle,
        window,
        environment,
        agent,
        page,
        visible: computed(() => visible()),
        permissions,
        autoScroll,
        tabs,
        sources,
        links,
        search,
        readOnly,
        shared,
        read,
        run: (line) => lineResult(window, line, environment, requests.signal),
        upload: (file) => uploaded(file, window, requests.signal),
        cancel: () => requests.abort(),
        signal: requests.signal,
        subscriptions,
        follow: (patterns, heard) => subscriptions.follow(window, patterns.filter((pattern) => events.some((declared) => matches(declared, pattern))), (event) => {
            recent.clear();
            heard(event);
        }, visible),
        open,
        face: document.documentElement.classList.contains("phone") ? "phone" : "person",
        option: (key) => computed(() => options.value[key] ?? declared.find((option) => option.key === key)?.default),
        setting: async (key, fallback) => {
            const answer = await read(`window setting ${window} ${key}`);
            return answer.ok ? answer.value.value : fallback;
        },
        setOption,
        keep: (key, value) => lineResult(window, ["window", "save-setting", window, key, JSON.stringify(value)], environment, requests.signal),
    };
}

// the words of a refusal the journal printed as JSON, else the text as it came
function refusalWords(text) {
    try {
        const refusal = JSON.parse(text);
        if (typeof refusal.refused === "string") return [refusal.refused, refusal.suggestion].filter(Boolean).join(": ");
        return [refusal.error, refusal.message].find((words) => typeof words === "string") ?? text;
    } catch (error) {
        return text;
    }
}

export const CANCELLED = {ok: false, failure: "cancelled", error: ""};
const UNREACHABLE = "The journal did not answer, so this may or may not have gone through. Check before you try again.";

// a request cancelled by its signal answers CANCELLED, whether it was cut off or its answer came after, so a window that has
// gone never draws the answer
async function lineAnswer(asked, signal) {
    try {
        const answer = await asked();
        if (signal?.aborted) return CANCELLED;
        return answer.code === 0 ? {ok: true, value: answer.value} : {ok: false, failure: FAILURES[answer.code] || "fault", error: refusalWords(answer.error)};
    } catch (error) {
        if (signal?.aborted) return CANCELLED;
        return {ok: false, failure: "unreachable", error: UNREACHABLE};
    }
}

// a read the server could not answer waits for the server to come back and asks again, so a window never draws the restart as a failure
async function readAnswer(body, signal, unbatched) {
    const answer = await lineAnswer(() => lineBatch.read(body, signal, unbatched), signal);
    if (answer.failure !== "unreachable" || !covered()) return answer;
    await serverBack();
    return signal.aborted ? CANCELLED : readAnswer(body, signal, unbatched);
}

// a line of a window, read or write, whichever way it was asked: the server's knowledge of its command decides, and only a read is joined
export async function lineResult(window, line, environment, signal = undefined, unbatched = false) {
    const body = {window, line: Array.isArray(line) ? line : lineWords(line), environment};
    if (!(await transport.isRead(body.line))) return lineAnswer(() => lineBatch.write(body), signal);
    return transport.joined(JSON.stringify(body), (stop) => readAnswer(body, stop, unbatched), signal).catch(() => CANCELLED);
}

// a file the person attached, sent to the journal to wait for the message that names it: answers {ok, value: its pending name}
async function uploaded(file, window, signal = undefined) {
    try {
        const response = await transport.raw(`/api/files?name=${encodeURIComponent(file.name)}`, {method: "POST", headers: {"Content-Type": "application/octet-stream"}, body: file}, {window, line: `upload ${file.name}`});
        const answer = await response.json();
        if (signal?.aborted) return CANCELLED;
        return response.ok ? {ok: true, value: answer.file} : {ok: false, failure: "refused", error: answer.error ?? "the file was not taken"};
    } catch (error) {
        if (signal?.aborted) return CANCELLED;
        return {ok: false, failure: "unreachable", error: UNREACHABLE};
    }
}

export function lineWords(line) {
    return [...line.matchAll(WORD)].map(([word]) => word.replace(QUOTED, (_, single, double, escaped) =>
        single ?? (double === undefined ? escaped : double.replace(/\\(["\\])/g, "$1"))));
}
