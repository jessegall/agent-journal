import {flush, hold} from "../outbox.js";

export async function askAgent(brief) {
    hold(brief, "");
    await flush();
}
