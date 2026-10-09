import {describe, expect, test} from "vitest";
import {textOf, boardOf, integrationsIn, isOn, keyOf, keyWords, mapped, settingsWith, signingOf, stageStatesOf, switchWords, mcpOn, fetchingOn, loginLine, loginWords, refusedKey, stateWords, statesFor, teamsOf, webhookWords, withStageState, withTeam} from "../src/domain/integrations.js";

const NOW = Date.now() / 1000;

describe("the Integrations page", () => {
    test("lists the features of the Integrations group, off unless switched on", () => {
        const features = {
            linear: {name: "linear", title: "Linear", group: "integrations", position: 10},
            plans: {name: "plans", title: "Plans", group: "agent", position: 1},
        };
        expect(integrationsIn(features).map((f) => f.name)).toEqual(["linear"]);
        expect([isOn({features: {}}, "linear"), isOn({features: {linear: true}}, "linear")]).toEqual([false, true]);
        expect([keyOf({linear: {key: "LINEAR_KEY"}}, "linear"), keyOf({}, "linear")]).toEqual(["LINEAR_KEY", ""]);
    });

    test("says plainly what the key and the state are", () => {
        expect(keyWords("Linear")).toMatchObject({label: "Key", none: "No key is picked, so Linear is not reached.", note: "The key is only for Linear, and no command can use it. Add one on the Secrets page."});
        expect(stateWords("Linear", false, null)).toBe("Off");
        expect(stateWords("Linear", true, {last_checked: NOW - 4 * 60 - 5})).toBe("Last checked 4 minutes ago");
        expect(stateWords("Linear", true, {last_checked: NOW - 5})).toBe("Last checked just now");
        expect(stateWords("Linear", true, {last_checked: NOW - 60, last_error: "timed out"})).toBe("Could not reach Linear.");
        expect(stateWords("Linear", true, {last_error: "answered 401"}, true)).toBe("Linear did not accept the key. Pick another key.");
        expect(refusedKey({key_refused: ["answered 401"]}, {last_error: "https://api.linear.app answered 401: {}"})).toBe(true);
        expect(refusedKey({key_refused: ["answered 401"]}, {last_error: "timed out"})).toBe(false);
        expect(stateWords("Linear", true, null)).toBe("Not checked yet");
    });

    test("reads the address and the search you wrote for Gmail, and nothing when none is written", () => {
        const settings = {gmail: {account: "me@gmail.com", search: "label:journal"}};
        expect([textOf(settings, "gmail", "account"), textOf(settings, "gmail", "search"), textOf({}, "gmail", "search")]).toEqual(["me@gmail.com", "label:journal", ""]);
    });

    test("reads the board and the teams you chose, and says plainly when syncing is paused", () => {
        const settings = {linear: {board: 3, teams: "t1,t2"}};
        expect([boardOf(settings, "linear"), teamsOf(settings, "linear"), boardOf({}, "linear"), teamsOf({}, "linear")]).toEqual([3, ["t1", "t2"], 0, []]);
        expect([withTeam(["t1"], "t2", true), withTeam(["t1", "t2"], "t1", false), withTeam(["t1"], "t1", true)]).toEqual(["t1,t2", "t2", "t1"]);
        expect(stateWords("Linear", true, {paused_until: NOW + 600})).toMatch(/^Paused until .*Linear's request limit is nearly used$/);
    });

    test("saving one setting sends the others with it, as the server replaces what a feature kept", () => {
        expect(settingsWith({linear: {key: "LINEAR_KEY", board: 2}}, "linear", {board: 5})).toEqual({linear: {key: "LINEAR_KEY", board: 5}});
        expect(settingsWith({}, "linear", {key: "K"})).toEqual({linear: {key: "K"}});
    });

    test("maps each stage to a Linear state and only then allows sending status changes", () => {
        const settings = {linear: {stage_states: {Doing: "s1"}}};
        expect([mapped(settings, "linear"), mapped({}, "linear"), mapped({linear: {stage_states: {Doing: ""}}}, "linear")]).toEqual([true, false, false]);
        expect(withStageState(settings, "linear", "Done", "s2")).toEqual({Doing: "s1", Done: "s2"});
        expect(stageStatesOf({}, "linear")).toEqual({});
        const states = [{id: "s1", name: "Todo", team: "t1"}, {id: "s2", name: "Done", team: "t2"}];
        expect(statesFor(states, ["t1"])).toEqual([{value: "s1", label: "Todo"}]);
        expect(statesFor(states, []).length).toBe(2);
    });

    test("says what the webhook needs and where to paste its address", () => {
        expect(webhookWords("Linear")).toMatchObject({label: "Webhook signing secret", address: "Paste this address into Linear's webhook settings"});
        expect([signingOf({linear: {signing_key: "LINEAR_SIGNING"}}, "linear"), signingOf({}, "linear")]).toEqual(["LINEAR_SIGNING", ""]);
    });

    test("offers the two switches, the direct-use one off and fetching one off until you turn it on", () => {
        expect(switchWords("Linear")).toMatchObject({mcp: "Agents can use Linear directly", fetching: "Read Linear into tickets"});
        expect(switchWords("Linear").mcpHelp).toContain("not marked as untrusted");
        expect([mcpOn({}, "linear"), mcpOn({linear: {use_mcp: true}}, "linear"), fetchingOn({}, "linear"), fetchingOn({linear: {fetching: true}}, "linear")]).toEqual([false, true, false, true]);
    });

    test("says what Log in does", () => {
        expect(loginWords("Linear")).toMatchObject({button: "Log in"});
        expect(loginWords("Linear").label).toBe("Log in to Linear");
        expect(loginLine("Linear", null)).toBe("Not logged in to Linear.");
        expect(loginLine("Linear", {logged_in_at: NOW - 125})).toBe("Logged in to Linear 2 minutes ago.");
    });
});
