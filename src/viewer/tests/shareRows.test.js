import {expect, test, afterEach} from "vitest";
import {createApp, h} from "vue";
import {settled} from "./settled.js";
import ShareFace from "../src/windows/ShareFace.vue";
import ShareRows from "../../core/modules/sharing/web/src/ShareRows.vue";
import {shareAddress} from "../src/route.js";
import {context, mounted, page, settle} from "./support/windowContext.js";

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
    const held = {...context({"share list": page([])})};
    const lines = [];
    const reading = held.read;
    held.read = async (line) => (lines.push(line), Array.isArray(line) && line[1] === "opens" ? {ok: true, value: {rows: [{id: 0, line: "Doc 5, The cart rules"}]}} : reading(line));
    const element = await mounted(ShareRows, held);
    await settle();
    expect(element.querySelector(".shares-target").value).toBe("docs:5");
    expect(lines).toContainEqual(["share", "opens", "docs:5"]);
    expect(element.querySelector("[data-share-opens]").textContent).toContain("The cart rules");
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
