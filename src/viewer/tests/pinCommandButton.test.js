import {afterEach, expect, test, vi} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import Chat from "../../core/modules/messages/web/src/Chat.vue";

vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

afterEach(() => (document.body.innerHTML = ""));

const PINS = [
    {id: 1, title: "Build the viewer", link: "! npm run build", label: "Run", created_at: "2020-03-02T10:00:00Z"},
    {id: 2, title: "The pull request", link: "https://example.test/pull/4", label: "Open", created_at: "2020-03-02T10:00:00Z"},
];

function chatWindow(main = {ok: true, value: {id: 7}}) {
    const runs = [];
    const window = {
        ...context({"message feed": page([]), "pin list": page(PINS), "agent main": main}),
        run: async (words) => {
            runs.push(words);
            return {ok: true, value: null};
        },
    };
    return {window, runs};
}

test("a pin that holds a ! command is a button, and a pin that holds an address stays a link", async () => {
    const {window} = chatWindow();
    const element = await mounted(Chat, window);
    const button = element.querySelector("[data-pin-run]");
    expect(button.textContent.trim()).toBe("Run");
    expect(button.title).toBe("! npm run build");
    expect(element.querySelectorAll("[data-pin-run]").length).toBe(1);
    expect(element.querySelector("a.pin-link").textContent.trim()).toBe("Open");
});

test("pressing the button types the command into the terminal of the main agent through the journal", async () => {
    const {window, runs} = chatWindow();
    const element = await mounted(Chat, window);
    element.querySelector("[data-pin-run]").click();
    await settle();
    expect(runs).toEqual([["agent", "type", "7", "! npm run build"]]);
});

test("pressing the button with no main agent running types nothing", async () => {
    const {window, runs} = chatWindow({ok: true, value: {id: null}});
    const element = await mounted(Chat, window);
    element.querySelector("[data-pin-run]").click();
    await settle();
    expect(runs).toEqual([]);
});
