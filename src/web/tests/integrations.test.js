import {describe, expect, test} from "vitest";
import {boardOf, integrationsIn, isOn, keyOf, keyWords, mapped, settingsWith, signingOf, stageStatesOf, switchWords, mcpOn, fetchingOn, loginWords, stateWords, statesFor, teamsOf, webhookWords, withStageState, withTeam} from "../src/domain/integrations.js";

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
        expect(stateWords("Linear", true, {last_checked: NOW - 60, last_error: "the key was refused"})).toBe("Could not reach Linear: the key was refused");
        expect(stateWords("Linear", true, null)).toBe("Not checked yet");
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

    test("offers the two switches, the MCP server one off and fetching one on until you change them", () => {
        expect(switchWords("Linear")).toMatchObject({mcp: "Agents use Linear through its MCP server", fetching: "The journal fetches Linear into tickets"});
        expect(switchWords("Linear").mcpHelp).toContain("not marked untrusted");
        expect([mcpOn({}, "linear"), mcpOn({linear: {use_mcp: true}}, "linear"), fetchingOn({}, "linear"), fetchingOn({linear: {fetching: false}}, "linear")]).toEqual([false, true, true, false]);
    });

    test("says what Log in does", () => {
        expect(loginWords("Linear")).toMatchObject({button: "Log in"});
        expect(loginWords("Linear").line).toContain("Linear's own sign-in in your browser");
    });
});
