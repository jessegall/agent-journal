import {expect, test, vi} from "vitest";
import {mounted, settle} from "./support/windowContext.js";
import {gitWindowContext} from "./support/gitWindowContext.js";
import GitOverview from "../../suites/coding/web/src/GitOverview.vue";
import {checksLine, distanceLine, reviewLine} from "../../suites/coding/web/src/gitWords.js";

const BRANCH = {name: "shop", current: true, extra_commits: 2, missing_commits: 1, subject: "Count in cents", author: "Ada", time: 1760000000};
const COMMIT = {sha: "abcdef123456", subject: "Add the cart", author: "Ada", time: 1760000000};
const PULL = {number: 4, title: "Cart", url: "https://example.test/4", branch: "shop", author: "ada", draft: false, review: "APPROVED", checks_passed: 2, checks_failed: 1, checks_running: 0};

test("the window lists branches, commits and pull requests, and pages for more", async () => {
    const window = gitWindowContext({
        "git-overview branches --skip 1": {ok: true, value: {rows: [{...BRANCH, name: "main", current: false}], is_last_page: true}},
        "git-overview branches": {ok: true, value: {rows: [BRANCH], is_last_page: false}},
        "git-overview commits": {ok: true, value: {rows: [COMMIT], is_last_page: true}},
        "git-overview pulls": {ok: true, value: {available: true, rows: [PULL]}},
    });
    const reads = vi.spyOn(window, "readKeys");
    const element = await mounted(GitOverview, window);
    expect(reads).toHaveBeenCalledTimes(1);
    expect(element.querySelector("[data-git-branch]").textContent).toContain("2 more than the base, 1 fewer than the base");
    expect(element.querySelector("[data-git-commit]").textContent).toContain("abcdef1");
    expect(element.querySelector("[data-git-pull]").textContent).toContain("approved");
    element.querySelector("[data-git-more-branches]").click();
    await settle();
    expect(window.reads).toContain("git-overview branches --skip 1");
    expect(reads.mock.calls[1][0].only).toEqual(["branches"]);
    expect(element.querySelectorAll("[data-git-branch]")).toHaveLength(2);
    expect(element.querySelector("[data-git-more-branches]")).toBeNull();
    expect(element.querySelector("[data-git-more-commits]")).toBeNull();
});

test("no gh and a read that fails each say so", async () => {
    const element = await mounted(GitOverview, gitWindowContext({
        "git-overview branches": {ok: false, error: "git for-each-ref could not read this repository"},
        "git-overview commits": {ok: true, value: {rows: [], is_last_page: true}},
        "git-overview pulls": {ok: true, value: {available: false, rows: []}},
    }));
    expect(element.textContent).toContain("could not read this repository");
    expect(element.textContent).toContain("no commits yet");
    expect(element.textContent).toContain("read through gh");
    expect(element.querySelector(".empty-state.titled")).toBeNull();
});

test("the words for distance, checks and review are plain", () => {
    expect(distanceLine({extra_commits: 0, missing_commits: 0})).toBe("level with the base");
    expect(checksLine({checks_passed: 0, checks_failed: 0, checks_running: 0})).toBe("no checks");
    expect(checksLine(PULL)).toBe("2 passed, 1 failed");
    expect(reviewLine({draft: true})).toBe("draft");
});
