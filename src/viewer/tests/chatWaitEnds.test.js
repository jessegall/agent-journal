import {expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import Chat from "../../core/modules/messages/web/src/Chat.vue";

test("the status line of the chat goes back to waiting once a followed call shows the wait it named has ended", async () => {
    const tool = {ok: true, value: {tool: "", wait_target: "release v7.18.14 build"}};
    const heard = [];
    const window_ = {...context({"message feed": page([]), "usage tool": tool}), follow: (_, listener) => {
        heard.push(listener);
        return () => {};
    }};
    const element = await mounted(Chat, window_);
    expect(element.querySelector("[data-running-command]").textContent).toBe("waiting for release v7.18.14 build");
    tool.value = {tool: "", wait_target: ""};
    await Promise.all(heard.map((listener) => listener({event: "hook_call.create", row_id: 9})));
    await settle();
    expect(element.querySelector("[data-running-command]").textContent).toBe("waiting");
});
