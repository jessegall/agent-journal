import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import LoginLink from "../src/shell/LoginLink.vue";

const answer = {ok: true, body: {link: "http://127.0.0.1:4100/?key=abc"}};
vi.mock("../src/api/transport.js", () => ({transport: {raw: vi.fn(async () => ({ok: answer.ok, json: async () => answer.body}))}}));

afterEach(() => { document.body.innerHTML = ""; });

async function opened() {
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(LoginLink)).mount(element);
    await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
}

test("the dialog shows the full login link and copies it", async () => {
    answer.ok = true;
    answer.body = {link: "http://127.0.0.1:4100/?key=abc"};
    const copied = [];
    Object.defineProperty(navigator, "clipboard", {value: {writeText: async (text) => copied.push(text)}, configurable: true});
    await opened();
    expect(document.querySelector("[data-login-address]").value).toBe("http://127.0.0.1:4100/?key=abc");
    document.querySelector("[data-login-copy]").click();
    await nextTick();
    expect(copied).toEqual(["http://127.0.0.1:4100/?key=abc"]);
});

test("a session the server refuses sees the reason and no link", async () => {
    answer.ok = false;
    answer.body = {error: "only a user's own viewer can log in another browser"};
    await opened();
    expect(document.querySelector("[data-login-failure]").textContent).toContain("only a user");
    expect(document.querySelector("[data-login-address]")).toBeNull();
});
