import {expect, test} from "vitest";
import HookCallList from "../../core/modules/drivers/web/src/HookCallList.vue";
import {mounted, page, settle} from "./support/windowContext.js";
import {activityWindowContext} from "./support/activityWindowContext.js";

test.each(["prompt", "stop_allowed", "stop_refused", "compact", "session_start"])("the activity window refreshes on hook_call.%s", async (change) => {
    const answers = {"hook-call feed": page([])};
    const window = activityWindowContext(answers, 2);
    const follows = [];
    window.follow = (patterns, heard) => follows.push({patterns, heard});
    const element = await mounted(HookCallList, window);
    answers["hook-call feed"] = page([{id: 9, hook: change, tool: "", summary: "A newly recorded hook", answer: "allowed", refusal: ""}]);
    for (const follow of follows.filter(({patterns}) => patterns.includes("hook_call.*") || patterns.includes(`hook_call.${change}`))) {
        await follow.heard({event: `hook_call.${change}`, row_id: 9});
    }
    await settle();
    expect(element.textContent).toContain("A newly recorded hook");
});
