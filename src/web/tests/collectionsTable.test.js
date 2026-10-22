import {expect, test} from "vitest";
import {label, meta, tables} from "../src/domain/tables.js";

test("collections are listed in the sidebar as cards, each saying what belongs in it", () => {
    const collections = meta("collections");
    expect([collections.title, collections.icon, collections.in_sidebar, collections.listed_as_cards]).toEqual(["Collection", "folder", true, true]);
    expect(label("collections", "abstract", "")).toBe("What belongs in it");
    expect(tables.value.some((table) => table.name === "collections")).toBe(true);
});

test("a collection's panel lists its members under In this collection", async () => {
    const {createApp, h} = await import("vue");
    const {flush} = await import("./flush.js");
    const {default: Links} = await import("../src/resource/Links.vue");
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(Links, {resource: {table: "collections", id: 1, members: ["docs:1", "tasks:2"]}})});
    app.mount(host);
    await flush();
    expect(host.textContent).toContain("In this collection");
    expect(host.textContent).toContain("Document 1");
    expect(host.textContent).toContain("Task 2");
    app.unmount();
});
