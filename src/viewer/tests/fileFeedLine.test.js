import {expect, test} from "vitest";
import FileFeed from "../../suites/coding/web/src/FileFeed.vue";
import {mounted, page} from "./support/windowContext.js";
import {fileFeedWindowContext as context} from "./support/fileFeedWindowContext.js";

test("the file feed lists every edit when the window has no agent, and the agent's edits when it has one", async () => {
    const without = context({"file-edit list": page([])}, null);
    await mounted(FileFeed, without);
    expect(without.reads).toEqual(["file-edit list --limit 50", "window setting coding.file-feed view"]);
    const withAgent = context({"file-edit list": page([])}, 7);
    await mounted(FileFeed, withAgent);
    expect(withAgent.reads).toEqual(["file-edit list --agent 7 --limit 50", "window setting coding.file-feed view"]);
});
