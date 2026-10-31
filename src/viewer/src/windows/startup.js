import {readMarkDeclarations} from "../domain/markRegistry.js";
import {AllowancePrompts} from "./allowancePrompts.js";
import {lineResult} from "./windowContext.js";
import {WindowCatalogue, fetchWindowCatalogue, followEvents} from "./windowCatalogue.js";
import {WindowSubscriptions} from "./windowSubscriptions.js";

const SHELL_WINDOW = "viewer.shell";

// a page's reads and runs through the shell's own window
export const shellReader = (environment) => (line) => lineResult(SHELL_WINDOW, line, environment);

// what a page of windows needs to run: the catalogue, the shared subscriptions, the shell's own line and allowance
// prompts, and the environment's event stream, which feeds the catalogue, any `listeners` given later, and the
// windows; `stop` ends the stream
export function startWindows({environment, catalogue = null, events = followEvents}) {
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
    offers.load();
    return {catalogue: offers, subscriptions, shellLine, prompts, listeners, stop};
}
