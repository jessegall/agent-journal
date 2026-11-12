import {afterEach, expect, test} from "vitest";
import {context, mounted, settle} from "./support/teamsContext.js";
import TeamsPage from "../../core/modules/library/web/src/TeamsPage.vue";

afterEach(() => document.body.replaceChildren());

const LINKED = {is_connected: true, address: "https://library.example.com:8740", is_encrypted: true, server_name: "Acme library", user_name: "Ada", role: "admin", reached_at: "2026-11-04T16:20:00+00:00", failure: "", stopped: ""};
const USERS = {users: [
    {id: 1, name: "Ada", role: "admin", removed_at: ""},
    {id: 2, name: "Grace", role: "edit", removed_at: ""},
    {id: 3, name: "Linus", role: "read", removed_at: ""},
    {id: 4, name: "Otto", role: "read", removed_at: "2026-11-01T10:00:00+00:00"},
]};
const GRACE_TOKENS = {tokens: [
    {id: 7, user_id: 2, label: "Laptop", last_used_at: "2026-11-03T09:00:00+00:00", revoked_at: ""},
    {id: 8, user_id: 2, label: "Phone", last_used_at: "", revoked_at: ""},
    {id: 9, user_id: 2, label: "Old tablet", last_used_at: "2026-10-01T09:00:00+00:00", revoked_at: "2026-10-02T09:00:00+00:00"},
]};

function window(status = {}, extra = {}) {
    const result = context({
        "library status": {ok: true, value: {...LINKED, ...status}},
        "library browse": {ok: true, value: {page: 1, size: 30, total: 0, rows: []}},
        "library copies": {ok: true, value: {rows: []}},
        "library-user list": {ok: true, value: USERS},
        "library-user tokens 2": {ok: true, value: GRACE_TOKENS},
        ...extra,
    });
    result.lines = [];
    result.run = async (line) => {
        result.lines.push(line);
        return {ok: true, value: {user: {name: "Mira"}, token_text: "jsl_first_token"}};
    };
    return result;
}

async function onPeople(status = {}, extra = {}) {
    const result = window(status, extra);
    const element = await mounted(TeamsPage, result);
    [...element.querySelectorAll("[data-teams-tabs] button")].find((button) => button.textContent.includes("Users")).click();
    await settle();
    return {result, element};
}

const tabNames = (element) => [...element.querySelectorAll("[data-teams-tabs] button")].map((button) => button.textContent.replace(/\s+\d+$/, "").trim());

test("an admin sees the People tab and a role that may not administer sees none", async () => {
    expect(tabNames(await mounted(TeamsPage, window()))).toEqual(["Library", "On this journal", "Users"]);
    expect(tabNames(await mounted(TeamsPage, window({role: "edit"})))).toEqual(["Library", "On this journal"]);
    expect(tabNames(await mounted(TeamsPage, window({role: "read"})))).toEqual(["Library", "On this journal"]);
});

test("the People tab lists the users with their roles and marks a removed user", async () => {
    const {result, element} = await onPeople();
    expect(result.reads).toContain("library-user list");
    const names = [...element.querySelectorAll("[data-people-user] .person-name")].map((name) => name.textContent);
    expect(names).toEqual(["Ada", "Grace", "Linus", "Otto"]);
    const linus = element.querySelector('[data-people-user="3"]');
    expect(linus.querySelector("[data-people-role] [aria-checked=true]").textContent.trim()).toBe("Read-only");
    expect(element.querySelector('[data-people-user="4"] [data-people-removed]').textContent).toBe("Removed");
    expect(element.querySelector('[data-people-user="4"] [data-people-role]')).toBeNull();
});

test("choosing another role for a user runs the role line for that user", async () => {
    const {result, element} = await onPeople();
    [...element.querySelectorAll('[data-people-user="3"] [data-people-role] button')].find((button) => button.textContent.trim() === "Edit").click();
    await settle();
    expect(result.lines).toEqual([["library-user", "role", "3", "edit"]]);
});

test("a user's tokens show their label and last use, and revoking one runs its line and reads them again", async () => {
    const {result, element} = await onPeople();
    element.querySelector('[data-people-user="2"] [data-people-tokens]').click();
    await settle();
    const rows = [...element.querySelectorAll("[data-people-token]")];
    expect(rows.map((row) => row.dataset.peopleToken)).toEqual(["7", "8", "9"]);
    expect(rows[0].textContent).toContain("Laptop, Last used: 2026-11-03T09:00:00+00:00");
    expect(rows[1].textContent).toContain("Phone, Last used: never");
    expect(rows[2].querySelector("[data-people-revoked]").textContent).toBe("Revoked");
    expect(rows[2].querySelector("[data-people-revoke]")).toBeNull();
    const reads = result.reads.length;
    rows[0].querySelector("[data-people-revoke]").click();
    await settle();
    expect(result.lines).toEqual([["library-user", "revoke", "7"]]);
    expect(result.reads.length).toBeGreaterThan(reads);
});

test("removing a user runs the remove line", async () => {
    const {result, element} = await onPeople();
    element.querySelector('[data-people-user="3"] [data-people-remove]').click();
    await settle();
    expect(result.lines).toEqual([["library-user", "remove", "3"]]);
});

test("adding a user runs the add line with the chosen role and shows the first token once", async () => {
    const {result, element} = await onPeople();
    const input = element.querySelector("[data-people-name]");
    input.value = "Mira";
    input.dispatchEvent(new Event("input", {bubbles: true}));
    await settle();
    [...element.querySelectorAll("[data-people-new-role] button")].find((button) => button.textContent.trim() === "Edit").click();
    await settle();
    element.querySelector("[data-people-submit]").click();
    await settle();
    expect(result.lines).toEqual([["library-user", "add", "Mira", "--role", "edit"]]);
    expect(element.querySelector("[data-people-first-token]").textContent).toBe("Mira has this token, shown once: jsl_first_token");
    expect(element.querySelector("[data-people-name]").value).toBe("");
});

test("a refusal from the server shows as it was worded", async () => {
    const {result, element} = await onPeople();
    result.run = async () => ({ok: false, failure: "refused", error: "your role cannot do this: ask an admin"});
    [...element.querySelectorAll('[data-people-user="3"] [data-people-role] button')].find((button) => button.textContent.trim() === "Admin").click();
    await settle();
    expect(element.querySelector("[data-people-refusal]").textContent).toBe("your role cannot do this: ask an admin");
});

test("a list the server refuses shows the reason in place of the users", async () => {
    const {element} = await onPeople({}, {"library-user list": {ok: false, failure: "refused", error: "your role cannot do this"}});
    expect(element.textContent).toContain("your role cannot do this");
    expect(element.querySelector("[data-people-user]")).toBeNull();
});
