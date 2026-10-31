import {createApp, defineComponent, h, nextTick} from "vue";
import {expect, test} from "vitest";
import {useRows} from "@journal/window-kit";
import {context, page} from "./support/windowContext.js";
import {WINDOW_CONTEXT} from "@journal/window-kit";

const dock = defineComponent({
    setup() {
        const {rows} = useRows("dock-item list", ["dock_item.*"]);
        return () => h("p", rows.value.map((row) => `item ${row.id}`).join(", "));
    },
});

const settle = async () => {
    for (let round = 0; round < 5; round++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve));
};

test("the dock reads its items at load and reads them again on each dock_item.* event", async () => {
    let items = [{id: 1}];
    const follows = [];
    const window = {...context({}), read: async () => page(items), follow: (patterns, callback) => follows.push({patterns, callback})};
    const element = document.createElement("div");
    const app = createApp({render: () => h(dock)});
    app.provide(WINDOW_CONTEXT, window);
    app.mount(element);
    await settle();
    expect(element.textContent).toBe("item 1");
    expect(follows[0].patterns).toEqual(["dock_item.*"]);
    items = [{id: 1}, {id: 2}];
    follows[0].callback();
    await settle();
    expect(element.textContent).toBe("item 1, item 2");
    app.unmount();
});
