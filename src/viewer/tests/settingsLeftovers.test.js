import {expect, test} from "vitest";
import WorkerModels from "../../suites/coding/modules/workers/web/src/WorkerModels.vue";
import ProjectWorktrees from "../../suites/coding/modules/workers/web/src/ProjectWorktrees.vue";
import {context, mounted, page, settle} from "./support/windowContext.js";

const MODEL_KEYS = {models: {line: "worker models", events: ["setting.*"]}};
const running = (answers, keys) => {
    const window = {...context(answers, null, keys), lines: []};
    window.run = async (line) => (window.lines.push(line), {ok: true});
    return window;
};

const MODELS = [
    {id: "claude haiku", program: "claude", title: "Claude", model: "haiku", allowed: false},
    {id: "claude sonnet", program: "claude", title: "Claude", model: "sonnet", allowed: true},
    {id: "claude opus", program: "claude", title: "Claude", model: "opus", allowed: true},
    {id: "codex luna", program: "codex", title: "Codex", model: "luna", allowed: true},
];

test("unticking a model saves the models left, and a program's last one cannot be unticked", async () => {
    const window = running({"worker models": page(MODELS)}, MODEL_KEYS);
    const element = await mounted(WorkerModels, window);
    expect(element.querySelector('[data-worker-model="codex luna"] input').disabled).toBe(true);
    const opus = element.querySelector('[data-worker-model="claude opus"] input');
    opus.dispatchEvent(new Event("change"));
    await settle();
    expect(window.lines).toEqual([["setting", "set", "journal.core.helpers.allowed-models", "claude sonnet,codex luna", "--project"]]);
});

test("the note says a worker runs on the model its profile names, not on a general model", async () => {
    const element = await mounted(WorkerModels, running({"worker models": page(MODELS)}, MODEL_KEYS));
    const note = element.querySelector(".worker-models-note").textContent;
    expect(note).toContain("the model its profile names");
    expect(note).not.toContain("general model");
});

const TREES = [
    {id: "/p", folder: "/p", branch: "main", is_checkout: true, environment: "main", worker_id: null, agent_count: 1},
    {id: "/w", folder: "/w", branch: "journal/1", is_checkout: false, environment: null, worker_id: 7, agent_count: 0},
    {id: "/l", folder: "/l", branch: "left", is_checkout: false, environment: null, worker_id: null, agent_count: 0},
];

test("the worktrees window names each holder and offers removal only of a worktree nobody holds, asking first", async () => {
    const window = running({"project-worktree list": page(TREES)});
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
