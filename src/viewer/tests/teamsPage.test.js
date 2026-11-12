import {afterEach, expect, test} from "vitest";
import {context, mounted, settle} from "./support/teamsContext.js";
import TeamsPage from "../../core/modules/library/web/src/TeamsPage.vue";

afterEach(() => document.body.replaceChildren());

const LINKED = {is_connected: true, address: "https://library.example.com:8740", is_encrypted: true, server_name: "Acme library", user_name: "Grace", role: "edit", reached_at: "2026-11-04T16:20:00+00:00", failure: "", stopped: ""};
const ITEMS = [
    {share: "doc", id: 12, version: 8, title: "Release checklist", abstract: "What to do before a release", excerpt: "", creator: "Ada", updated_by: "Grace", updated_at: "2026-11-04T16:20:00+00:00", copy_id: null},
    {share: "check", id: 12, version: 2, title: "Cut a release", abstract: "", excerpt: "tag first, then build", creator: "Ada", updated_by: "Ada", updated_at: "2026-11-03T10:00:00+00:00", copy_id: 3},
];
const SHOWN = {share: "doc", id: 12, version: 8, fields: {title: "Release checklist", abstract: "What to do before a release", body: "Tag first."}, creator: "Ada", updated_by: "Grace", updated_at: "2026-11-04T16:20:00+00:00", removed_at: ""};
const VERSIONS = {versions: [{version: 8, action: "update", user: "Grace", token: "", created_at: "2026-11-04T16:20:00+00:00"}, {version: 7, action: "update", user: "Ada", token: "", created_at: "2026-11-03T09:00:00+00:00"}]};

function window(status, extra = {}) {
    const answers = {
        "library status": {ok: true, value: {...LINKED, ...status}},
        "library browse": {ok: true, value: {page: 1, size: 30, total: ITEMS.length, rows: ITEMS}},
        "library show": {ok: true, value: SHOWN},
        "library inspect": {ok: true, value: {item: SHOWN, versions: VERSIONS.versions}},
        "library copies": {ok: true, value: {rows: []}},
        ...extra,
    };
    const result = context(answers);
    result.lines = [];
    result.run = async (line) => {
        result.lines.push(line);
        return {ok: true, value: {line: "doc 63 is now library doc 57, version 1", warning: "", copy_id: 5}};
    };
    return result;
}

async function openCopies(element) {
    [...element.querySelectorAll("[data-teams-tabs] button")].find((button) => button.textContent.includes("On this journal")).click();
    await settle();
}

function type(input, text) {
    input.value = text;
    input.dispatchEvent(new Event("input", {bubbles: true}));
}

const UNLINKED = {is_connected: false, address: "", server_name: "", user_name: "", role: "", reached_at: null, stopped: "This journal is not connected to a shared server."};

test("with no connection the page shows only the connect form", async () => {
    const element = await mounted(TeamsPage, window(UNLINKED));
    expect(element.querySelector("[data-library-connect]")).not.toBeNull();
    expect(element.querySelector("[data-teams-header]")).toBeNull();
    expect(element.querySelector("[data-library]")).toBeNull();
});

test("the connect form sends the address and the token, then empties the token", async () => {
    const result = window(UNLINKED);
    const element = await mounted(TeamsPage, result);
    type(element.querySelector("[data-library-address]"), "library.example.com");
    type(element.querySelector("[data-library-token]"), "jsl_abc");
    await settle();
    element.querySelector("[data-library-submit]").click();
    await settle();
    expect(result.lines).toEqual([["library", "connect", "library.example.com", "--token", "jsl_abc"]]);
    expect(element.querySelector("[data-library-token]").value).toBe("");
});

test("a refused connect shows the reason and keeps the form", async () => {
    const result = window(UNLINKED);
    result.run = async () => ({ok: false, failure: "refused", error: "The server did not accept this token."});
    const element = await mounted(TeamsPage, result);
    type(element.querySelector("[data-library-token]"), "jsl_wrong");
    await settle();
    element.querySelector("[data-library-submit]").click();
    await settle();
    expect(element.querySelector("[data-library-refusal]").textContent).toBe("The server did not accept this token.");
    expect(element.querySelector("[data-library-connect]")).not.toBeNull();
});

test("the header names the server, the role and when it was last reached", async () => {
    const element = await mounted(TeamsPage, window({}));
    expect(element.querySelector("[data-teams-server]").textContent).toBe("Connected: Acme library");
    expect(element.querySelector("[data-teams-role]").textContent).toBe("Role: Edit");
    expect(element.querySelector("[data-teams-reached]").textContent).toContain("Last reached:");
    expect(element.querySelector("[data-teams-plain]")).toBeNull();
    expect(element.querySelector("[data-library-connect]")).toBeNull();
});

test("a connection over plain HTTP says it is not encrypted", async () => {
    const element = await mounted(TeamsPage, window({is_encrypted: false, address: "http://10.0.0.5:8740", role: "read"}));
    expect(element.querySelector("[data-teams-plain]").textContent).toBe("Connection: not encrypted");
    expect(element.querySelector("[data-teams-role]").textContent).toBe("Role: Read-only");
});

test("a stopped sync shows why, with the connect form and no library", async () => {
    const element = await mounted(TeamsPage, window({stopped: "The address changed. Connect again to send your token to it."}));
    expect(element.querySelector("[data-teams-stopped]").textContent).toBe("The address changed. Connect again to send your token to it.");
    expect(element.querySelector("[data-library-connect]")).not.toBeNull();
    expect(element.querySelector("[data-library]")).toBeNull();
});

test("the library lists items live and marks those that are already on this journal", async () => {
    const result = window({});
    const element = await mounted(TeamsPage, result);
    expect(result.reads).toContain("library browse");
    const rows = [...element.querySelectorAll("[data-library-item]")];
    expect(rows.map((row) => row.dataset.libraryItem)).toEqual(["doc:12", "check:12"]);
    expect(rows[0].textContent).toContain("Document, Version: 8, Changed by: Grace");
    expect(rows[0].querySelector("[data-library-here]")).toBeNull();
    expect(rows[1].querySelector("[data-library-here]").textContent).toBe("On this journal");
    expect(rows[1].querySelector("[data-library-excerpt]").textContent).toBe("tag first, then build");
});

test("choosing a type reads the library again for that type", async () => {
    const result = window({});
    const element = await mounted(TeamsPage, result);
    [...element.querySelectorAll("[data-library-type] button")].find((button) => button.textContent.trim() === "Sequences").click();
    await settle();
    expect(result.reads).toContain("library browse --type sequence");
});

test("typing in the search reads the library with those words", async () => {
    const result = window({});
    const element = await mounted(TeamsPage, result);
    type(element.querySelector("[data-library-search] input, input[data-library-search]"), "release notes");
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(result.reads).toContain('library browse --search release notes');
});

test("only an admin sees Remove, and it removes that item", async () => {
    const admin = window({role: "admin"});
    const adminElement = await mounted(TeamsPage, admin);
    const buttons = adminElement.querySelectorAll("[data-library-remove]");
    expect(buttons.length).toBe(2);
    buttons[0].click();
    await settle();
    expect(admin.lines).toEqual([["library", "remove", "doc", "12"]]);
    const editor = await mounted(TeamsPage, window({role: "edit"}));
    expect(editor.querySelector("[data-library-remove]")).toBeNull();
});

test("opening an item shows its text and versions, and an editor can restore an old version", async () => {
    const result = window({});
    const element = await mounted(TeamsPage, result);
    element.querySelector("[data-library-open]").click();
    await settle();
    const panel = document.body.querySelector("[data-library-panel]");
    expect(result.reads).toContain("library inspect doc 12");
    expect(panel.querySelector("[data-library-fields]").textContent).toContain("Tag first.");
    expect([...panel.querySelectorAll("[data-library-version]")].map((item) => item.dataset.libraryVersion)).toEqual(["8", "7"]);
    expect(panel.querySelectorAll("[data-library-restore-version]").length).toBe(1);
    panel.querySelector("[data-library-restore-version]").click();
    await settle();
    expect(result.lines).toEqual([["library", "restore", "doc", "12", "--version", "7"]]);
});

test("a reader sees no restore of an old version and no field to share", async () => {
    const result = window({role: "read"});
    const element = await mounted(TeamsPage, result);
    await openCopies(element);
    expect(element.querySelector("[data-library-share]")).toBeNull();
    [...element.querySelectorAll("[data-teams-tabs] button")].find((button) => button.textContent.includes("Library")).click();
    await settle();
    element.querySelector("[data-library-open]").click();
    await settle();
    expect(document.body.querySelector("[data-library-restore-version]")).toBeNull();
});

test("an admin brings back a removed item from its panel", async () => {
    const result = window({role: "admin"}, {"library inspect": {ok: true, value: {item: {...SHOWN, removed_at: "2026-11-04T17:00:00+00:00"}, versions: VERSIONS.versions}}});
    const element = await mounted(TeamsPage, result);
    element.querySelector("[data-library-open]").click();
    await settle();
    expect(document.body.querySelector("[data-library-removed]").textContent).toBe("Removed from the library");
    document.body.querySelector("[data-library-restore]").click();
    await settle();
    expect(result.lines).toEqual([["library", "restore", "doc", "12"]]);
});

test("a user who may write shares an item by its type and number, and sees the warning", async () => {
    const result = window({});
    result.run = async (line) => {
        result.lines.push(line);
        return {ok: true, value: {line: "doc 63 is now library doc 57, version 1", warning: "this text names task 6367 and doc 12; those numbers mean something else in another journal", copy_id: 5}};
    };
    const element = await mounted(TeamsPage, result);
    await openCopies(element);
    type(element.querySelector("[data-library-share-field]"), "doc 63");
    await settle();
    element.querySelector("[data-library-share-submit]").click();
    await settle();
    expect(result.lines).toEqual([["library", "share", "doc", "63"]]);
    expect(element.querySelector("[data-library-shared]").textContent).toBe("doc 63 is now library doc 57, version 1");
    expect(element.querySelector("[data-library-warning]").textContent).toContain("this text names task 6367 and doc 12");
});

test("a share field that is not a type and a number is not sent", async () => {
    const result = window({});
    const element = await mounted(TeamsPage, result);
    await openCopies(element);
    type(element.querySelector("[data-library-share-field]"), "doc");
    await settle();
    element.querySelector("[data-library-share-submit]").click();
    await settle();
    expect(result.lines).toEqual([]);
    expect(element.querySelector("[data-library-refusal]").textContent).toBe("Write the type and the number, such as doc 63.");
});

test("a library that cannot be reached says so in place of the list", async () => {
    const result = window({}, {"library browse": {ok: false, failure: "refused", error: "The library cannot be reached. Items you already got still work."}});
    const element = await mounted(TeamsPage, result);
    expect(element.textContent).toContain("The library cannot be reached. Items you already got still work.");
});
