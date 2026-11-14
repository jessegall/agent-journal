import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import {updateWindowContext} from "./support/updateWindowContext.js";
import {labelsOf} from "./support/cardMenu.js";
import SearchWindow from "../../core/modules/search/web/src/SearchWindow.vue";
import TranscriptionRows from "../../core/modules/transcriptions/web/src/TranscriptionRows.vue";
import UpdatesPanel from "../../core/modules/updates/web/src/UpdatesPanel.vue";

beforeEach(() => vi.stubGlobal("ResizeObserver", class {observe() {} disconnect() {}}));
afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

test("test_search_layout: results are grouped by kind beside a reader with Open, and a right click has Open and a copy, never Duplicate or Delete", async () => {
    const answer = {hits: [{cli_name: "task", id: 7, excerpt: "Round the cart total"}, {cli_name: "doc", id: 2, excerpt: "How the cart counts money"}], total: 2};
    const window = context({"search find": {ok: true, value: answer}}, null, {results: {line: "search find {terms} --split-terms", loading: "requested"}});
    const element = await mounted(SearchWindow, window);
    document.body.append(element);
    element.querySelector("[data-search-input]").value = "cart";
    element.querySelector("[data-search-input]").dispatchEvent(new Event("input"));
    element.querySelector("[data-search-input]").dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true}));
    await settle();
    expect([...element.querySelectorAll(".list-reader-group")].map((group) => group.textContent)).toEqual(["Tasks", "Documents"]);
    element.querySelector('[data-row="doc:2"]').click();
    await settle();
    expect(element.querySelector("[data-search-reader]").textContent).toContain("How the cart counts money");
    expect(element.querySelector("[data-search-open]").textContent).toBe("Open");
    const labels = labelsOf(element.querySelector('[data-row="task:7"]'));
    expect(labels).toEqual(["Open", "Copy reference"]);
    expect(labels.join()).not.toMatch(/duplicate|delete|remove/i);
});

test("test_transcriptions_list: transcriptions are a list grouped by day with the text and Linked items in a reader, and no Duplicate or Delete in the menu", async () => {
    const today = new Date().toISOString();
    const rows = [{id: 4, title: "Cart meeting", text: "Ada: the cart rounds twice.", source: "", created_at: today}];
    const window = context({}, null, {transcriptions: {line: "transcription list", events: ["transcription.*"]}, sources: {line: "transcription sources"}, "links.*": {line: "link list --row transcription:{id} --group-counterparts", loading: "requested"}});
    window.read = async (line) => (String(Array.isArray(line) ? line.join(" ") : line).startsWith("transcription sources") ? {ok: true, value: {rows: []}} : {ok: true, value: {rows, counterparts: [], total: 0}});
    const element = await mounted(TranscriptionRows, window);
    document.body.append(element);
    await settle();
    expect([...element.querySelectorAll(".list-reader-group")].map((group) => group.textContent)).toEqual(["Today"]);
    expect(element.querySelector("[data-filter-bar]")).not.toBeNull();
    expect(labelsOf(element.querySelector('[data-row="4"]'))).toEqual(["Open", "Copy number", "Copy text"]);
    element.querySelector('[data-row="4"]').click();
    await settle();
    expect([...element.querySelectorAll("[data-inner-tabs] [data-tab]")].map((tab) => tab.textContent.trim())).toEqual(["Text", "Linked items"]);
    expect(element.querySelector("[data-transcription-opened] textarea").value).toBe("Ada: the cart rounds twice.");
});

test("test_updates_panel: the release notes and the installed releases are a list with a reader, the check and the install button stay above, and the menu has no Duplicate or Delete", async () => {
    const notes = {ok: true, value: {notes: [{tag: "v2", text: "A new thing", published_at: "2026-10-01T10:00:00Z"}], is_last_page: true}};
    const installed = page([{id: 1, tag: "v1", checksum: "abcdef1234567890", created_at: "2026-09-01T10:00:00Z"}]);
    const window = updateWindowContext({"release list": installed, "update check": {ok: true, value: {line: "A newer release v3 is out", tag: "v3", is_current: false}}, "update notes": notes});
    const element = await mounted(UpdatesPanel, window);
    document.body.append(element);
    await settle();
    expect([...element.querySelectorAll(".list-reader-group")].map((group) => group.textContent)).toEqual(["Release notes", "Installed here"]);
    expect(element.querySelector("[data-update-install]").textContent).toContain("Update to v3");
    expect(element.querySelector("[data-update-note]").textContent).toContain("A new thing");
    expect(labelsOf(element.querySelector('[data-row="installed-1"]'))).toEqual(["Open", "Copy name"]);
});
