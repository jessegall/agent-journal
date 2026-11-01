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
