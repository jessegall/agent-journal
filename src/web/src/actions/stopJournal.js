import {api} from "../api/client.js";

const CLOSE_WAIT_MS = 300;

export const STOPPED_TEXT = "The journal is stopped. Close this tab, and start the journal again from the terminal when you want it back.";

function showStopped() {
    const note = document.createElement("p");
    note.textContent = STOPPED_TEXT;
    note.style.cssText = "margin:20vh auto;max-width:28em;padding:0 16px;font:16px/1.5 system-ui,sans-serif;text-align:center;color:var(--text,#444)";
    document.body.replaceChildren(note);
}

export async function stopJournal() {
    await api.stop();
    window.close();
    setTimeout(showStopped, CLOSE_WAIT_MS);
}
