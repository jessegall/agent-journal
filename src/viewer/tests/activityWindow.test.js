import {expect, test, vi} from "vitest";
import {mounted, page, settle} from "./support/windowContext.js";
import {activityWindowContext} from "./support/activityWindowContext.js";
import HookCallList from "../../core/modules/drivers/web/src/HookCallList.vue";

const CALL = {id: 9, hook: "pre_tool_use", tool: "Edit", summary: "src/cart.py", answer: "refused", refusal: "start a task first"};

test("activity reads its selected agent through one key and shows stop checks", async () => {
    const window = activityWindowContext({"hook-call feed": page([{...CALL, stop_checks: [{rule: "tasks", outcome: "refused", reason: "finish the task", applied: true}]}])}, 7);
    const requests = vi.spyOn(window, "readKeys");
    const element = await mounted(HookCallList, window);
    expect(requests).toHaveBeenCalledTimes(1);
    expect(window.reads).toEqual(["hook-call feed --session-agent-id 7 --limit 50"]);
    expect(element.querySelector("[data-stop-checks]").textContent).toContain("finish the task");
    expect(element.textContent).toContain("start a task first");
});

test("a created call reads only newer rows and retains the previous calls", async () => {
    const window = activityWindowContext({"hook-call feed": page([CALL])});
    const read = window.read;
    window.read = async (line) => line.includes("--after-id 9") ? page([{...CALL, id: 10, summary: "src/tax.py"}]) : read(line);
    let heard;
    window.follow = (_, listener) => (heard = listener);
    const element = await mounted(HookCallList, window);
    heard({event: "hook_call.create", row_id: 10});
    await settle();
    expect(element.textContent).toContain("src/cart.py");
    expect(element.textContent).toContain("src/tax.py");
});
