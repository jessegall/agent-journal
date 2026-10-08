import {describe, expect, test} from "vitest";
import {integrationsIn, isOn, keyOf, keyWords, stateWords} from "../src/domain/integrations.js";

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
        expect(keyWords("Linear")).toMatchObject({label: "Key", none: "No key is picked, so Linear is not reached.", note: "Add one on the Secrets page."});
        expect(stateWords("Linear", false, null)).toBe("Off");
        expect(stateWords("Linear", true, {last_checked: NOW - 4 * 60 - 5})).toBe("Last checked 4 minutes ago");
        expect(stateWords("Linear", true, {last_checked: NOW - 5})).toBe("Last checked just now");
        expect(stateWords("Linear", true, {last_checked: NOW - 60, last_error: "the key was refused"})).toBe("Could not reach Linear: the key was refused");
        expect(stateWords("Linear", true, null)).toBe("Not checked yet");
    });
});
