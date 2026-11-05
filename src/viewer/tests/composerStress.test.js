import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test} from "vitest";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {context, page, settle} from "./support/windowContext.js";
import Chat from "../../core/modules/messages/web/src/Chat.vue";
import {pasteByHand} from "../src/platform/pasteByHand.js";

// Miss Hopper's stress cases of version 4's composeStress.test.js, on version 5's chat box: words typed, pasted and put in with no event at all,
// as dictation does, are kept across blur, focus, a page hidden and shown, a redraw of the box and the box taken off the page and put back, and are
// sent whole by Enter and by a click on the button. Real Wispr Flow is not used: its paste is played by dictatedPaste below.
const MESSAGE = {id: 1, type: "agent", text: "An earlier message", created_at: "2026-11-02T10:00:00Z"};
const WORDS = "please check the failing migration before the release";
const hosts = [];
const apps = [];

beforeEach(() => {
    localStorage.clear();
    pasteByHand(window);
});
afterEach(() => {
    apps.splice(0).forEach((app) => app.unmount());
    hosts.splice(0).forEach((host) => host.remove());
    document.body.focus();
});

// a chat on one window context, which keeps the lines it ran and the listeners it was given, so that a test can send, redraw and mount it again
function newStory() {
    const sent = [];
    const listeners = [];
    const feed = {"message feed": page([MESSAGE])};
    const window_ = {
        ...context(feed),
        follow: (...parts) => listeners.push(parts[parts.length - 1]),
        run: async (line) => (line[1] === "send" && sent.push(line[2]), {ok: true, value: {}}),
    };
    const story = {sent, listeners, feed};
    story.mount = async () => {
        const host = document.createElement("div");
        document.body.append(host);
        const app = createApp({render: () => h(Chat)});
        app.provide(WINDOW_CONTEXT, window_);
        app.mount(host);
        hosts.push(host);
        apps.push(app);
        await settle();
        story.host = host;
        story.app = app;
        story.box = host.querySelector(".composer-input");
    };
    story.remount = async () => {
        story.app.unmount();
        apps.splice(apps.indexOf(story.app), 1);
        story.host.remove();
        await settle();
        await story.mount();
    };
    return story;
}

async function scene() {
    const story = newStory();
    await story.mount();
    return story;
}

function pasteEvent(box, text) {
    const event = new Event("paste", {bubbles: true, cancelable: true});
    event.clipboardData = {files: [], getData: (type) => (type === "text/plain" ? text : "")};
    box.dispatchEvent(event);
}

const input = (box) => box.dispatchEvent(new Event("input", {bubbles: true}));

const INPUTS = {
    "typed with input events": async (s, words) => {
        for (let end = 3; end < words.length; end += 5) {
            s.box.value = words.slice(0, end);
            input(s.box);
        }
        s.box.value = words;
        input(s.box);
        await settle();
    },
    pasted: async (s, words) => {
        pasteEvent(s.box, words);
        s.box.value = words;
        input(s.box);
        await settle();
    },
    "put in with no event, as dictation does": async (s, words) => {
        s.box.value = words;
    },
};

const DISTURBANCES = {
    "the window loses focus and gets it back": async () => {
        window.dispatchEvent(new Event("blur"));
        await settle();
        window.dispatchEvent(new Event("focus"));
        await settle();
    },
    "the page is hidden and shown again": async () => {
        document.dispatchEvent(new Event("visibilitychange"));
        await settle();
        document.dispatchEvent(new Event("visibilitychange"));
        await settle();
    },
    "a reply starts and is left, redrawing the box": async (s) => {
        s.host.querySelector('[data-message-action="reply"]').click();
        await settle();
        s.host.querySelector(".composer-quote-drop").click();
        await settle();
    },
    "the box is taken off the page and put back": async (s) => {
        await s.remount();
    },
};

async function sendByEnter(s) {
    s.box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true, cancelable: true}));
    await settle();
    await settle();
}

async function sendByClick(s) {
    s.host.querySelector(".composer-send").dispatchEvent(new Event("pointerdown", {bubbles: true}));
    await settle();
    s.host.querySelector("[data-send]").click();
    await settle();
    await settle();
}

function sentExactly(s, ...texts) {
    expect(s.sent).toEqual(texts);
    expect(s.box.value).toBe("");
}

for (const [how, put] of Object.entries(INPUTS)) {
    for (const [what, disturb] of Object.entries(DISTURBANCES)) {
        test(`words ${how} are still in the box and are sent whole when ${what}`, async () => {
            const s = await scene();
            await put(s, WORDS);
            await disturb(s);
            expect(s.box.value).toBe(WORDS);
            await sendByEnter(s);
            sentExactly(s, WORDS);
        });
    }

    test(`words ${how} are sent whole by Enter and leave the box empty`, async () => {
        const s = await scene();
        await put(s, WORDS);
        expect(s.box.value).toBe(WORDS);
        await sendByEnter(s);
        sentExactly(s, WORDS);
    });

    test(`words ${how} are sent whole by a click on the send button and leave the box empty`, async () => {
        const s = await scene();
        await put(s, WORDS);
        expect(s.box.value).toBe(WORDS);
        await sendByClick(s);
        sentExactly(s, WORDS);
    });
}

test("a long mix of typing, pasting, dictation and disturbances keeps every word and sends each round whole", async () => {
    const s = await scene();
    const [typing, pasting, dictating] = Object.values(INPUTS);
    const [blurring, hiding, replying, remounting] = Object.values(DISTURBANCES);

    await typing(s, "first");
    await blurring(s);
    await pasting(s, "first second");
    await replying(s);
    await dictating(s, "first second third");
    await hiding(s);
    await remounting(s);
    expect(s.box.value).toBe("first second third");
    await typing(s, "first second third fourth");
    await dictating(s, "first second third fourth fifth");
    await blurring(s);
    await replying(s);
    await remounting(s);
    await hiding(s);
    expect(s.box.value).toBe("first second third fourth fifth");
    await sendByClick(s);
    sentExactly(s, "first second third fourth fifth");

    await dictating(s, "round two");
    await replying(s);
    await pasting(s, "round two again");
    await remounting(s);
    await dictating(s, "round two again and more");
    await blurring(s);
    expect(s.box.value).toBe("round two again and more");
    await sendByEnter(s);
    sentExactly(s, "first second third fourth fifth", "round two again and more");

    await dictating(s, "round three");
    await hiding(s);
    await remounting(s);
    expect(s.box.value).toBe("round three");
    await sendByClick(s);
    sentExactly(s, "first second third fourth fifth", "round two again and more", "round three");
});

// Wispr Flow puts dictated words in as a simulated Cmd-V into the focused field: the clipboard is replaced, the key sent, the page sees
// the paste path (paste, beforeinput and input with insertFromPaste), and nothing is inserted when no field is focused
function dictatedPaste(text) {
    const el = document.activeElement;
    if (!el || el === document.body) return false;
    el.dispatchEvent(new KeyboardEvent("keydown", {key: "v", code: "KeyV", metaKey: true, bubbles: true, cancelable: true}));
    const paste = new Event("paste", {bubbles: true, cancelable: true});
    paste.clipboardData = {files: [], getData: (type) => (type === "text/plain" ? text : "")};
    if (!el.dispatchEvent(paste)) return true;
    el.setRangeText(text, el.selectionStart, el.selectionEnd, "end");
    el.dispatchEvent(new InputEvent("input", {inputType: "insertFromPaste", bubbles: true}));
    el.dispatchEvent(new KeyboardEvent("keyup", {key: "v", code: "KeyV", metaKey: true, bubbles: true}));
    return true;
}

test("after coming back to the window with nothing focused, dictation pasted into the focused field lands in the box", async () => {
    const s = await scene();
    s.box.focus();
    expect(dictatedPaste("first words")).toBe(true);
    await settle();
    expect(s.box.value).toBe("first words");
    await sendByEnter(s);
    expect(s.sent).toEqual(["first words"]);
    s.box.blur();
    window.dispatchEvent(new Event("blur"));
    expect(document.activeElement).toBe(document.body);
    window.dispatchEvent(new Event("focus"));
    await settle();
    expect(document.activeElement).toBe(s.box);
    expect(dictatedPaste("second words after the tab")).toBe(true);
    await settle();
    expect(s.box.value).toBe("second words after the tab");
    await sendByEnter(s);
    expect(s.sent).toEqual(["first words", "second words after the tab"]);
});

// Wispr Flow replaces the clipboard, sends a simulated Cmd-V and restores the clipboard half a second later: the page sees the paste, the
// value set, and an input event of insertFromPaste, or the value set with no event at all
function wisprPaste(box, text, withInput) {
    pasteEvent(box, text);
    box.value = text;
    if (withInput) box.dispatchEvent(new InputEvent("input", {inputType: "insertFromPaste", bubbles: true}));
}

const clipboardRestored = () => new Promise((done) => setTimeout(done, 500));
let arrivals = 1;

// the chat redrawn around the box, as a helper reporting or a message arriving does
async function redrawn(s) {
    arrivals += 1;
    s.feed["message feed"] = page([MESSAGE, {id: arrivals, type: "agent", text: `Report ${arrivals}`, created_at: "2026-11-02T10:00:00Z"}]);
    s.listeners.forEach((listener) => listener({event: "message.create", row_id: arrivals}));
    await settle();
}

async function dictated(s, text, withInput) {
    wisprPaste(s.box, text, withInput);
    await settle();
    await redrawn(s);
    await clipboardRestored();
    await redrawn(s);
}

for (const [how, withInput] of Object.entries({"with an input event": true, "with no event": false})) {
    for (const [by, send] of Object.entries({Enter: sendByEnter, "a click on the send button": sendByClick})) {
        test(`words Wispr Flow pastes ${how} stay in the box while the chat redraws it and are sent whole by ${by}`, async () => {
            const s = await scene();
            s.box.focus();
            await dictated(s, WORDS, withInput);
            expect(s.box.value).toBe(WORDS);
            await send(s);
            sentExactly(s, WORDS);
        });
    }
}

test("the same words dictated again after a send are taken from the box and sent again", async () => {
    const s = await scene();
    s.box.focus();
    await dictated(s, "yes", true);
    await sendByEnter(s);
    await dictated(s, "yes", false);
    expect(s.box.value).toBe("yes");
    await sendByEnter(s);
    sentExactly(s, "yes", "yes");
});
