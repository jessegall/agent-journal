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
    test("grow from one to two as it is delivered, and turn read once the agent has read it", async () => {
        const sent = await ticked({seen: ["user"], data: {}});
        const delivered = await ticked({seen: ["user"], data: {delivered: true}});
        const read = await ticked({seen: ["user", "agent"], data: {delivered: true}});
        expect([sent, delivered, read].map((one) => [one.getAttribute("title"), one.querySelectorAll("path").length])).toEqual([
            ["Sent", 1],
            ["Delivered to the agent", 2],
            ["Read", 2],
        ]);
        expect([sent, delivered, read].map((one) => one.classList.contains("read"))).toEqual([false, false, true]);
    });

    test("stay a processed message's own colour once it is filed, and keep the read look on the phone's bubble", async () => {
        const filed = await ticked({seen: ["user", "agent"], completed: 1, data: {}});
        const read = await ticked({seen: ["user", "agent"], data: {}}, "bubble");
        expect([filed.getAttribute("title"), filed.classList.contains("read"), read.classList.contains("read"), read.classList.contains("bubble")]).toEqual(["Processed", false, true, true]);
    });
});
