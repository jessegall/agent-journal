import {describe, expect, test} from "vitest";
import {tunnelState} from "../src/domain/tunnelState.js";

const fine = {problems: []};
const broken = {problems: ["tunler is not installed"]};
const share = [{n: 1}];

describe("what the sharing pill says", () => {
    test.each([
        ["a problem wins over everything", broken, share, share, {state: "ready"}, "down", "Not connected"],
        ["nothing shared and nothing waiting", fine, [], [], undefined, "idle", "Nothing shared"],
        ["no status yet is not a problem", null, [], [], undefined, "idle", "Nothing shared"],
        ["only a share waiting for approval", fine, [], share, undefined, "waiting", "Waiting for you"],
        ["an open share and no tunnel service yet", fine, share, [], undefined, "starting", "Starting"],
        ["a tunnel that is ready", fine, share, [], {state: "ready"}, "up", "Open"],
        ["a tunnel that is starting", fine, share, [], {state: "starting"}, "starting", "Starting"],
        ["a tunnel that stopped says why", fine, share, [], {state: "failed", why: "port in use"}, "down", "port in use"],
        ["a tunnel that stopped without a reason", fine, share, [], {state: "failed"}, "down", "Not running"],
        ["an open share beside a waiting one still follows the tunnel", fine, share, share, {state: "ready"}, "up", "Open"],
    ])("%s", (_, status, open, waiting, service, key, word) => {
        expect(tunnelState(status, open, waiting, service)).toEqual({key, word});
    });
});
