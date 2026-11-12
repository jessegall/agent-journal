import {defineComponent, h, onMounted} from "vue";
import {expect, test} from "vitest";
import {SettingNestedGroup} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

test("a nested group shows its settings while it is shown", () => {
    const group = drawnSettingComponent(SettingNestedGroup, {shown: true}, {default: () => h("p", {id: "inside"}, "A setting")});
    expect(group.element.querySelector("[data-setting-nested] #inside")).not.toBeNull();
});

test("a hidden nested group draws nothing and never mounts what is in it", () => {
    let mounted = 0;
    const Inside = defineComponent({setup() { onMounted(() => mounted++); return () => h("p", "A setting"); }});
    const group = drawnSettingComponent(SettingNestedGroup, {shown: false}, {default: () => h(Inside)});
    expect(group.element.querySelector("[data-setting-nested]")).toBeNull();
    expect(group.element.textContent).toBe("");
    expect(mounted).toBe(0);
});

test("a nested group appears when the setting it depends on is switched on", async () => {
    const group = drawnSettingComponent(SettingNestedGroup, {shown: false}, {default: () => h("p", "A setting")});
    group.state.shown = true;
    await group.settled();
    expect(group.element.textContent).toBe("A setting");
});
