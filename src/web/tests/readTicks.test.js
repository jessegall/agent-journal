import {createApp, h, nextTick} from "vue";
import {describe, expect, test} from "vitest";
import ReadTicks from "../src/kit/ReadTicks.vue";

async function ticked(message, tone = "") {
    const host = window.document.createElement("div");
    createApp({render: () => h(ReadTicks, {message, tone})}).mount(host);
    await nextTick();
    return host.querySelector(".ticks");
}

describe("the ticks of a message", () => {
    test("grow from one to two and turn read once the agent has read it", async () => {
        const sent = await ticked({read_at: null, filed: []});
        const read = await ticked({read_at: "2026-10-19T10:00:00+00:00", filed: []});
        expect([sent, read].map((one) => [one.getAttribute("title"), one.querySelectorAll("path").length, one.classList.contains("read")])).toEqual([
            ["Sent", 1, false],
            ["Read", 2, true],
        ]);
    });

    test("stay a processed message's own colour once it is filed, and keep the read look on a bubble", async () => {
        const filed = await ticked({read_at: "2026-10-19T10:00:00+00:00", filed: [4]});
        const read = await ticked({read_at: "2026-10-19T10:00:00+00:00", filed: []}, "bubble");
        expect([filed.getAttribute("title"), filed.classList.contains("read"), read.classList.contains("read"), read.classList.contains("bubble")]).toEqual(["Processed", false, true, true]);
    });
});
