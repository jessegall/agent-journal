import {createApp, h, nextTick} from "vue";
import {describe, expect, test} from "vitest";
import PluginCard from "../src/pages/PluginCard.vue";
import PluginInstallDialog from "../src/pages/PluginInstallDialog.vue";
import PluginSetting from "../src/pages/PluginSetting.vue";
import {pluginFrom} from "../src/composables/plugins.js";

const ROW = {
    n: 3,
    title: "Echo",
    abstract: "Answers what it hears, for the tests.",
    state: "failing",
    data: {
        manifest: {name: "echo", settings: {repeat: {title: "Repeat", type: "number", default: 1}, token: {title: "Token", type: "secret"}}, dashboards: []},
        version: "1.0.0",
        source: "/plugins/echo",
        commit: "",
        enabled: true,
        holds: ["tool_starting", "prompt_submitted"],
        last_fault: "its answer is not JSON",
        failing_since: Date.now() / 1000 - 120,
        settings: {chosen: {repeat: 3, token: "secret 7"}},
    },
};

async function mounted(component, props) {
    const into = document.createElement("div");
    document.body.appendChild(into);
    const app = createApp({render: () => h(component, props)});
    app.directive("tip", {});
    app.mount(into);
    await nextTick();
    return document.body;
}

describe("the Plugins page", () => {
    test("a plugin's card says it is failing, why, and what it holds", async () => {
        const page = await mounted(PluginCard, {plugin: pluginFrom(ROW)});
        const text = page.textContent;
        expect(text).toContain("Echo");
        expect(text).toContain("Failing since 2m ago, so events go through without it: its answer is not JSON");
        expect([...page.querySelectorAll(".held")].map((e) => e.textContent)).toEqual(["tool_starting", "prompt_submitted"]);
        page.innerHTML = "";
    });

    test("the install preview lists each thing the plugin would run, hear and hold", async () => {
        const previewed = {
            name: "echo",
            title: "Echo",
            source: "/plugins/echo",
            commit: "",
            description: "",
            rows: [
                {kind: "program", label: "for each event it hears", command: "/plugins/echo/run.py"},
                {kind: "holds", label: "before the agent goes on", command: "tool_starting"},
            ],
        };
        const page = await mounted(PluginInstallDialog, {previewed});
        const kinds = [...page.querySelectorAll(".preview-kind")].map((e) => e.textContent);
        expect(kinds).toEqual(["Runs", "Can hold"]);
        expect(page.textContent).toContain("/plugins/echo/run.py");
        page.innerHTML = "";
    });

    test("a setting is a field under its label, and a secret one leads to the Secrets page", async () => {
        const [repeat, token] = pluginFrom(ROW).settings;
        const number = await mounted(PluginSetting, {setting: repeat});
        expect(number.querySelector("input").value).toBe("3");
        number.innerHTML = "";
        const secret = await mounted(PluginSetting, {setting: token});
        expect(secret.textContent).toContain("Kept as secret 7.");
        expect(secret.querySelector("a").getAttribute("href")).toBe("#/secrets");
        secret.innerHTML = "";
    });
});
