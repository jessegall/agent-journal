import {afterEach, expect, test} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {context, page, settle} from "./support/windowContext.js";
import Chat from "../../core/modules/messages/web/src/Chat.vue";

const FEED = {"message feed": page([])};
let app;
let host;

afterEach(() => {
    app?.unmount();
    host?.remove();
});

// the chat drawn into the document, since only an element in the document can hold the focus
async function chat(upload) {
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(Chat)});
    app.provide(WINDOW_CONTEXT, {...context(FEED), upload});
    app.mount(host);
    await settle();
    return {box: host.querySelector(".composer-input"), attach: host.querySelector("[data-attach]"), picker: host.querySelector("[data-file-input]")};
}

const uploaded = async () => ({ok: true, value: "stored/notes.txt"});
const refused = async () => ({ok: false, error: "too large"});

async function pick(picker, name = "notes.txt") {
    Object.defineProperty(picker, "files", {configurable: true, value: [new File(["notes"], name)]});
    picker.dispatchEvent(new Event("change"));
    await settle();
}

test("after a file is picked and attached, the composer holds the focus", async () => {
    const {box, attach, picker} = await chat(uploaded);
    attach.focus();
    await pick(picker);
    expect(host.querySelector("[data-attached]").textContent).toContain("notes.txt");
    expect(document.activeElement).toBe(box);
});

test("the composer takes the focus back from the attach button, which the file dialog leaves it on", async () => {
    const {box, attach, picker} = await chat(async () => {
        attach.focus();
        return uploaded();
    });
    await pick(picker);
    expect(document.activeElement).toBe(box);
});

test("after a file that could not be attached, the composer holds the focus as well", async () => {
    const {box, attach, picker} = await chat(refused);
    attach.focus();
    await pick(picker);
    expect(host.querySelector("[data-attached]").textContent).toContain("notes.txt");
    expect(document.activeElement).toBe(box);
});

test("after a file is dropped on the composer, the composer holds the focus", async () => {
    const {box, attach} = await chat(uploaded);
    attach.focus();
    const drop = new Event("drop", {bubbles: true, cancelable: true});
    drop.dataTransfer = {files: [new File(["notes"], "notes.txt")]};
    host.querySelector(".composer").dispatchEvent(drop);
    await settle();
    expect(document.activeElement).toBe(box);
});
