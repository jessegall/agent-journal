import {loadDemo} from "./data.js";
import {Player} from "./player.js";
import {StandIn} from "./standIn.js";
import {noticeReplay} from "./hint.js";
import {forgetEarlierBuilds, keep} from "./storage.js";
import {insideFrame} from "./view.js";
import {createApp} from "vue";
import LessonGrid from "./LessonGrid.vue";
import PhoneBand from "./PhoneBand.vue";
import {picked} from "./scenarios.js";

const NOTIFY_SKIPPED = "phone-notify-skipped";

const asked = (url) => typeof url === "string" && url.startsWith("./") && !url.startsWith("./assets");

export async function install() {
    if (!picked) return LessonGrid;
    forgetEarlierBuilds();
    keep(NOTIFY_SKIPPED, "1");
    const standIn = new StandIn(await loadDemo());
    standIn.player = new Player(standIn);
    standIn.player.stepped = () => document.dispatchEvent(new Event("visibilitychange"));
    globalThis.demo = standIn;
    noticeReplay();
    if (!insideFrame()) {
        const band = document.createElement("div");
        document.body.prepend(band);
        createApp(PhoneBand).mount(band);
    }
    const reached = window.fetch.bind(window);
    window.fetch = async (url, given = {}) =>
        asked(url) ? standIn.phoneAnswer(given.method || "GET", url, given.body && JSON.parse(given.body)) : reached(url, given);
}
