import {expect, test} from "vitest";
import {context, mounted, page, settle, typeInto} from "./support/windowContext.js";
import Chat from "../../core/modules/messages/web/src/Chat.vue";

const SOURCE = {id: 1, type: "peer", peer: "shop-e6", text: "Check the cart", created_at: "2026-11-02T10:00:00Z"};
const COMMENT = "Check the cart totals too";

test.each([true, false])("a pending comment uses one card and is removed after its answer, success=%s", async (success) => {
    const answers = {"message feed": page([SOURCE])};
    let answer;
    const response = new Promise((resolve) => (answer = resolve));
    const window_ = {...context(answers), run: () => response};
    const element = await mounted(Chat, window_);
    await expect.poll(() => element.querySelector("[data-growing-comment]")).not.toBeNull();
    element.querySelector("[data-growing-comment]").click();
    const input = element.querySelector(".composer-input");
    typeInto(input, COMMENT);
    await settle();
    element.querySelector("[data-send]").click();
    await settle();
    expect(element.querySelectorAll("[data-message]")).toHaveLength(1);
    expect(element.querySelectorAll("[data-message-comment]")).toHaveLength(1);
    if (success) answers["message feed"] = page([SOURCE, {id: 2, type: "comment", text: COMMENT, commented_row: "message:1", created_at: new Date().toISOString()}]);
    answer(success ? {ok: true, value: {}} : {ok: false, error: "The comment was refused"});
    await settle();
    expect(element.querySelectorAll("[data-message]")).toHaveLength(success ? 1 : 0);
    expect(element.querySelectorAll('[data-ref^="message:sending-"]')).toHaveLength(0);
    expect(element.querySelectorAll("[data-message-comment]")).toHaveLength(success ? 1 : 0);
    expect(input.value).toBe(success ? "" : COMMENT);
});

test("a sent message stays on screen until its saved copy has been read", async () => {
    const answers = {"message feed": page([SOURCE])};
    const plain = context(answers);
    let reading = false;
    let release = () => {};
    const read = (line) => (reading ? new Promise((resolve) => (release = () => resolve(plain.read(line)))) : plain.read(line));
    const element = await mounted(Chat, {...plain, read, run: async () => ({ok: true, value: {}})});
    await expect.poll(() => element.textContent).toContain(SOURCE.text);
    typeInto(element.querySelector(".composer-input"), "Hello there");
    await settle();
    reading = true;
    element.querySelector("[data-send]").click();
    await settle();
    expect(element.textContent).toContain("Hello there");
    answers["message feed"] = page([SOURCE, {id: 2, type: "user", text: "Hello there", created_at: "2026-11-02T10:01:00Z"}]);
    reading = false;
    release();
    await settle();
    expect(element.querySelectorAll('[data-ref^="message:sending-"]')).toHaveLength(0);
    expect(element.textContent).toContain("Hello there");
});
