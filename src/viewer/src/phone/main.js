import {createApp} from "vue";
import {choose} from "../state/environment.js";
import "./phone.css";
import PhoneNotify from "./PhoneNotify.vue";
import PhonePair from "./PhonePair.vue";
import {transport} from "../api/transport.js";

// What the page says when it is opened from the viewer's own address, which does not serve the phone: no state to read.
export const ELSEWHERE = "This is the journal's phone app. Open it on your phone from the link or the code on the viewer's Phone page.";

// The phone app is the viewer itself in a phone's shell: a paired phone opens it in the environment it was paired in;
// one not paired yet pairs first, by the code in the link it was opened from or the short code typed in.
async function start() {
    const answer = await transport.raw("./state", {credentials: "same-origin", cache: "no-store"}).catch(() => null);
    if (answer && !(answer.headers.get("content-type") || "").includes("json")) {
        const note = document.createElement("p");
        note.className = "phone-elsewhere";
        note.textContent = ELSEWHERE;
        document.getElementById("app").append(note);
        return;
    }
    if (answer && answer.ok) {
        choose((await answer.json()).environment);
        await import("../main.js");
        createApp(PhoneNotify).mount("#phone-notify");
    } else {
        const refused = answer ? await answer.json().catch(() => ({})) : {};
        createApp(PhonePair, {pairedBefore: Boolean(refused.paired_before)}).mount("#app");
    }
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js", {scope: "./"}).catch(() => {});
}

start();
