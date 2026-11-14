import {h, ref} from "vue";
import {expect, test, vi} from "vitest";
import Transcript from "../../core/modules/agents/web/src/transcript.js";
import {context, mounted, page, settle, typeInto} from "./support/windowContext.js";

const keys = {"transcript.*": {line: "agent transcript {id}", events: []}};
const transcript = (answers) => context(answers, 73, keys);

test("the standalone transcript reads the selected agent through its named key", async () => {
    const held = transcript({"agent transcript 73": page([{id: 1, author: "assistant", text: "The check passed"}])});
    const readKeys = held.readKeys;
    held.readKeys = vi.fn(function (request) { return readKeys.call(this, request); });
    const element = await mounted(Transcript, held);
    expect(element.textContent).toContain("The check passed");
    expect(held.reads).toEqual(["agent transcript 73"]);
    expect(held.readKeys.mock.calls.some(([request]) => request.only.includes("transcript.73"))).toBe(true);
    expect(held.readKeys.mock.calls.some(([request]) => request.only.includes("transcript.*"))).toBe(false);
});

test("a transcript event reloads its key and removing the tab stops its subscription", async () => {
    const visible = ref(true);
    const answer = page([{id: 1, author: "user", text: "Check the cart"}]);
    const held = transcript({"agent transcript 73": answer});
    const callbacks = new Set();
    held.follow = (patterns, callback) => {
        callbacks.add(callback);
        return () => callbacks.delete(callback);
    };
    const element = await mounted({render: () => visible.value ? h(Transcript) : null}, held);
    answer.value.rows = [...answer.value.rows, {id: 2, author: "assistant", text: "Checked the cart"}];
    await Promise.all([...callbacks].map((callback) => callback({event: "hook_call.create"})));
    await settle();
    expect(element.textContent).toContain("Checked the cart");
    expect(held.reads).toEqual(["agent transcript 73", "agent transcript 73"]);
    visible.value = false;
    await settle();
    expect(callbacks.size).toBe(0);
});

test("a refused message keeps the transcript draft and names the selected target", async () => {
    const held = transcript({"agent transcript 73": page([])});
    held.run = vi.fn(async () => ({ok: false, error: "The agent was retired"}));
    const element = await mounted(Transcript, held);
    const input = element.querySelector("textarea");
    typeInto(input, "Continue the check");
    await settle();
    input.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
    await settle();
    expect(held.run).toHaveBeenCalledExactlyOnceWith(["message", "send", "Continue the check", "--target-agent", "row:73"]);
    expect(input.value).toBe("Continue the check");
    expect(element.querySelector('[role="alert"]').textContent).toBe("The agent was retired");
});
