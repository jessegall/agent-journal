import {h} from "vue";
import {afterEach, expect, test} from "vitest";
import {context, mounted} from "./support/windowContext.js";
import MarkBody from "../src/chat/MarkBody.vue";

afterEach(() => (document.body.innerHTML = ""));

const drawn = (mark) => mounted({render: () => h(MarkBody, {declaration: {}, mark, shown: true})}, context({}));

test("a mark that stopped short says why", async () => {
    const element = await drawn({id: 1, type: "tasks.task", variant: "blocked", detail: "needs the price list"});
    expect(element.textContent).toContain("Why it stopped");
    expect(element.querySelector("[data-mark-reason]").textContent).toBe("needs the price list");
});

test("a mark that did not stop shows no reason for its detail", async () => {
    const element = await drawn({id: 2, type: "tasks.task", variant: "started", detail: "in hand"});
    expect(element.textContent).not.toContain("Why it stopped");
});

test("a mark about a task opens that task and its proofs", async () => {
    const element = await drawn({id: 3, type: "tasks.task", variant: "made", target_model: "task", target_id: 12});
    expect(element.querySelector("[data-mark-task]").textContent.trim()).toBe("Open task 12 and its proofs");
});

test("a mark about something else offers no task", async () => {
    const element = await drawn({id: 4, type: "memories.memory", variant: "faded", target_model: "memory", target_id: 12});
    expect(element.querySelector("[data-mark-task]")).toBeNull();
});
