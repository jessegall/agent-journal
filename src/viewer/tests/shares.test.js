import {afterEach, expect, test, vi} from "vitest";
import ShareRows from "../../core/modules/sharing/web/src/ShareRows.vue";
import ShareComments from "../src/windows/ShareComments.vue";
import {context, mounted, page, settle} from "./support/windowContext.js";

afterEach(() => vi.unstubAllGlobals());

const WAITING = {id: 1, state: "waiting", row_model: "plan", row_id: 2, expires_at: null, locked: true, comments: true, view_count: 0};
const OPEN = {id: 2, state: "active", row_model: "plan", row_id: 3, expires_at: "2026-11-08", locked: false, comments: true, view_count: 1};
const SECOND = {...OPEN, id: 3};

function window(rows = [WAITING, OPEN, SECOND], tunnel = "https://cart.tunler.example") {
    const answers = {
        "share list": page(rows),
    };
    const held = {...context(answers), lines: []};
    held.read = async (line) => {
        if (!Array.isArray(line)) return answers[line] ?? {ok: false, error: `no answer for ${line}`};
        if (line[1] === "status") return {ok: true, value: {address: tunnel}};
        if (line[1] === "opens") return {ok: true, value: {rows: [{id: 0, line: "Plan 2, Cart"}, {id: 1, line: "3 phases"}]}};
        return {ok: true, value: {rows: [{id: 9, visitor_name: "Bo", text: "Nice plan"}]}};
    };
    held.run = async (line) => (held.lines.push(line), {ok: true, value: {link: "/viewer/share/abc", expires_at: null}});
    return held;
}

test("a new link names its options and gives the full address through the tunnel", async () => {
    const held = window();
    const element = await mounted(ShareRows, held);
    const target = element.querySelector(".shares-target");
    target.value = "plans:2";
    target.dispatchEvent(new Event("input"));
    target.dispatchEvent(new Event("change"));
    await settle();
    expect(element.querySelector("[data-share-opens]").textContent).toContain("3 phases");
    const password = element.querySelector(".shares-password");
    password.value = "open-sesame";
    password.dispatchEvent(new Event("input"));
    await settle();
    expect(element.textContent).toContain("Visitors enter any name and this password.");
    element.querySelector("[data-share-form]").dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    expect(held.lines[0]).toEqual(["share", "make", "plans:2", "--ends", "7d", "--password=open-sesame"]);
    expect(element.querySelector("[data-share-address]").textContent).toBe("https://cart.tunler.example/viewer/share/abc");
    expect(element.querySelector("[data-share-inside]")).toBeNull();
});

test("with no tunnel the address says it works only here", async () => {
    const held = window([WAITING], "");
    const element = await mounted(ShareRows, held);
    element.querySelector("[data-share-accept]").click();
    await settle();
    expect(element.querySelector("[data-share-address]").textContent).toContain("/viewer/share/abc");
    expect(element.querySelector("[data-share-inside]")).not.toBeNull();
});

test("a link an agent asks for can be accepted or denied, and says what it holds", async () => {
    const held = window();
    const element = await mounted(ShareRows, held);
    const row = element.querySelector("[data-share-waiting]");
    expect(row.textContent).toContain("An agent asks to share plan 2, never ends, with a password, with comments");
    row.querySelector("[data-share-deny]").click();
    await settle();
    expect(held.lines).toEqual([["share", "deny", "1"]]);
});

test("an open link shows its views and comments and stops, and every share stops after asking", async () => {
    const held = window();
    const element = await mounted(ShareRows, held);
    expect(element.querySelector('[data-share-row="2"]').textContent).toContain("1 view");
    element.querySelector('[data-share-row="2"] [data-share-comments-open]').click();
    await settle();
    expect(element.querySelector("[data-share-comment]").textContent).toContain("Nice plan");
    element.querySelector("[data-share-stop-every]").click();
    await settle();
    expect(held.lines).toEqual([]);
    element.querySelector("[data-share-stop-every-confirm]").click();
    await settle();
    expect(held.lines).toEqual([["share", "revoke", "2"], ["share", "revoke", "3"]]);
});

test("a visitor reads and writes comments and a refusal says why", async () => {
    const sent = [];
    vi.stubGlobal("fetch", async (url, options) => {
        const comment = options?.body ? JSON.parse(options.body) : null;
        const refused = comment !== null && !comment.name.trim();
        if (comment && !refused) sent.push(comment);
        return {ok: !refused, json: async () => (refused ? {error: "no name"} : {rows: [{id: 1, visitor_name: "Bo", text: "Nice plan"}]})};
    });
    const {createApp} = await import("vue");
    const host = document.createElement("div");
    createApp(ShareComments).mount(host);
    await settle();
    expect(host.querySelector("[data-share-comment]").textContent).toContain("Nice plan");
    const [name, text] = [host.querySelector("input"), host.querySelector("textarea")];
    name.value = "Bo";
    name.dispatchEvent(new Event("input"));
    text.value = "Good";
    text.dispatchEvent(new Event("input"));
    await settle();
    host.querySelector("[data-share-comment-form]").dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    expect(sent).toEqual([{name: "Bo", text: "Good"}]);
    expect(text.value).toBe("");
    name.value = " ";
    name.dispatchEvent(new Event("input"));
    text.value = "Again";
    text.dispatchEvent(new Event("input"));
    await settle();
    host.querySelector("[data-share-comment-form]").dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    expect(host.textContent).toContain("no name");
    expect(sent.length).toBe(1);
});
