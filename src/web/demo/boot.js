import {transport} from "../src/api/transport.js";
import {loadDemo} from "./data.js";
import {StandIn} from "./standIn.js";
import {QuietStream} from "./stream.js";
import {Player} from "./player.js";
import {hintOnTyping} from "./hint.js";
import {forgetEarlierBuilds} from "./storage.js";
import {framedAsPhone, onAPhone, phoneAddress} from "./view.js";
import PhoneFrame from "./PhoneFrame.vue";

const CLOSED = ["hub", "plugins", "page", "file", "files", "commit"];

function keepOut() {
    const [env = "", page = ""] = location.hash.replace(/^#\/?/, "").split("?")[0].split("/");
    if (CLOSED.includes(page)) location.replace(`#/${env}`);
}

export async function install() {
    if (onAPhone()) {
        location.replace(phoneAddress());
        return new Promise(() => {});
    }
    if (framedAsPhone()) return PhoneFrame;
    forgetEarlierBuilds();
    const standIn = new StandIn(await loadDemo());
    standIn.player = new Player(standIn);
    globalThis.demo = standIn;
    hintOnTyping();
    transport.reach = async (method, url, body) => standIn.answer(method, url, body);
    globalThis.EventSource = QuietStream;
    keepOut();
    window.addEventListener("hashchange", keepOut);
    document.title = standIn.moment.manifest.project;
}
