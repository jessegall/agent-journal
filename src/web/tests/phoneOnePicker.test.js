import {createApp, nextTick} from "vue";
import {expect, test} from "vitest";
import PhoneHomeBar from "../src/phone/PhoneHomeBar.vue";

function mountBar(feed) {
    const host = document.createElement("div");
    const emitted = [];
    createApp(PhoneHomeBar, {
        connection: {project: "agent-journal", environment: "main"},
        feed,
        current: true,
        go: {},
        onPlaces: () => emitted.push("places"),
    }).mount(host);
    return {host, emitted};
}

test("the phone's top bar has one picker that names the journal, the environment and the agent", async () => {
    const {host, emitted} = mountBar({agent: "idle", running: {}, waiting: []});
    await nextTick();
    const pickers = host.querySelectorAll(".top-btn");
    expect(pickers).toHaveLength(1);
    expect(pickers[0].textContent).toContain("main");
    expect(pickers[0].textContent).toContain("Idle");
    expect(pickers[0].getAttribute("aria-label")).toBe(
        "Journal agent-journal, environment main, agent Idle. Switch journal or environment, or open the agent",
    );
    pickers[0].click();
    expect(emitted).toEqual(["places"]);
});
