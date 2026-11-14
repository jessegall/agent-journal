import {transport} from "../api/transport.js";
import {computed, shallowRef} from "vue";
import {readMarkDeclarations} from "../domain/markRegistry.js";
import {loadStates} from "@journal/window-kit";
import {startButtons} from "@journal/window-kit";
import {AllowancePrompts} from "./allowancePrompts.js";
import {lineResult} from "./windowContext.js";
import {WindowCatalogue, fetchWindowCatalogue, followEvents} from "./windowCatalogue.js";
import {WindowSubscriptions} from "./windowSubscriptions.js";
import {SHELL_WINDOW} from "./shellWindow.js";

const PHONE_WORKER = "/viewer/phone-sw.js";

// a page's reads and runs through the shell's own window
export const shellReader = (environment) => (line) => lineResult(SHELL_WINDOW, line, environment);

// who the cookie acts for, as GET /api/session answers it: its type (person, phone or share) and the user; the page start and the
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
    loadStates();
    const listeners = [];
    const patterns = computed(() => ["registry.sync", "setting.*", "viewer_layout.*", ...subscriptions.patterns]);
    const stop = events(environment, async (event) => {
        await Promise.all([offers.heard(event), buttons.heard(event).catch(() => {})]);
        listeners.forEach((listener) => listener(event));
        subscriptions.dispatch(event);
    }, patterns);
    const face = shallowRef(null);
    const journalVersion = shallowRef("");
    const opened = session().then((answer) => {
        face.value = answer.type;
        journalVersion.value = answer.journal_version;
        document.documentElement.classList.toggle("phone", answer.type === "phone");
        if (answer.type === "phone") navigator.serviceWorker?.register(PHONE_WORKER, {scope: "/"}).catch(() => {});
        return answer;
    });
    const problem = shallowRef("");
    shellLine(["suite", "current", environment]).then((answer) => {
        if (!answer.ok && answer.failure !== "refused") problem.value = answer.error;
    });
    offers.load();
    return {catalogue: offers, subscriptions, shellLine, prompts, listeners, stop, face, journalVersion, opened, problem};
}
