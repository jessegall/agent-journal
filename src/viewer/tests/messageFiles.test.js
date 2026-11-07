import {createApp, h} from "vue";
import {expect, test} from "vitest";
import MessageCard from "../kit/MessageCard.vue";

function shown(message) {
    const element = document.createElement("div");
    const app = createApp({render: () => h(MessageCard, {message})});
    app.mount(element);
    const html = element.innerHTML;
    app.unmount();
    return html;
}

const message = {id: 4, type: "user", text: "see this", created_at: "2026-11-01T05:00:00+00:00"};

test("an image of a message is shown from its file address and another file as a link", () => {
    const html = shown({...message, files: ["cart.png", "notes.txt"]});
    expect(html).toContain('src="/api/files/message/4/cart.png"');
    expect(html).toContain('href="/api/files/message/4/notes.txt"');
});

test("a message without files shows none", () => {
    expect(shown({...message, files: []})).not.toContain("data-message-files");
});
