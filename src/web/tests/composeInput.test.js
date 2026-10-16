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

test("the words typed follow the box when it becomes a reply, and nothing stays behind to come back after the send", async () => {
    const {ui} = await import("../src/state/ui.js");
    const props = ref({placeholder: "Message the agent"});
    const {box, unmount} = await mounted(props);
    box.value = "hello there";
    box.dispatchEvent(new Event("input"));
    await settle();
    props.value = {placeholder: "Reply to 450"};
    await settle();
    expect(box.value).toBe("hello there");
    expect(ui.drafts[":Message the agent"]).toBe(undefined);
    expect(ui.drafts[":Reply to 450"]).toBe("hello there");
    box.value = "";
    box.dispatchEvent(new Event("input"));
    await settle();
    props.value = {placeholder: "Message the agent"};
    await settle();
    unmount();
    const again = await mounted(ref({placeholder: "Message the agent"}));
    expect(again.box.value).toBe("");
    again.unmount();
});

test("the box empties after a reply, though the quote is cleared while the send is in flight", async () => {
    const props = ref({quote: "the words quoted", send: async () => {}});
    const {box, unmount} = await mounted(props);
    props.value = {
        ...props.value,
        send: async () => {
            props.value = {...props.value, quote: ""};
            await settle();
        },
    };
    await settle();
    box.value = "did you enforce this?";
    box.dispatchEvent(new Event("input"));
    await settle();
    box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true}));
    await settle();
    await settle();
    expect(box.value).toBe("");
    unmount();
});

test("words put in without an input event are read from the box on coming back to the window and before a send", async () => {
    const sent = [];
    const props = ref({send: async (text) => sent.push(text), quote: ""});
    const {box, unmount} = await mounted(props);
    box.value = "dictated words";
    window.dispatchEvent(new Event("focus"));
    await settle();
    props.value = {...props.value, quote: "a quote arriving"};
    await settle();
    expect(box.value).toBe("dictated words");
    const button = document.querySelector(".compose-send");
    button.dispatchEvent(new Event("pointerdown", {bubbles: true}));
    await settle();
    expect(button.disabled).toBe(false);
    box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true}));
    await settle();
    expect(sent).toEqual(["dictated words"]);
    unmount();
});
