import {afterEach, expect, test, vi} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import TeamsPage from "../../core/modules/library/web/src/TeamsPage.vue";
import {diffRows} from "../../core/modules/library/web/src/copyDiff.js";

vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
});

const LINKED = {is_connected: true, address: "https://library.example.com:8740", is_encrypted: true, server_name: "Acme library", user_name: "Grace", role: "edit", reached_at: "2026-11-04T16:20:00+00:00", failure: "", stopped: ""};
const MINE = {title: "Release checklist", abstract: "What to do", body: "Tag first.\nBuild second."};
const THEIRS = {title: "Release checklist", abstract: "What to do", body: "Tag first.\nBuild after the tag."};

function copy(status, label, extra = {}) {
    return {copy_id: 7, share: "doc", row_id: 88, item_id: 12, version: 8, status, label, note: "", server_version: 0, local_fields: MINE, server_fields: {}, ...extra};
}

const STATUSES = [
    {copy: copy("synced", "In sync"), buttons: ["leave"], lines: []},
    {copy: copy("sending", "Sending"), buttons: [], lines: []},
    {copy: copy("unsent", "Waiting to send"), buttons: [], lines: []},
    {copy: copy("paused", "Waiting for its run to end"), buttons: [], lines: []},
    {copy: copy("denied", "Local change, not sent", {server_version: 9}), role: "read", buttons: ["compare", "library"], lines: ["Role: Read-only", "A newer version is in the library"]},
    {copy: copy("rejected", "Not accepted by the server", {note: "This text is over the size limit"}), buttons: ["compare"], lines: ["This text is over the size limit"]},
    {copy: copy("conflict", "Conflict", {server_version: 9, server_fields: THEIRS}), buttons: ["compare", "mine", "library"], lines: []},
    {copy: copy("review", "New version to read", {note: "The command of this check changed."}), buttons: ["read", "library", "leave"], lines: ["The command of this check changed."]},
    {copy: copy("removed", "Removed from the library"), buttons: ["leave"], lines: ["Your copy stays on this journal."]},
];

function window(rows, status = {}, extra = {}) {
    const result = context({
        "library status": {ok: true, value: {...LINKED, ...status}},
        "library list": {ok: true, value: {page: 1, size: 30, total: 2, rows: [
            {kind: "doc", id: 12, version: 8, title: "Release checklist", abstract: "What to do", excerpt: "", creator: "Ada", updated_by: "Grace", updated_at: "2026-11-04T16:20:00+00:00", copy_id: null},
            {kind: "check", id: 5, version: 2, title: "Cut a release", abstract: "", excerpt: "", creator: "Ada", updated_by: "Ada", updated_at: "2026-11-03T10:00:00+00:00", copy_id: null},
        ]}},
        "library copies": {ok: true, value: {rows}},
        "library show check 5": {ok: true, value: {kind: "check", id: 5, version: 2, fields: {title: "Cut a release", command: "make release"}, removed_at: ""}},
        "library show doc 12": {ok: true, value: {kind: "doc", id: 12, version: 8, fields: THEIRS, removed_at: ""}},
        ...extra,
    });
    result.lines = [];
    result.followed = [];
    result.follow = (patterns) => result.followed.push(patterns);
    result.run = async (line) => {
        result.lines.push(line);
        return {ok: true, value: {line: "done", warning: "", copy_id: 7}};
    };
    return result;
}

async function onThisJournal(rows, status = {}, extra = {}) {
    const result = window(rows, status, extra);
    const element = await mounted(TeamsPage, result);
    [...element.querySelectorAll("[data-teams-tabs] button")].find((button) => button.textContent.includes("On this journal")).click();
    await settle();
    return {result, element};
}

test("the tab names how many items follow the library", async () => {
    const element = await mounted(TeamsPage, window([copy("synced", "In sync"), copy("conflict", "Conflict", {copy_id: 8})]));
    const tab = [...element.querySelectorAll("[data-teams-tabs] button")].find((button) => button.textContent.includes("On this journal"));
    expect(tab.textContent.replace(/\s+/g, " ").trim()).toBe("On this journal 2");
});

for (const {copy: shown, buttons, lines, role = "edit"} of STATUSES) {
    test(`a copy with the status ${shown.status} shows its label, its extra lines and only its buttons`, async () => {
        const {element} = await onThisJournal([shown], {role});
        const row = element.querySelector("[data-library-copy]");
        expect(row.dataset.status).toBe(shown.status);
        expect(row.querySelector("[data-copy-facts]").textContent).toBe(`Status: ${shown.label}, Version: 8`);
        expect([...row.querySelectorAll("[data-copy-line]")].map((line) => line.textContent)).toEqual(lines);
        expect([...row.querySelectorAll("[data-copy-button]")].map((button) => button.dataset.copyButton)).toEqual(buttons);
    });
}

test("the buttons carry the words of the page", async () => {
    const {element} = await onThisJournal([STATUSES[6].copy]);
    expect([...element.querySelectorAll("[data-copy-button]")].map((button) => button.textContent.trim())).toEqual(["Compare", "Keep mine", "Use the library's version"]);
});

test("Keep mine, Use the library's version and Stop following run their lines", async () => {
    const {result, element} = await onThisJournal([STATUSES[6].copy, copy("synced", "In sync", {copy_id: 9, row_id: 90})]);
    element.querySelector('[data-library-copy="7"] [data-copy-button="mine"]').click();
    await settle();
    element.querySelector('[data-library-copy="7"] [data-copy-button="library"]').click();
    await settle();
    element.querySelector('[data-library-copy="9"] [data-copy-button="leave"]').click();
    await settle();
    expect(result.lines).toEqual([["library", "resolve", "7", "--keep", "mine"], ["library", "resolve", "7", "--keep", "library"], ["library", "leave", "9"]]);
});

test("Compare draws the text here against the stored library text with a diff card", async () => {
    const {element} = await onThisJournal([STATUSES[6].copy]);
    element.querySelector('[data-copy-button="compare"]').click();
    await settle();
    const panel = document.body.querySelector("[data-library-compare-panel]");
    expect(panel.querySelectorAll("[data-library-diff], .diff-card").length).toBe(1);
    expect(panel.textContent).toContain("Build second.");
    expect(panel.textContent).toContain("Build after the tag.");
    expect(panel.querySelector(".diff-row.del").textContent).toContain("Build second.");
    expect(panel.querySelector(".diff-row.add").textContent).toContain("Build after the tag.");
});

test("Compare of a copy with no stored library text reads the item live", async () => {
    const {result, element} = await onThisJournal([STATUSES[5].copy]);
    element.querySelector('[data-copy-button="compare"]').click();
    await settle();
    expect(result.reads).toContain("library show doc 12");
    expect(document.body.querySelector("[data-library-compare-panel]").textContent).toContain("Build after the tag.");
});

test("Read opens the same comparison for a new version", async () => {
    const {element} = await onThisJournal([copy("review", "New version to read", {note: "The steps of this sequence changed.", server_fields: THEIRS})]);
    element.querySelector('[data-copy-button="read"]').click();
    await settle();
    expect(document.body.querySelector("[data-library-compare-panel]").textContent).toContain("Build after the tag.");
});

test("two versions with the same text say so", async () => {
    const {element} = await onThisJournal([copy("conflict", "Conflict", {server_fields: MINE})]);
    element.querySelector('[data-copy-button="compare"]').click();
    await settle();
    expect(document.body.querySelector("[data-library-same]").textContent).toBe("The two versions have the same text.");
});

test("the Share with the team field is on this tab and not on the Library tab", async () => {
    const result = window([]);
    const element = await mounted(TeamsPage, result);
    expect(element.querySelector("[data-library-share]")).toBeNull();
    [...element.querySelectorAll("[data-teams-tabs] button")].find((button) => button.textContent.includes("On this journal")).click();
    await settle();
    expect(element.querySelector("[data-library-share]")).not.toBeNull();
    expect(element.querySelector("[data-library-no-copies]")).not.toBeNull();
});

test("Get makes an item of the library follow, and a check shows its command first", async () => {
    const result = window([]);
    const element = await mounted(TeamsPage, result);
    const rows = [...element.querySelectorAll("[data-library-item]")];
    rows[0].querySelector("[data-library-get]").click();
    await settle();
    expect(result.lines).toEqual([["library", "get", "doc", "12"]]);
    rows[1].querySelector("[data-library-get]").click();
    await settle();
    expect(result.lines.length).toBe(1);
    expect(element.querySelector("[data-library-command]").textContent).toBe("make release");
    element.querySelector("[data-library-confirm]").click();
    await settle();
    expect(result.lines[1]).toEqual(["library", "get", "check", "5", "--read"]);
});

test("Sync now runs one round and reads the page again", async () => {
    const result = window([]);
    const element = await mounted(TeamsPage, result);
    const reads = result.reads.length;
    element.querySelector("[data-teams-sync]").click();
    await settle();
    expect(result.lines).toEqual([["library", "sync"]]);
    expect(result.reads.length).toBeGreaterThan(reads);
});

test("the page reads again when a copy changes and every five seconds", async () => {
    const delays = [];
    const real = globalThis.setTimeout;
    vi.spyOn(globalThis, "setTimeout").mockImplementation((callback, delay, ...rest) => {
        delays.push(delay);
        return real(callback, delay, ...rest);
    });
    const result = window([]);
    await mounted(TeamsPage, result);
    expect(result.followed).toEqual([["library_copy.*"]]);
    expect(delays).toContain(5000);
});

test("the difference of two texts marks the lines only in one of them", () => {
    const {rows, added, removed} = diffRows("one\ntwo\nthree", "one\n2\nthree");
    expect(rows.map((row) => `${row.line_type}:${row.text}`)).toEqual(["ctx:one", "add:2", "del:two", "ctx:three"]);
    expect([added, removed]).toEqual([1, 1]);
    expect(diffRows("", "new").rows).toEqual([{line_type: "add", line: 1, text: "new"}]);
});
