import {expect, test} from "vitest";
import {createApp, h, nextTick, ref} from "vue";

const settle = async () => {
    for (let i = 0; i < 4; i++) await nextTick();
};

async function mounted(props = {}) {
    const {default: Compose} = await import("../src/chat/Compose.vue");
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(Compose, {send: () => {}, ...props.value})});
    app.mount(host);
    await settle();
    return {box: host.querySelector("textarea"), unmount: () => (app.unmount(), host.remove())};
}

function paste(box, {text = "", files = []}) {
    const event = new Event("paste", {bubbles: true, cancelable: true});
    event.clipboardData = {files, getData: (kind) => (kind === "text/plain" ? text : "")};
    box.dispatchEvent(event);
    return event;
}

test("a paste that carries text beside a picture of it lands as text, and a picture alone is attached", async () => {
    const {box, unmount} = await mounted();
    const picture = new File(["png"], "image.png", {type: "image/png"});
    expect(paste(box, {text: "a row from a sheet", files: [picture]}).defaultPrevented).toBe(false);
    expect(paste(box, {files: [picture]}).defaultPrevented).toBe(true);
    unmount();
});

test("leaving an edit clears only the words it put in the box, never words typed while it was saved", async () => {
    const props = ref({preset: ""});
    const {box, unmount} = await mounted(props);
    props.value = {preset: "the old message"};
    await settle();
    expect(box.value).toBe("the old message");
    box.value = "a new thought";
    box.dispatchEvent(new Event("input"));
    props.value = {preset: ""};
    await settle();
    expect(box.value).toBe("a new thought");
    unmount();
});
