import {phone} from "../api/phone.js";
import {announce} from "./announce.js";
import {offerUndo} from "../state/suggestionScreen.js";
import {runsOff} from "./runs.js";

export function phoneActs(open, refresh) {
    const act = async (n, kind, how) => {
        const made = await phone.suggestion(n, kind, how);
        refresh();
        return made;
    };
    return {
        complete: (n, how) => act(n, "complete", how),
        install: (n) => act(n, "install"),
        installBlocked: () => runsOff.value,
        noteWindow: (n) => act(n, "note_window"),
        offerUndo: (n) => offerUndo(n, (one) => act(one, "reopen")),
        speak: announce,
        open,
    };
}
