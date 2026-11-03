import {createApp, h} from "vue";
import {expect, test} from "vitest";
import MessageCard from "../kit/MessageCard.vue";

const message = {id: 100130, type: "agent", text: "Done", created_at: "2026-11-01T05:00:00+00:00"};

function foot(row) {
    const element = document.createElement("div");
    const app = createApp({render: () => h(MessageCard, {message: row})});
    app.mount(element);
    const text = element.querySelector(".message-foot").textContent;
    app.unmount();
    return text;
}

test("a message shows its id next to the time under the bubble", () => {
    expect(foot(message)).toMatch(/\d:\d\d.*message 100130/);
});

test("a message still being sent has no id yet and shows none", () => {
    expect(foot({...message, id: "sending-1", local: true})).not.toContain("message sending-1");
});
