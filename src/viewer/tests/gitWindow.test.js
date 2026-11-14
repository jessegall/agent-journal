import {beforeEach, expect, test, vi} from "vitest";
import {mounted, settle} from "./support/windowContext.js";
import {gitWindowContext} from "./support/gitWindowContext.js";
import GitOverview from "../../suites/coding/web/src/GitOverview.vue";
import {checksLine, distanceLine, reviewLine} from "../../suites/coding/web/src/gitWords.js";

beforeEach(() => vi.stubGlobal("ResizeObserver", class {observe() {} disconnect() {}}));
const tab = async (element, word) => {
    [...element.querySelectorAll("[data-git-tabs] button")].find((button) => button.textContent.includes(word)).click();
    await settle();
};
const BRANCH = {name: "shop", current: true, extra_commits: 2, missing_commits: 1, subject: "Count in cents", author: "Ada", time: 1760000000};
const COMMIT = {sha: "abcdef123456", subject: "Add the cart", author: "Ada", time: 1760000000};
const PULL = {number: 4, title: "Cart", url: "https://example.test/4", branch: "shop", author: "ada", draft: false, review: "APPROVED", checks_passed: 2, checks_failed: 1, checks_running: 0};

test("the window lists commits, branches and pull requests under tabs, and pages for more", async () => {
    const window = gitWindowContext({
        "git-overview branches --skip 1": {ok: true, value: {rows: [{...BRANCH, name: "main", current: false}], is_last_page: true}},
        "git-overview branches": {ok: true, value: {rows: [BRANCH], is_last_page: false}},
        "git-overview commits": {ok: true, value: {rows: [COMMIT], is_last_page: true}},
        "git-overview pulls": {ok: true, value: {available: true, rows: [PULL]}},
    });
    const reads = vi.spyOn(window, "readKeys");
    const element = await mounted(GitOverview, window);
    expect(reads).toHaveBeenCalledTimes(1);
    expect(element.querySelector('[data-row="abcdef123456"]').textContent).toContain("Add the cart");
    await tab(element, "Branches");
    expect(element.querySelector('[data-row="shop"]').textContent).toContain("2 more than the base, 1 fewer than the base");
    element.querySelector("[data-git-more]").click();
    await settle();
    expect(window.reads).toContain("git-overview branches --skip 1");
    expect(reads.mock.calls[1][0].only).toEqual(["branches"]);
    expect(element.querySelectorAll("[data-reader-row]")).toHaveLength(2);
    expect(element.querySelector("[data-git-more]")).toBeNull();
    await tab(element, "Pull requests");
    expect(element.querySelector('[data-row="4"]').textContent).toContain("#4 Cart");
});

test("no gh and a read that fails each say so", async () => {
    const element = await mounted(GitOverview, gitWindowContext({
        "git-overview branches": {ok: false, error: "git for-each-ref could not read this repository"},
        "git-overview commits": {ok: true, value: {rows: [], is_last_page: true}},
        "git-overview pulls": {ok: true, value: {available: false, rows: []}},
    }));
    expect(element.textContent).toContain("no commits yet");
    await tab(element, "Branches");
    expect(element.textContent).toContain("could not read this repository");
    await tab(element, "Pull requests");
    expect(element.textContent).toContain("read through gh");
});

test("the words for distance, checks and review are plain", () => {
    expect(distanceLine({extra_commits: 0, missing_commits: 0})).toBe("level with the base");
    expect(checksLine({checks_passed: 0, checks_failed: 0, checks_running: 0})).toBe("no checks");
    expect(checksLine(PULL)).toBe("2 passed, 1 failed");
    expect(reviewLine({draft: true})).toBe("draft");
});

test("the tabs are the underline band of the other pages, the open one marked and each with its count", async () => {
    const window = gitWindowContext({
        "git-overview branches": {ok: true, value: {rows: [BRANCH], is_last_page: true}},
        "git-overview commits": {ok: true, value: {rows: [COMMIT], is_last_page: true}},
        "git-overview pulls": {ok: true, value: {available: true, rows: [PULL]}},
    });
    const element = await mounted(GitOverview, window);
    const band = element.querySelector("[data-git-tabs] [data-inner-tabs]");
    expect(band).not.toBeNull();
    expect(band.querySelector(".inner-tab.on").textContent).toContain("Commits");
    await tab(element, "Branches");
    expect(band.querySelector(".inner-tab.on").textContent).toContain("Branches");
});
