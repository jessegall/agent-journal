import {createApp} from "vue";
import {choose} from "../state/environment.js";
import "./phone.css";
import PhoneNotify from "./PhoneNotify.vue";
import PhonePair from "./PhonePair.vue";

// The phone app is the viewer itself in a phone's shell: a paired phone opens it in the environment it was paired in;
// one not paired yet pairs first, by the code in the link it was opened from or the short code typed in.
async function start() {
    const answer = await fetch("./state", {credentials: "same-origin", cache: "no-store"}).catch(() => null);
    if (answer && answer.ok) {
        choose((await answer.json()).environment);
        await import("../main.js");
        createApp(PhoneNotify).mount("#phone-notify");
    } else {
        createApp(PhonePair).mount("#app");
    }
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js", {scope: "./"}).catch(() => {});
}

start();
