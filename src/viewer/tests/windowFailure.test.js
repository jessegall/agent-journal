import {createApp, h} from "vue";
import {settled} from "./settled.js";
import {expect, test} from "vitest";
import WindowHost from "../src/windows/WindowHost.vue";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";

test("a window that throws shows its error in its own pane, Retry mounts it again, and the other pane keeps working", async () => {
    let failing = true;
    const broken = {
        render: () => {
            if (failing) throw new Error("the board broke");
            return h("p", "it works now");
        },
    };
    const fine = {render: () => h("p", "other window")};
    const subscriptions = new WindowSubscriptions();
    const element = document.createElement("div");
    createApp(() => [
        h("div", {class: "left"}, h(WindowHost, {name: "a.broken", component: broken, subscriptions})),
        h("div", {class: "right"}, h(WindowHost, {name: "a.fine", component: fine, subscriptions})),
    ]).mount(element);
    await settled();
    expect(element.querySelector(".left").textContent).toContain("This window failed: the board broke");
    expect(element.querySelector(".right").textContent).toBe("other window");
    failing = false;
    [...element.querySelectorAll(".left button")].find((button) => button.textContent.includes("Retry")).click();
    await settled();
    expect(element.querySelector(".left").textContent).toContain("it works now");
    expect(element.querySelector(".right").textContent).toBe("other window");
});
