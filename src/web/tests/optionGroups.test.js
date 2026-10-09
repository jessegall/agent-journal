import {createApp, h, nextTick} from "vue";
import {describe, expect, test} from "vitest";
import PluginSetting from "../src/pages/PluginSetting.vue";
import SettingControl from "../src/kit/SettingControl.vue";

const MODELS = ["gpt-5-codex-max", "gpt-5-codex-mini", "gpt-5.1-codex", "gpt-5.1-codex-mini", "gpt-5.2", "gpt-5.2-codex", "gpt-5.3-codex"];

async function shown(component, props) {
    const host = window.document.createElement("div");
    createApp({render: () => h(component, props)}).mount(host);
    await nextTick();
    return host;
}

const row = {kind: "choice", label: "Model", value: MODELS[0], options: MODELS.map((key) => ({key, label: key})), hint: "", example: ""};

describe("a long list of options in Settings", () => {
    test("is one segmented group that wraps onto another line, on the page and on the phone sheet, never a column of cards", async () => {
        const page = await shown(SettingControl, {row});
        const sheet = await shown(SettingControl, {row, sheet: true});
        for (const host of [page, sheet]) {
            const group = host.querySelector("[role=radiogroup]");
            expect([group.classList.contains("segmented"), group.classList.contains("wrap"), group.querySelectorAll("[role=radio]").length, host.querySelector(".choices")]).toEqual([
                true,
                true,
                7,
                null,
            ]);
        }
        expect(sheet.querySelector("[role=radiogroup]").classList.contains("fill")).toBe(true);
    });

    test("is the same for a plugin's setting", async () => {
        const setting = {key: "model", type: "options", title: "Model", help: "", value: MODELS[0], options: MODELS};
        const host = await shown(PluginSetting, {setting});
        const group = host.querySelector("[role=radiogroup]");
        expect([group.classList.contains("wrap"), group.querySelectorAll("[role=radio]").length, host.querySelector(".choices")]).toEqual([true, 7, null]);
    });
});
