import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test} from "vitest";
import MessageCard from "../kit/MessageCard.vue";
import {reactionGroups} from "../src/domain/reactionGroups.js";
import {linkPage} from "./support/linkPages.js";

afterEach(() => (document.body.innerHTML = ""));

const AGENT_THUMB = {emoji: "👍", actor_id: 7, actor_type: "agent"};
const USER_THUMB = {emoji: "👍", actor_id: 3, actor_type: "user"};
const USER_PARTY = {emoji: "🎉", actor_id: 3, actor_type: "user"};

function drawn(reactions) {
    const faces = [];
    const element = document.createElement("div");
    const message = {id: 4, type: "agent", text: "Done", files: [], captions: "{}", created_at: "2026-11-01T10:00:00Z", reactions: JSON.stringify(reactions)};
    createApp({render: () => h(MessageCard, {message, onReact: (_, face) => faces.push(face)})}).mount(element);
    return {element, faces};
}

test("reactions group by face with a count, whether they are the user's and who put them on", () => {
    expect(reactionGroups(JSON.stringify([AGENT_THUMB, USER_THUMB, USER_PARTY]))).toEqual([
        {emoji: "👍", count: 2, mine: true, title: "The agent and You"},
        {emoji: "🎉", count: 1, mine: true, title: "You"},
    ]);
    expect(reactionGroups("[]")).toEqual([]);
});

test("a card shows its faces and pressing one toggles it", async () => {
    const {element, faces} = drawn([AGENT_THUMB, USER_THUMB]);
    const face = element.querySelector("[data-reaction]");
    expect(face.textContent).toContain("👍");
    expect(face.textContent).toContain("2");
    expect(face.classList.contains("mine")).toBe(true);
    face.click();
    expect(faces).toEqual(["👍"]);
});

test("React opens the faces, and picking one reacts and closes them", async () => {
    const {element, faces} = drawn([]);
    expect(element.querySelector("[data-message-reactions]")).toBeNull();
    element.querySelector('[data-message-action="react"]').click();
    await nextTick();
    [...element.querySelectorAll("[data-face]")].find((button) => button.textContent === "🎉").click();
    await nextTick();
    expect(faces).toEqual(["🎉"]);
    expect(element.querySelector("[data-message-faces]")).toBeNull();
});

test("picking a reaction replaces the buttons with a bar, and cancel brings them back", async () => {
    const element = document.createElement("div");
    createApp({render: () => h(MessageCard, {message: {id: 1, type: "agent", text: "hi", reactions: "[]", created_at: "2026-11-02T10:00:00Z"}})}).mount(element);
    element.querySelector('[data-message-action="react"]').click();
    await nextTick();
    expect(element.querySelector("[data-message-tools] [data-message-faces]")).not.toBeNull();
    expect(element.querySelector('[data-message-action="reply"]')).toBeNull();
    element.querySelector('[data-message-action="cancel-react"]').click();
    await nextTick();
    expect(element.querySelector("[data-message-faces]")).toBeNull();
    expect(element.querySelector('[data-message-action="reply"]')).not.toBeNull();
});

test("a person's message shows the rows it linked, under it", async () => {
    const {WINDOW_CONTEXT} = await import("../kit/windowContextKey.js");
    const element = document.createElement("div");
    const app = createApp({render: () => h(MessageCard, {message: {id: 4, type: "user", text: "see report 1", reactions: "[]", created_at: "2026-11-02T10:00:00Z"}})});
    app.provide(WINDOW_CONTEXT, {environment: "main", read: async (line) => linkPage([{target_model: "report", target_id: 1, link_type: "about"}, {target_model: "plan", target_id: 2, link_type: "comments_on"}], line)});
    app.mount(element);
    await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
    expect(element.querySelector("[data-message-links]").textContent).toContain("report 1");
    const line = element.querySelector("[data-message-links-rows]");
    expect(line.textContent).toMatch(/^Linked: /);
    expect(line.textContent.match(/report 1/gi)).toHaveLength(1);
    expect(line.querySelector(".md.inline")).not.toBeNull();
    const foot = element.querySelector(".message-foot");
    expect(foot.compareDocumentPosition(element.querySelector("[data-message-links]")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(foot.querySelector(".message-dot").textContent).toBe("•");
});

test("four linked tasks group into a chip that opens a list with their titles", async () => {
    const {WINDOW_CONTEXT} = await import("../kit/windowContextKey.js");
    const element = document.createElement("div");
    document.body.append(element);
    const link = (id) => ({target_model: "task", target_id: id, target_title: `Title of ${id}`, link_type: "about"});
    const read = async (line) => linkPage([link(1), link(2), link(3), link(4)], line);
    const app = createApp({render: () => h(MessageCard, {message: {id: 4, type: "user", text: "see these", reactions: "[]", created_at: "2026-11-02T10:00:00Z"}})});
    app.provide(WINDOW_CONTEXT, {environment: "main", read});
    app.mount(element);
    await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
    const count = element.querySelector("[data-message-links-count]");
    expect(count.textContent).toContain("4 linked tasks");
    expect(element.querySelector(".message-links").classList.contains("many")).toBe(true);
    count.click();
    await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
    const list = element.querySelector("[data-message-links-list]");
    expect(list.querySelectorAll("button")).toHaveLength(4);
    expect(list.textContent).toContain("Title of 3");
    app.unmount();
    element.remove();
});

test("one linked task shows no group", async () => {
    const {WINDOW_CONTEXT} = await import("../kit/windowContextKey.js");
    const element = document.createElement("div");
    const app = createApp({render: () => h(MessageCard, {message: {id: 4, type: "user", text: "see it", reactions: "[]", created_at: "2026-11-02T10:00:00Z"}})});
    app.provide(WINDOW_CONTEXT, {environment: "main", read: async (line) => linkPage([{target_model: "task", target_id: 9, link_type: "about"}], line)});
    app.mount(element);
    await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
    expect(element.querySelector("[data-message-links-count]")).toBeNull();
    expect(element.querySelector("[data-message-links-rows]").textContent).toContain("task 9");
});
