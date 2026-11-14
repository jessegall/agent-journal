import {expect, test, afterEach} from "vitest";
import {createApp, h} from "vue";
import {settled} from "./settled.js";
import ShareFace from "../src/windows/ShareFace.vue";
import ShareRows from "../../core/modules/sharing/web/src/ShareRows.vue";
import {shareAddress} from "../src/route.js";
import {context, mounted, page, settle} from "./support/windowContext.js";

const SHARE_KEYS = {shares: {line: "share list", events: ["share_link.*", "share_comment.*"]}, tunnel: {line: "tunnel status", loading: "requested"}, opens: {line: "share opens", loading: "requested"}};

afterEach(() => window.history.pushState({}, "", "?"));

test("a row's Share goes to the Shares window with the row filled in", () => {
    const address = new URL(shareAddress("docs:5", "http://here/viewer/?environment=main&page=documents.documents#?open=docs:5"));
    expect(address.searchParams.get("page")).toBe("sharing.shares");
    expect(address.searchParams.get("share")).toBe("docs:5");
    expect(address.searchParams.get("environment")).toBe("main");
    expect(address.hash).toBe("");
});

test("the Shares window takes the row its address names and says what it opens", async () => {
    window.history.pushState({}, "", "?page=sharing.shares&share=docs:5");
    const held = context({"share list": page([]), "tunnel status": {ok: true, value: null}, "share opens": {ok: true, value: {rows: [{id: 0, line: "Doc 5, The cart rules"}]}}}, null, SHARE_KEYS);
    const element = await mounted(ShareRows, held);
    await settle();
    expect(element.querySelector(".shares-target").value).toBe("docs:5");
    expect(held.reads).toContain("share opens --target docs:5");
    expect(element.querySelector("[data-share-opens]").textContent).toContain("The cart rules");
});

test("a link and a request name what they open and when they end in plain words", async () => {
    const rows = [
        {id: 1, state: "active", row_model: "doc", row_id: 12, expires_at: "2026-11-06T12:00:00+00:00", view_count: 1, locked: false, comments: false},
        {id: 2, state: "waiting", row_model: "report", row_id: 4, expires_at: null, view_count: 0, locked: false, comments: false},
    ];
    const held = context({"share list": page(rows), "tunnel status": {ok: true, value: null}, "share opens": {ok: true, value: {rows: []}}}, null, SHARE_KEYS);
    const element = await mounted(ShareRows, held);
    await settle();
    const open = element.querySelector(".shares-open .shares-name");
    const waiting = element.querySelector("[data-share-waiting] .shares-name");
    expect(open.textContent).toContain("Document 12, ends ");
    expect(open.textContent).not.toContain("2026-11-06T12:00");
    expect(waiting.textContent).toContain("share Report 4, never ends");
});

test("a shared document shows its visitor its title, abstract and text", async () => {
    const element = document.createElement("div");
    const session = {share: {row_model: "doc", row_id: 5, environment: "main", ends_at: null, comments: false, window: {name: "documents.documents"}}};
    const read = async () => ({ok: true, value: {title: "The cart rules", abstract: "How the cart counts", body: "Totals are in cents"}});
    createApp(() => h(ShareFace, {session, read, subscriptions: {}})).mount(element);
    await settled();
    const text = element.querySelector("[data-share-text]").textContent;
    expect(text).toContain("The cart rules");
    expect(text).toContain("How the cart counts");
    expect(text).toContain("Totals are in cents");
    expect(element.querySelector("[data-share-body]")).toBeNull();
});
