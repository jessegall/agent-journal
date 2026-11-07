import {createApp, h} from "vue";
import {expect, test} from "vitest";
import MessageCard from "../kit/MessageCard.vue";

const user = {id: 1, type: "user", text: "Fix the cart", created_at: "2026-11-01T05:00:00+00:00"};

function shown(message) {
    const element = document.createElement("div");
    const app = createApp({render: () => h(MessageCard, {message})});
    app.mount(element);
    const ticks = element.querySelector(".ticks");
    app.unmount();
    return ticks;
}

test("a message of the user shows a sent tick, and a read one shows it read", () => {
    expect(shown(user).getAttribute("aria-label")).toBe("Sent");
    expect(shown({...user, read_at: "2026-11-01T05:01:00+00:00"}).getAttribute("aria-label")).toBe("Read");
});

test("a message of the agent shows no ticks", () => {
    expect(shown({...user, type: "agent"})).toBeNull();
});

test("a row named in a message is a link that opens it, and a reply links the message it answers", async () => {
    const element = document.createElement("div");
    const app = createApp({render: () => h(MessageCard, {message: {...user, text: "see task 5", parent_id: 9}})});
    app.mount(element);
    element.querySelector("[data-peek='tasks:5']").click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(location.hash).toContain("open=tasks:5");
    element.querySelector("[data-message-reply]").click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(location.hash).toContain("messages:9");
    app.unmount();
    location.hash = "";
});

test("a message offers reply and copy, and delete only while it is yours and unread", () => {
    const tools = (message) => {
        const element = document.createElement("div");
        createApp({render: () => h(MessageCard, {message})}).mount(element);
        return [...element.querySelectorAll("[data-message-action]")].map((button) => button.dataset.messageAction);
    };
    expect(tools(user)).toEqual(["react", "reply", "copy", "delete"]);
    expect(tools({...user, read_at: "2026-11-01T05:01:00+00:00"})).toEqual(["react", "reply", "copy"]);
    expect(tools({...user, type: "agent"})).toEqual(["react", "reply", "copy"]);
});
