import {transport} from "../api/transport.js";
import {shallowRef} from "vue";
import {readMarkDeclarations} from "../domain/markRegistry.js";
import {startButtons} from "../domain/buttons.js";
import {AllowancePrompts} from "./allowancePrompts.js";
import {lineResult} from "./windowContext.js";
import {WindowCatalogue, fetchWindowCatalogue, followEvents} from "./windowCatalogue.js";
import {WindowSubscriptions} from "./windowSubscriptions.js";

const SHELL_WINDOW = "viewer.shell";
const PHONE_WORKER = "/viewer/phone-sw.js";

// reads that several parts of a page ask for at its start are asked once: the second asker takes the answer of the first, which is
// kept only while it is on its way
const SHARED_READS = new Set(["suite current"]);

// a page's reads and runs through the shell's own window
export const shellReader = (environment) => {
    const asking = new Map();
    return (line) => {
        const key = Array.isArray(line) ? line.slice(0, 2).join(" ") : "";
        if (!SHARED_READS.has(key)) return lineResult(SHELL_WINDOW, line, environment);
        const sent = JSON.stringify(line);
        if (!asking.has(sent)) asking.set(sent, lineResult(SHELL_WINDOW, line, environment).finally(() => asking.delete(sent)));
        return asking.get(sent);
    };
};

// who the cookie acts for, as GET /api/session answers it: its type (person, phone or share) and the person; the page start and the
// windows both ask, so the answer is kept for the length of the page
let sessionAnswer = null;
export const readSession = () => {
    sessionAnswer ??= transport.raw("/api/session").then((response) => response.json()).catch((failure) => {
        sessionAnswer = null;
        throw failure;
    });
    return sessionAnswer;
};

// what a page of windows needs to run: the catalogue, the shared subscriptions, the shell's own line and allowance
// prompts, the face its session asks for once `opened` answers, the reason the journal cannot run the shell's lines when it
// cannot (`problem`), and the environment's event stream, which feeds the catalogue, any `listeners` given later, and the
// windows; `stop` ends the stream
export function startWindows({environment, catalogue = null, events = followEvents, session = readSession}) {
    const offers = catalogue || new WindowCatalogue(() => fetchWindowCatalogue(environment), readMarkDeclarations);
    const subscriptions = new WindowSubscriptions();
    const shellLine = shellReader(environment);
    const prompts = new AllowancePrompts(shellLine);
    const buttons = startButtons(environment, prompts);
    const listeners = [];
    const stop = events(environment, async (event) => {
        await Promise.all([offers.heard(event), buttons.heard(event).catch(() => {})]);
        listeners.forEach((listener) => listener(event));
        subscriptions.dispatch(event);
    });
    const face = shallowRef(null);
    const opened = session().then((answer) => {
        face.value = answer.type;
        document.documentElement.classList.toggle("phone", answer.type === "phone");
        if (answer.type === "phone") navigator.serviceWorker?.register(PHONE_WORKER, {scope: "/"}).catch(() => {});
        return answer;
    });
    const problem = shallowRef("");
    shellLine(["suite", "current", environment]).then((answer) => {
        if (!answer.ok && answer.failure !== "refused") problem.value = answer.error;
    });
    offers.load();
    return {catalogue: offers, subscriptions, shellLine, prompts, listeners, stop, face, opened, problem};
}
