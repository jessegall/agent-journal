import {createApp, h, nextTick} from "vue";
import {describe, expect, test} from "vitest";
import PresetList from "../src/kit/PresetList.vue";

async function shown() {
    const host = window.document.createElement("div");
    const presets = [{key: "saved-1", name: "Wide", text: "Three columns", cells: [], saved: true}];
    createApp({render: () => h(PresetList, {presets, savable: true, linkFor: async () => "link"})}).mount(host);
    await nextTick();
    return host;
}

describe("the presets menu of the agent bar", () => {
    test("has one share button, named for the layout it shares, and importing draws its own icon", async () => {
        const host = await shown();
        const sharers = host.querySelectorAll("button[title^='Share']");
        expect(sharers.length).toBe(1);
        expect(sharers[0].getAttribute("title")).toBe("Share Wide as a file or a link");
        const importer = [...host.querySelectorAll("button")].find((button) => button.textContent.includes("Import a layout"));
        expect(importer.querySelector("svg").innerHTML).not.toBe(sharers[0].querySelector("svg").innerHTML);
    });
});
