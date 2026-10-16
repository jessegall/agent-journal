import {expect, test} from "vitest";
import {createApp, h, nextTick, reactive, ref} from "vue";

const settle = async () => {
    for (let i = 0; i < 4; i++) await nextTick();
};

async function mounted(props) {
    const {default: Compose} = await import("../src/chat/Compose.vue");
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(Compose, props.value)});
    app.mount(host);
    await settle();
    return {box: host.querySelector("textarea"), unmount: () => (app.unmount(), host.remove())};
}

let boxes = 0;

async function scene() {
    const sent = [];
    const props = ref({placeholder: `Stress box ${++boxes}`, quote: "", send: async (text) => void sent.push(text)});
    const opened = await mounted(props);
    const s = {sent, props, box: opened.box, close: opened.unmount};
    s.reopen = async () => {
        s.close();
        await settle();
        const again = await mounted(props);
        s.box = again.box;
        s.close = again.unmount;
    };
    return s;
}

function pasteEvent(box, text) {
    const event = new Event("paste", {bubbles: true, cancelable: true});
    event.clipboardData = {files: [], getData: (kind) => (kind === "text/plain" ? text : "")};
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

const WORDS = "please check the failing migration before the release";

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
    "a quote arrives and leaves, redrawing the box": async (s) => {
        s.props.value = {...s.props.value, quote: "a quote arriving"};
        await settle();
        s.props.value = {...s.props.value, quote: ""};
        await settle();
    },
    "the box is taken off the page and put back with the same placeholder": async (s) => {
        await s.reopen();
    },
};

async function sendByEnter(s) {
    s.box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true}));
    await settle();
    await settle();
}

async function sendByClick(s) {
    const button = s.box.closest("form").querySelector(".compose-send");
    button.dispatchEvent(new Event("pointerdown", {bubbles: true}));
    await settle();
    button.click();
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
            s.close();
        });
    }

    test(`words ${how} are sent whole by Enter and leave the box empty`, async () => {
        const s = await scene();
        await put(s, WORDS);
        expect(s.box.value).toBe(WORDS);
        await sendByEnter(s);
        sentExactly(s, WORDS);
        s.close();
    });

    test(`words ${how} are sent whole by a click on the send button and leave the box empty`, async () => {
        const s = await scene();
        await put(s, WORDS);
        expect(s.box.value).toBe(WORDS);
        await sendByClick(s);
        sentExactly(s, WORDS);
        s.close();
    });
}

test("a long mix of typing, pasting, dictation and disturbances keeps every word and sends each round whole", async () => {
    const s = await scene();
    const [typing, pasting, dictating] = Object.values(INPUTS);
    const [blurring, hiding, quoting, remounting] = Object.values(DISTURBANCES);

    await typing(s, "first");
    await blurring(s);
    await pasting(s, "first second");
    await quoting(s);
    await dictating(s, "first second third");
    await hiding(s);
    await remounting(s);
    expect(s.box.value).toBe("first second third");
    await typing(s, "first second third fourth");
    await dictating(s, "first second third fourth fifth");
    await blurring(s);
    await quoting(s);
    await remounting(s);
    await hiding(s);
    expect(s.box.value).toBe("first second third fourth fifth");
    await sendByClick(s);
    sentExactly(s, "first second third fourth fifth");

    await dictating(s, "round two");
    await quoting(s);
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
    s.close();
});

// Wispr Flow puts dictated words in as a simulated Cmd-V into the focused field: the clipboard is replaced, the key sent, the page sees
// the paste path (paste, beforeinput and input with insertFromPaste), and nothing is inserted when no field is focused
function dictatedPaste(text) {
    const el = document.activeElement;
    if (!el || el === document.body) return false;
    el.dispatchEvent(new KeyboardEvent("keydown", {key: "v", code: "KeyV", metaKey: true, bubbles: true, cancelable: true}));
    const paste = new Event("paste", {bubbles: true, cancelable: true});
    paste.clipboardData = {files: [], getData: (kind) => (kind === "text/plain" ? text : "")};
    if (!el.dispatchEvent(paste)) return true;
    const start = el.selectionStart;
    el.setRangeText(text, start, el.selectionEnd, "end");
    el.dispatchEvent(new InputEvent("input", {inputType: "insertFromPaste", bubbles: true}));
    el.dispatchEvent(new KeyboardEvent("keyup", {key: "v", code: "KeyV", metaKey: true, bubbles: true}));
    return true;
}

test("after coming back to the window with nothing focused, dictation pasted into the focused field lands in the box", async () => {
    const sent = [];
    const props = ref({send: async (text) => sent.push(text)});
    const {box, unmount} = await mounted(props);
    box.focus();
    expect(dictatedPaste("first words")).toBe(true);
    await settle();
    expect(box.value).toBe("first words");
    box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true}));
    await settle();
    expect(sent).toEqual(["first words"]);
    box.blur();
    window.dispatchEvent(new Event("blur"));
    expect(document.activeElement).toBe(document.body);
    window.dispatchEvent(new Event("focus"));
    await settle();
    expect(document.activeElement).toBe(box);
    expect(dictatedPaste("second words after the tab")).toBe(true);
    await settle();
    expect(box.value).toBe("second words after the tab");
    box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true}));
    await settle();
    expect(sent).toEqual(["first words", "second words after the tab"]);
    unmount();
});

// Wispr Flow replaces the clipboard, sends a simulated Cmd-V and restores the clipboard half a second later: the page sees the paste, the
// value set, and an input event of insertFromPaste, or the value set with no event at all
function wisprPaste(box, text, withInput) {
    pasteEvent(box, text);
    box.value = text;
    if (withInput) box.dispatchEvent(new InputEvent("input", {inputType: "insertFromPaste", bubbles: true}));
}

const clipboardRestored = () => new Promise((done) => setTimeout(done, 500));

async function waitingScene() {
    const sent = [];
    const waiting = reactive({helping: true, items: Array.from({length: 6}, () => ({reported: false}))});
    const props = ref({placeholder: `Stress box ${++boxes}`, waiting, send: async (text) => void sent.push(text)});
    const opened = await mounted(props);
    opened.box.focus();
    return {sent, waiting, box: opened.box, close: opened.unmount};
}

// a helper reporting redraws the waiting edge alone, and with it the box drawn in its slot
async function helperReports(s) {
    s.waiting.items.find((item) => !item.reported).reported = true;
    await settle();
}

async function dictated(s, text, withInput) {
    wisprPaste(s.box, text, withInput);
    await settle();
    await helperReports(s);
    await clipboardRestored();
    await helperReports(s);
}

for (const [how, withInput] of Object.entries({"with an input event": true, "with no event": false})) {
    for (const [by, send] of Object.entries({Enter: sendByEnter, "a click on the send button": sendByClick})) {
        test(`words Wispr Flow pastes ${how} stay in the box while the waiting edge redraws it and are sent whole by ${by}`, async () => {
            const s = await waitingScene();
            await dictated(s, WORDS, withInput);
            expect(s.box.value).toBe(WORDS);
            await send(s);
            sentExactly(s, WORDS);
            s.close();
        });
    }
}

test("the same words dictated again after a send are taken from the box and sent again", async () => {
    const s = await waitingScene();
    await dictated(s, "yes", true);
    await sendByEnter(s);
    await dictated(s, "yes", false);
    expect(s.box.value).toBe("yes");
    await sendByEnter(s);
    sentExactly(s, "yes", "yes");
    s.close();
});
