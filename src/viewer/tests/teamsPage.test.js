import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {itemsOf, labelsOf} from "./support/cardMenu.js";
import {diffRows} from "../../core/modules/library/web/src/copyDiff.js";
import {teamFields, teamItems} from "../../core/modules/library/web/src/teamWords.js";
import {context, mounted, settle} from "./support/teamsContext.js";
import TeamsPage from "../../core/modules/library/web/src/TeamsPage.vue";

beforeEach(() => vi.stubGlobal("ResizeObserver", class {observe() {} disconnect() {}}));
afterEach(() => {
    document.body.replaceChildren();
    vi.unstubAllGlobals();
});

const LINKED = {is_connected: true, address: "https://library.example.com:8740", is_encrypted: true, server_name: "Acme library", user_name: "Grace", role: "edit", reached_at: "2026-11-04T16:20:00+00:00", failure: "", stopped: ""};
const ITEMS = [
    {share: "doc", id: 12, version: 8, title: "Release checklist", abstract: "What to do before a release", excerpt: "", creator: "Ada", updated_by: "Grace", updated_at: "2026-11-04T16:20:00+00:00", copy_id: 3},
    {share: "check", id: 12, version: 2, title: "Cut a release", abstract: "", excerpt: "tag first, then build", creator: "Ada", updated_by: "Ada", updated_at: "2026-11-03T10:00:00+00:00", copy_id: null},
    {share: "sequence", id: 4, version: 1, title: "Ship it", abstract: "", excerpt: "", creator: "Grace", updated_by: "Grace", updated_at: "2026-11-02T10:00:00+00:00", copy_id: 5},
    {share: "doc", id: 20, version: 3, title: "Style guide", abstract: "", excerpt: "", creator: "Ada", updated_by: "Ada", updated_at: "2026-11-01T10:00:00+00:00", copy_id: 6},
];
const copy = (id, share, item, row, status, extra = {}) => ({copy_id: id, share, row_id: row, item_id: item, version: 8, status, label: status, note: "", server_version: 8, local_fields: {title: "Release checklist"}, server_fields: {}, ...extra});
// a changed doc here, a synced sequence, and a doc with a newer version in the library
const COPIES = [copy(3, "doc", 12, 88, "unsent"), copy(5, "sequence", 4, 70, "synced"), copy(6, "doc", 20, 90, "review", {version: 2, server_version: 3, local_fields: {title: "Style guide"}})];
const SHOWN = {share: "doc", id: 12, version: 8, fields: {title: "Release checklist", abstract: "What to do before a release", body: "Tag first."}, creator: "Ada", updated_by: "Grace", updated_at: "2026-11-04T16:20:00+00:00", removed_at: ""};
const VERSIONS = {versions: [{version: 8, action: "update", user: "Grace", token: "", created_at: "2026-11-04T16:20:00+00:00"}, {version: 7, action: "update", user: "Ada", token: "", created_at: "2026-11-03T09:00:00+00:00"}]};

function window(status, extra = {}) {
    const answers = {
        "library status": {ok: true, value: {...LINKED, ...status}},
        "library browse": {ok: true, value: {page: 1, size: 30, total: ITEMS.length, rows: ITEMS}},
        "library show": {ok: true, value: SHOWN},
        "library inspect": {ok: true, value: {item: SHOWN, versions: VERSIONS.versions}},
        "library copies": {ok: true, value: {rows: COPIES}},
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

const tabButton = (element, word) => [...element.querySelectorAll("[data-teams-tabs] button")].find((button) => button.textContent.includes(word));

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


const rowOf = (element, id) => element.querySelector(`[data-row="${id}"]`);

test("test_update_badge_with_direction: only Update is a badge, and the way it goes is written under the name", async () => {
    const element = await mounted(TeamsPage, window({}));
    await settle();
    expect([...element.querySelectorAll(".list-reader-group")].map((group) => group.textContent)).toEqual(["Documents", "Checks", "Sequences"]);
    expect(rowOf(element, "doc:12").querySelector("[data-team-badge]").textContent).toBe("Update");
    expect(rowOf(element, "doc:12").querySelector(".list-row-text").textContent).toBe("Changed here · Grace");
    expect(rowOf(element, "doc:20").querySelector(".list-row-text").textContent).toBe("Newer in library · Ada");
    expect(rowOf(element, "sequence:4").querySelector("[data-team-badge]")).toBeNull();
    expect(rowOf(element, "sequence:4").querySelector("[data-team-state]").textContent).toBe("Up to date");
    expect(rowOf(element, "check:12").querySelector("[data-team-state]").textContent).toBe("Not followed");
    expect(element.textContent).not.toMatch(/Skill/);
});

test("test_state_filter: the filter has Kind and State with Update, Up to date and Not followed", async () => {
    const element = await mounted(TeamsPage, window({}));
    await settle();
    expect(teamFields.map((field) => field.key)).toEqual(["kind", "state"]);
    expect(teamFields[1].options.map(([, label]) => label)).toEqual(["Update", "Up to date", "Not followed"]);
    const items = teamItems(ITEMS, COPIES);
    expect(items.filter((item) => teamFields[1].get(item) === "unfollowed").map((item) => item.id)).toEqual(["check:12"]);
    expect(element.querySelector("[data-filter-bar]")).not.toBeNull();
});

test("test_shared_from_here_count: the tab counts only what this user shared, and lists those rows", async () => {
    const element = await mounted(TeamsPage, window({}));
    await settle();
    expect(tabButton(element, "Library").textContent).toContain("4");
    expect(tabButton(element, "Shared from here").textContent).toContain("2");
    tabButton(element, "Shared from here").click();
    await settle();
    expect([...element.querySelectorAll("[data-reader-row]")].map((row) => row.dataset.row).sort()).toEqual(["doc:12", "sequence:4"]);
});

test("test_menu_has_no_delete: a right click has Open, the action that waits, Copy name and Stop following, and never Duplicate or Delete", async () => {
    const result = window({});
    const element = await mounted(TeamsPage, result);
    await settle();
    expect(labelsOf(rowOf(element, "doc:12"))).toEqual(["Open", "Share", "Copy name", "Stop following"]);
    expect(labelsOf(rowOf(element, "check:12"))).toEqual(["Open", "Follow", "Copy name"]);
    expect(labelsOf(rowOf(element, "doc:12")).join()).not.toMatch(/delete|duplicate|remove/i);
    await itemsOf(rowOf(element, "doc:12")).find((entry) => entry.label === "Share").run({say: () => {}});
    await settle();
    expect(result.lines).toContainEqual(["library", "resolve", "3", "--keep", "mine"]);
});

test("the Share button asks for the kind and the number, and sends them", async () => {
    const result = window({});
    const element = await mounted(TeamsPage, result);
    document.body.append(element);
    await settle();
    element.querySelector("[data-library-share-submit]").click();
    await settle();
    type(document.body.querySelector('[data-field="number"]'), "63");
    await settle();
    document.body.querySelector("[data-create-send]").click();
    await settle();
    expect(result.lines).toContainEqual(["library", "share", "doc", "63"]);
});

test("Follow on a check shows its command first and gets it stopped", async () => {
    const result = window({}, {"library show": {ok: true, value: {share: "check", id: 12, version: 2, fields: {title: "Cut a release", command: "make release"}, removed_at: ""}}});
    const element = await mounted(TeamsPage, result);
    document.body.append(element);
    await settle();
    await itemsOf(rowOf(element, "check:12")).find((entry) => entry.label === "Follow").run({say: () => {}});
    await settle();
    expect(document.body.querySelector("[data-library-command]").textContent).toBe("make release");
    document.body.querySelector("[data-library-confirm]").click();
    await settle();
    expect(result.lines).toContainEqual(["library", "get", "check", "12", "--read"]);
});

test("the difference of two texts marks the lines only in one of them", () => {
    const {rows, added, removed} = diffRows("one\ntwo\nthree", "one\n2\nthree");
    expect(rows.map((row) => `${row.line_type}:${row.text}`)).toEqual(["ctx:one", "add:2", "del:two", "ctx:three"]);
    expect([added, removed]).toEqual([1, 1]);
});

test("a library that cannot be reached says so in place of the list", async () => {
    const result = window({}, {"library browse": {ok: false, failure: "refused", error: "The library cannot be reached. Items you already got still work."}});
    const element = await mounted(TeamsPage, result);
    await settle();
    expect(element.textContent).toContain("The library cannot be reached. Items you already got still work.");
});
