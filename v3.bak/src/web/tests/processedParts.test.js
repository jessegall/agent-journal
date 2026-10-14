import {expect, test} from "vitest";
import {createApp, h} from "vue";
import PhoneTurn from "../src/phone/PhoneTurn.vue";

globalThis.ResizeObserver = class {
    observe() {}
    disconnect() {}
};

const message = (sections) => ({
    type: "message",
    n: 17288,
    who: "user",
    title: "File a to-do",
    brief: "File a to-do",
    refs: ["todo:3055"],
    sections,
    data: {via: "phone:1"},
});

function shown(item) {
    const host = document.createElement("div");
    createApp({render: () => h(PhoneTurn, {item})}).mount(host);
    return host.textContent;
}

test("a processed message shows its chip and not the part record behind it", () => {
    const text = shown(message([{title: "Open the to-do list", body: "todo:3055"}]));
    expect(text).not.toContain("todo:3055");
    expect(text).not.toContain("Open the to-do list");
    expect(text).toContain("Filed");
});

test("a section of real text stays", () => {
    const text = shown(message([{title: "Details", body: "Check the phone"}]));
    expect(text).toContain("Check the phone");
});
