import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import MessageCard from "../kit/MessageCard.vue";

const COMMENT = {id: 4, type: "comment", text: "Check the totals", created_at: "2026-11-01T05:00:00+00:00", commented_row: "task:7"};
let app;

afterEach(() => {
    app?.unmount();
    location.hash = "";
});

function drawn(message) {
    const element = document.createElement("div");
    app = createApp({render: () => h(MessageCard, {message})});
    app.mount(element);
    return element;
}

test("a comment on a row has a header naming the row, and a look of its own", () => {
    const element = drawn(COMMENT);
    expect(element.querySelector("[data-message-comment]").textContent.trim()).toBe("Comment on task 7");
    expect(element.querySelector(".message-card").classList.contains("comment")).toBe(true);
    expect(element.querySelector("[data-message]").dataset.from).toBe("user");
});

test("pressing the header opens the commented row", async () => {
    const element = drawn(COMMENT);
    element.querySelector("[data-message-comment]").click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(location.hash).toContain("open=tasks:7");
});

test("a plain message of the user has neither the header nor the comment look", () => {
    const element = drawn({...COMMENT, type: "user", commented_row: ""});
    expect(element.querySelector("[data-message-comment]")).toBeNull();
    expect(element.querySelector(".message-card").classList.contains("comment")).toBe(false);
});
