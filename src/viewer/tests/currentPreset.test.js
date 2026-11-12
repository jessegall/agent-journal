import {expect, test} from "vitest";
import {currentPreset} from "@journal/setting-components";

const PRESETS = [
    {key: "builder", values: {auto: true, writes: true, delegates: false}},
    {key: "orchestrator", values: {auto: false, writes: false, delegates: true}},
];

test("a form that matches every value of a preset is that preset", () => {
    expect(currentPreset({auto: true, writes: true, delegates: false}, PRESETS)).toBe("builder");
    expect(currentPreset({auto: false, writes: false, delegates: true}, PRESETS)).toBe("orchestrator");
});

test("a form that differs from a preset in one switch is custom", () => {
    expect(currentPreset({auto: true, writes: true, delegates: true}, PRESETS)).toBe("custom");
    expect(currentPreset({auto: false, writes: false, delegates: false}, PRESETS)).toBe("custom");
});

test("a switch the form does not hold yet is not a match", () => {
    expect(currentPreset({auto: true, writes: true}, PRESETS)).toBe("custom");
});
