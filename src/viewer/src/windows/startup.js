import {shallowRef} from "vue";
import {readMarkDeclarations} from "../domain/markRegistry.js";
import {AllowancePrompts} from "./allowancePrompts.js";
import {lineResult} from "./windowContext.js";
import {WindowCatalogue, fetchWindowCatalogue, followEvents} from "./windowCatalogue.js";
import {WindowSubscriptions} from "./windowSubscriptions.js";

const SHELL_WINDOW = "viewer.shell";

// a page's reads and runs through the shell's own window
export const shellReader = (environment) => (line) => lineResult(SHELL_WINDOW, line, environment);

// who the cookie acts for, as GET /api/session answers it: its type (person, phone or share) and the person
export const readSession = async () => (await fetch("/api/session")).json();

// what a page of windows needs to run: the catalogue, the shared subscriptions, the shell's own line and allowance
// prompts, the face its session asks for once `opened` answers, and the environment's event stream, which feeds the catalogue, any
// `listeners` given later, and the windows; `stop` ends the stream
export function startWindows({environment, catalogue = null, events = followEvents, session = readSession}) {
    const offers = catalogue || new WindowCatalogue(() => fetchWindowCatalogue(environment), readMarkDeclarations);
    const subscriptions = new WindowSubscriptions();
    const shellLine = shellReader(environment);
    const prompts = new AllowancePrompts(shellLine);
    const listeners = [];
    const stop = events(environment, async (event) => {
        await offers.heard(event);
        listeners.forEach((listener) => listener(event));
        subscriptions.dispatch(event);
    });
    const face = shallowRef(null);
    const opened = session().then((answer) => {
        face.value = answer.type;
        document.documentElement.classList.toggle("phone", answer.type === "phone");
        return answer;
    });
    offers.load();
    return {catalogue: offers, subscriptions, shellLine, prompts, listeners, stop, face, opened};
}
