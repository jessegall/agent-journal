import {expect, test} from "vitest";
import ProjectWorktrees from "../../suites/coding/modules/workers/web/src/ProjectWorktrees.vue";
import {context, mounted, page, settle} from "./support/windowContext.js";

const WORKTREE_KEYS = {worktrees: {line: "project-worktree list"}};
const running = (answers, keys) => {
    const window = {...context(answers, null, keys), lines: []};
    window.run = async (line) => (window.lines.push(line), {ok: true});
    return window;
};

const TREES = [
    {id: "/p", folder: "/p", branch: "main", is_checkout: true, environment: "main", worker_id: null, agent_count: 1},
    {id: "/w", folder: "/w", branch: "journal/1", is_checkout: false, environment: null, worker_id: 7, agent_count: 0},
    {id: "/l", folder: "/l", branch: "left", is_checkout: false, environment: null, worker_id: null, agent_count: 0},
];

test("the worktrees window names each holder and offers removal only of a worktree nobody holds, asking first", async () => {
    const window = running({"project-worktree list": page(TREES)}, WORKTREE_KEYS);
    const element = await mounted(ProjectWorktrees, window);
    expect(element.textContent).toContain("Main checkout");
    expect(element.textContent).toContain("Worker 7");
    expect(element.textContent).toContain("No environment");
    expect(element.querySelectorAll("[data-worktree-remove]")).toHaveLength(1);
    element.querySelector("[data-worktree-remove]").click();
    await settle();
    expect(window.lines).toEqual([]);
    element.querySelector("[data-worktree-confirm]").click();
    await settle();
    expect(window.lines).toEqual([["project-worktree", "remove", "/l"]]);
});
