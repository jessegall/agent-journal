import {expect, test} from "vitest";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {TURN_FOLDS, turnFold} from "../src/domain/turnFolds.js";

test("a worker's report folds after its first two lines, while the user's and the agent's messages keep their room", () => {
    const report = {who: "agent", text: "Hedy reports: done\nline\nline\nline", data: {kind: "report", worker: "Hedy"}};
    const said = {who: "agent", text: "a long answer", data: {}};
    const asked = {who: "user", text: "a long question", data: {}};
    expect(turnFold(report)).toBe(TURN_FOLDS.report);
    expect(TURN_FOLDS.report.keep).toBeLessThan(50);
    expect([turnFold(said), turnFold(asked)]).toEqual([TURN_FOLDS.message, TURN_FOLDS.message]);
    const message = readFileSync(resolve(__dirname, "../src/chat/TurnMessage.vue"), "utf8");
    expect(message).toMatch(/:fold-at="fold\.at" :keep="fold\.keep"/);
});
