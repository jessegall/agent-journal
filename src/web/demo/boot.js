import {transport} from "../src/api/transport.js";
import {loadDemo} from "./data.js";
import {StandIn} from "./standIn.js";
import {QuietStream} from "./stream.js";

const CLOSED = ["hub", "plugins", "page", "file", "files", "commit"];

function keepOut() {
    const [env = "", page = ""] = location.hash.replace(/^#\/?/, "").split("?")[0].split("/");
    if (CLOSED.includes(page)) location.replace(`#/${env}`);
}

export async function install() {
    const standIn = new StandIn(await loadDemo());
    transport.reach = async (method, url, body) => standIn.answer(method, url, body);
    globalThis.EventSource = QuietStream;
    keepOut();
    window.addEventListener("hashchange", keepOut);
    document.title = standIn.demo.manifest.project;
}
