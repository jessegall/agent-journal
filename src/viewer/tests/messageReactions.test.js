import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test} from "vitest";
import MessageCard from "../kit/MessageCard.vue";
import {reactionGroups} from "../src/domain/reactionGroups.js";

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
