import {transport} from "../src/api/transport.js";
import {loadDemo} from "./data.js";
import {STAND_IN, StandIn} from "./standIn.js";
import {QuietStream} from "./stream.js";
import {Player} from "./player.js";
import {noticeReplay} from "./hint.js";
import {lockReplay} from "./lock.js";
import {forgetEarlierBuilds} from "./storage.js";
import {framedAsPhone, onAPhone, phoneAddress} from "./view.js";
import LessonGrid from "./LessonGrid.vue";
import PhoneFrame from "./PhoneFrame.vue";
import {picked} from "./scenarios.js";

const CLOSED = ["hub", "plugins", "page", "file", "files", "commit"];

function keepOut() {
    const [env = "", page = ""] = location.hash.replace(/^#\/?/, "").split("?")[0].split("/");
    if (CLOSED.includes(page)) location.replace(`#/${env}`);
}

export async function install() {
    if (!picked) return {root: LessonGrid};
    if (onAPhone()) {
        location.replace(phoneAddress());
        return new Promise(() => {});
    }
    if (framedAsPhone()) return {root: PhoneFrame};
    forgetEarlierBuilds();
    const standIn = new StandIn(await loadDemo());
    standIn.player = new Player(standIn);
    globalThis.demo = standIn;
    noticeReplay();
    lockReplay(standIn);
    transport.reach = async (method, url, body) => standIn.answer(method, url, body);
    globalThis.EventSource = QuietStream;
    keepOut();
    window.addEventListener("hashchange", keepOut);
    document.title = standIn.moment.manifest.project;
    return {given: new Map([[STAND_IN, standIn]])};
}
