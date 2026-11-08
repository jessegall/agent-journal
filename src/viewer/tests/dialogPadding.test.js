import {afterEach, expect, test} from "vitest";
import {createApp, h} from "vue";
import Dialog from "../src/kit/Dialog.vue";

const mounted = [];
afterEach(() => mounted.splice(0).forEach(({app, element}) => { app.unmount(); element.remove(); }));

function open(props) {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({setup: () => () => h(Dialog, {title: "Check", ...props}, () => h("p", {"data-content": ""}, "content"))});
    mounted.push({app, element});
    app.mount(element);
    return [...document.querySelectorAll(".dialog-body")].at(-1);
}

test("a dialog has no padding unless it asks for it", () => {
    const body = open({});
    expect(body.classList.contains("padded")).toBe(false);
    expect(body.querySelector("[data-content]")).not.toBeNull();
});

test("a dialog that asks for padding gets the padded body, and a bare dialog keeps none", () => {
    const body = open({padded: true});
    expect(body.classList.contains("padded")).toBe(true);
    const bare = open({padded: true, bare: true});
    expect(bare.classList.contains("padded")).toBe(true);
    expect(bare.classList.contains("bare")).toBe(true);
});
