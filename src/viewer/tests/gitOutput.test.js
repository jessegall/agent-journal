import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {mounted, page, settle} from "./support/windowContext.js";
import {gitWindowContext} from "./support/gitWindowContext.js";
import {commandsWindowContext} from "./support/commandsWindowContext.js";
import {itemsOf, labelsOf} from "./support/cardMenu.js";
import GitOverview from "../../suites/coding/web/src/GitOverview.vue";
import Outputs from "../../core/modules/processes/web/src/Outputs.vue";

beforeEach(() => vi.stubGlobal("ResizeObserver", class {observe() {} disconnect() {}}));
afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

const COMMIT = {sha: "abcdef123456", subject: "Add the cart", author: "Ada", time: 1760000000};
const BRANCH = {name: "shop", current: true, extra_commits: 2, missing_commits: 0, subject: "Count in cents", author: "Ada", time: 1760000000};
const PULL = {number: 4, title: "Cart", url: "https://example.test/4", branch: "shop", author: "ada", draft: false, review: "APPROVED", checks_passed: 2, checks_failed: 1, checks_running: 0};

const git = async () => {
    const window = gitWindowContext({
        "git-overview branches": {ok: true, value: {rows: [BRANCH, {...BRANCH, name: "old", current: false}], is_last_page: true}},
        "git-overview commits": {ok: true, value: {rows: [COMMIT, {...COMMIT, sha: "1234567abcdef", subject: "Fix tax", author: "Grace"}], is_last_page: true}},
        "git-overview pulls": {ok: true, value: {available: true, rows: [PULL]}},
    });
    const element = await mounted(GitOverview, window);
    document.body.append(element);
    await settle();
    return element;
};
const tab = async (element, word) => {
    [...element.querySelectorAll("[data-git-tabs] button")].find((button) => button.textContent.includes(word)).click();
    await settle();
};

test("test_git_list_reader: a chosen commit, branch or pull request is read beside its list with its facts and Show changes", async () => {
    const element = await git();
    expect(element.querySelector("[data-git-tabs]").textContent).toMatch(/Commits.*2.*Branches.*2.*Pull requests.*1/s);
    element.querySelector('[data-row="abcdef123456"]').click();
    await settle();
    const reader = element.querySelector("[data-git-reader]");
    expect(reader.textContent).toContain("Add the cart");
    expect(reader.textContent).toContain("abcdef1");
    expect(reader.querySelector("[data-git-changes]").textContent).toBe("Show changes");
    await tab(element, "Branches");
    expect([...element.querySelectorAll(".list-reader-group")].map((group) => group.textContent)).toEqual(["Current", "Other branches"]);
    await tab(element, "Pull requests");
    element.querySelector('[data-row="4"]').click();
    await settle();
    expect(element.querySelector("[data-git-reader]").textContent).toContain("approved");
});

test("test_git_menu_no_delete: a right click has Open, Show changes and a copy, a pull request also GitHub, and never Duplicate or Delete", async () => {
    const element = await git();
    expect(labelsOf(element.querySelector('[data-row="abcdef123456"]'))).toEqual(["Open", "Show changes", "Copy hash"]);
    await tab(element, "Branches");
    expect(labelsOf(element.querySelector('[data-row="shop"]'))).toEqual(["Open", "Show changes", "Copy name"]);
    await tab(element, "Pull requests");
    const labels = labelsOf(element.querySelector('[data-row="4"]'));
    expect(labels).toEqual(["Open", "Show changes", "Open on GitHub", "Copy link"]);
    expect(labels.join()).not.toMatch(/duplicate|delete|remove/i);
    expect(itemsOf(element.querySelector('[data-row="4"]')).length).toBe(4);
});

test("test_output_table_filters: the commands are a table with Output, Command, Agent, Task, State, Duration and When, and the filter chips State, Agent and Task", async () => {
    const rows = [
        {id: 2, line: "make test", state: "running", session_agent_id: 7, task_id: 11, created_at: new Date(Date.now() - 120000).toISOString(), started_at: new Date(Date.now() - 90000).toISOString(), ended_at: null},
        {id: 1, line: "ls build", state: "failed", session_agent_id: 8, task_id: null, created_at: new Date(Date.now() - 3600000 * 3).toISOString(), started_at: null, ended_at: null},
    ];
    const element = await mounted(Outputs, commandsWindowContext({"process feed": page(rows)}));
    document.body.append(element);
    await settle();
    expect([...element.querySelectorAll(".table-row.head .cell")].map((cell) => cell.textContent)).toEqual(["Output", "Command", "Agent", "Task", "State", "Duration", "When"]);
    const first = [...element.querySelectorAll(".table-row:not(.head)")][0];
    expect([...first.querySelectorAll(".cell")].map((cell) => cell.textContent).slice(0, 5)).toEqual(["2", "make test", "Agent 7", "Task 11", "Running"]);
    expect(element.querySelectorAll(".table-row.danger")).toHaveLength(1);
    expect(element.querySelector("[data-filter-bar]")).not.toBeNull();
    // a right click on a row is the table row's place: Open, Copy number and Copy line
    expect(labelsOf(first)).toEqual(["Open", "Copy number", "Copy line"]);
});
