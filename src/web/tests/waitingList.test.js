import {expect, test} from "vitest";
import {createApp, h} from "vue";
import {settle} from "./settle.js";

test("the waiting popup's last line is the time waited alone, with no kind beside it", async () => {
    const {default: WaitingList} = await import("../src/kit/WaitingList.vue");
    const host = document.createElement("div");
    document.body.append(host);
    const waiting = {items: [{label: "pytest -q", kind: "output", status: "", where: "", out: "1m 49s"}]};
    const app = createApp({render: () => h(WaitingList, {waiting})});
    app.mount(host);
    await settle();
    expect(host.querySelector(".waiting-meta").textContent.trim()).toBe("1m 49s");
    app.unmount();
    host.remove();
});
