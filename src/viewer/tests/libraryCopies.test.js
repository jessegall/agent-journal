import {afterEach, expect, test, vi} from "vitest";
import {context, mounted, settle} from "./support/teamsContext.js";
import {unmountAll} from "./support/windowContext.js";
import TeamsPage from "../../core/modules/library/web/src/TeamsPage.vue";
import {diffRows} from "../../core/modules/library/web/src/copyDiff.js";

vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

afterEach(() => {
    unmountAll();
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
    {copy: copy("agent", "Agent change, not sent"), buttons: ["compare", "send", "library"], lines: ["An agent changed this item. A user sends it to the team."]},
];

function window(rows, status = {}, extra = {}) {
    const result = context({
        "library status": {ok: true, value: {...LINKED, ...status}},
        "library browse": {ok: true, value: {page: 1, size: 30, total: 2, rows: [
            {share: "doc", id: 12, version: 8, title: "Release checklist", abstract: "What to do", excerpt: "", creator: "Ada", updated_by: "Grace", updated_at: "2026-11-04T16:20:00+00:00", copy_id: null},
            {share: "check", id: 5, version: 2, title: "Cut a release", abstract: "", excerpt: "", creator: "Ada", updated_by: "Ada", updated_at: "2026-11-03T10:00:00+00:00", copy_id: null},
        ]}},
        "library copies": {ok: true, value: {rows}},
        "library show check 5": {ok: true, value: {share: "check", id: 5, version: 2, fields: {title: "Cut a release", command: "make release"}, removed_at: ""}},
        "library show doc 12": {ok: true, value: {share: "doc", id: 12, version: 8, fields: THEIRS, removed_at: ""}},
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

test("Send puts an agent change up with the version the user saw", async () => {
    const {result, element} = await onThisJournal([copy("agent", "Agent change, not sent")]);
    element.querySelector('[data-copy-button="send"]').click();
    await settle();
    expect(result.lines).toEqual([["library", "resolve", "7", "--keep", "mine"]]);
    expect(element.querySelector('[data-copy-button="send"]').textContent.trim()).toBe("Send");
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

test("the page follows connection and copy changes", async () => {
    const result = window([]);
    await mounted(TeamsPage, result);
    expect(result.followed).toEqual([["library_connection.*", "library_copy.*"]]);
});

test("the difference of two texts marks the lines only in one of them", () => {
    const {rows, added, removed} = diffRows("one\ntwo\nthree", "one\n2\nthree");
    expect(rows.map((row) => `${row.line_type}:${row.text}`)).toEqual(["ctx:one", "add:2", "del:two", "ctx:three"]);
    expect([added, removed]).toEqual([1, 1]);
    expect(diffRows("", "new").rows).toEqual([{line_type: "add", line: 1, text: "new"}]);
});

const CHECK_HERE = {title: "Migrations are reversible", command: "echo old", brief: "Checks", interval_minutes: 0};
const CHECK_THERE = {title: "Migrations are reversible", command: "echo new", brief: "Checks", interval_minutes: 0};

function reviewOf(share, here, there) {
    return copy("review", "New version to read", {share, local_fields: here, server_fields: there, note: share === "check" ? "The command of this check changed." : "The steps of this sequence changed."});
}

test("a check to read shows its note, and Read shows the new command beside the old one", async () => {
    const {element} = await onThisJournal([reviewOf("check", CHECK_HERE, CHECK_THERE)]);
    expect(element.querySelector("[data-copy-facts]").textContent).toBe("Status: New version to read, Version: 8");
    expect(element.querySelector("[data-copy-line]").textContent).toBe("The command of this check changed.");
    element.querySelector('[data-copy-button="read"]').click();
    await settle();
    const panel = document.body.querySelector("[data-library-compare-panel]");
    expect(panel.querySelector(".diff-row.del").textContent).toContain("echo old");
    expect(panel.querySelector(".diff-row.add").textContent).toContain("echo new");
});

test("using the library's version of a check says the local text is lost and waits for a second press", async () => {
    const {result, element} = await onThisJournal([reviewOf("check", CHECK_HERE, CHECK_THERE)]);
    element.querySelector('[data-copy-button="library"]').click();
    await settle();
    expect(result.lines).toEqual([]);
    const panel = document.body.querySelector("[data-library-compare-panel]");
    expect(panel.querySelector("[data-library-loss]").textContent).toBe("The text on this journal is lost when you use the library's version: a check keeps no earlier versions.");
    panel.querySelector("[data-library-take]").click();
    await settle();
    expect(result.lines).toEqual([["library", "resolve", "7", "--keep", "library"]]);
    expect(document.body.querySelector("[data-library-compare-panel]")).toBeNull();
});

test("a sequence to read says the same, with its own word", async () => {
    const here = {title: "Cut a release", steps: '["one"]', step_guards: "[]"};
    const {element} = await onThisJournal([reviewOf("sequence", here, {...here, steps: '["one", "two"]'})]);
    element.querySelector('[data-copy-button="library"]').click();
    await settle();
    expect(document.body.querySelector("[data-library-loss]").textContent).toContain("a sequence keeps no earlier versions");
});

test("Compare of a check says the local text is lost but offers no way to take the library's version", async () => {
    const {element} = await onThisJournal([copy("conflict", "Conflict", {share: "check", local_fields: CHECK_HERE, server_fields: CHECK_THERE})]);
    element.querySelector('[data-copy-button="compare"]').click();
    await settle();
    expect(document.body.querySelector("[data-library-loss]")).not.toBeNull();
    expect(document.body.querySelector("[data-library-take]")).toBeNull();
});

test("a document keeps its earlier text in the revisions, so it says nothing about a loss and takes the library's version at once", async () => {
    const {result, element} = await onThisJournal([copy("conflict", "Conflict", {server_fields: THEIRS})]);
    element.querySelector('[data-copy-button="compare"]').click();
    await settle();
    expect(document.body.querySelector("[data-library-loss]")).toBeNull();
    element.querySelector('[data-copy-button="library"]').click();
    await settle();
    expect(result.lines).toEqual([["library", "resolve", "7", "--keep", "library"]]);
});

test("the dialog of a check shows its command and Cancel gets nothing", async () => {
    const result = window([]);
    const element = await mounted(TeamsPage, result);
    [...element.querySelectorAll("[data-library-item]")][1].querySelector("[data-library-get]").click();
    await settle();
    expect(element.querySelector("[data-library-check]").textContent).toContain("This check runs this command on your computer when someone starts it:");
    expect(element.querySelector("[data-library-command]").textContent).toBe("make release");
    [...element.querySelectorAll("[data-library-check] button")].find((button) => button.textContent.trim() === "Cancel").click();
    await settle();
    expect(element.querySelector("[data-library-check]")).toBeNull();
    expect(result.lines).toEqual([]);
});

test("the Library tab with All chosen reads documents, sequences and checks", async () => {
    const result = window([]);
    await mounted(TeamsPage, result);
    expect(result.reads).toContain("library browse");
});
