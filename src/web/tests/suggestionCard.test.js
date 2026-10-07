import {createApp, nextTick} from "vue";
import {beforeEach, describe, expect, test, vi} from "vitest";
import SuggestionCard from "../src/chat/SuggestionCard.vue";
import {NO, YES} from "../src/domain/suggestions.js";

const flush = async () => {
    for (let i = 0; i < 5; i++) await nextTick();
};

const plugin = (data = {}, row = {}) => ({
    n: 41,
    title: "Install the Code Commandments plugin",
    brief: "This project has Python.\n\nIt runs as you, with your files and your network. These are its commands:\n\n- setup install: ./install.sh",
    outcome: "",
    completed: 0,
    created: 0,
    ...row,
    data: {
        plugin: "github.com/jessegall/code-commandments",
        name: "Code Commandments",
        commit: "0123456789abcdef0123456789abcdef01234567",
        ...data,
    },
});
const other = (data = {}, row = {}) => ({
    n: 42,
    title: "Keep the file list between searches",
    brief: "Every search reads the tree.",
    outcome: "",
    completed: 0,
    created: 0,
    ...row,
    data,
});

function shown(suggestion, props = {}, given = {}) {
    const acts = {
        complete: vi.fn().mockResolvedValue({}),
        install: vi.fn().mockResolvedValue({}),
        installBlocked: () => "",
        noteWindow: vi.fn().mockResolvedValue({}),
        offerUndo: vi.fn(),
        speak: vi.fn(),
        open: vi.fn(),
        ...given,
    };
    const into = document.createElement("div");
    document.body.append(into);
    const app = createApp(SuggestionCard, {suggestion, ...props});
    app.provide("suggestionActs", acts);
    app.mount(into);
    const button = (label) => [...into.querySelectorAll("button")].find((b) => b.textContent.includes(label));
    return {into, acts, button, text: () => into.textContent.replace(/\s+/g, " ")};
}

beforeEach(() => (document.body.innerHTML = ""));

describe("a suggestion in the chat", () => {
    test("a plugin suggestion shows where it comes from, what it will run, and that yes installs it", async () => {
        const {acts, button, text} = shown(plugin());
        expect(text()).toContain("From github.com/jessegall/code-commandments at 0123456789ab");
        expect(text()).toContain("setup install: ./install.sh");
        expect(text()).toContain("Installs it now");
        let finish;
        acts.install.mockReturnValue(new Promise((done) => (finish = done)));
        button(YES).click();
        await flush();
        expect(acts.install).toHaveBeenCalledWith(41);
        expect(text()).toContain("Installing Code Commandments.");
        expect(button(YES)).toBeUndefined();
        finish({});
        await flush();
        expect(acts.complete).not.toHaveBeenCalled();
    });

    test("a plugin suggestion offers no yes where it cannot be installed, and says why", () => {
        const why = "Running commands from the phone is off. Do it on your computer.";
        const {button, text} = shown(plugin(), {}, {installBlocked: () => why});
        expect(button(YES)).toBeUndefined();
        expect(text()).toContain(why);
    });

    test("a failed install gives its reason, the network tip only for the network, and Try again or No", () => {
        const network = shown(plugin({install: {state: "failed", why: "Could not reach github.com.", network: true}}));
        expect(network.text()).toContain("Install failed. Could not reach github.com. Nothing was kept.");
        expect(network.text()).toContain("Check your network, then try again.");
        expect([network.button("Try again"), network.button(NO), network.button("Change it first")].map(Boolean)).toEqual([
            true,
            true,
            false,
        ]);
        const step = shown(plugin({install: {state: "failed", why: "Its install step stopped.", network: false}}));
        expect(step.text()).not.toContain("Check your network");
    });

    test("yes on any other suggestion answers it, and no offers to undo", async () => {
        const {acts, button} = shown(other());
        button(YES).click();
        await flush();
        expect(acts.complete).toHaveBeenCalledWith(42, YES);
        button(NO).click();
        await flush();
        expect(acts.complete).toHaveBeenLastCalledWith(42, NO);
        expect(acts.offerUndo).toHaveBeenCalledWith(42);
    });

    test("a change needs words before it can be added, and is sent as the answer", async () => {
        const {into, acts, button, text} = shown(other());
        button("Change it first").click();
        await flush();
        expect(button("Add the to-do").disabled).toBe(true);
        expect(text()).toContain("Write your change first");
        const box = into.querySelector("textarea");
        box.value = "Clear it when a file is saved";
        box.dispatchEvent(new Event("input"));
        await flush();
        button("Add the to-do").click();
        await flush();
        expect(acts.complete).toHaveBeenCalledWith(42, "Clear it when a file is saved");
    });

    test("an answered suggestion shrinks to its outcome, naming the to-do it added", () => {
        const accepted = shown(other({decision: "accept", todo: 3061}, {completed: 1, outcome: YES}));
        expect(accepted.text()).toContain("You said yes. Added to-do 3061");
        expect(accepted.button(NO)).toBeUndefined();
        accepted.button("to-do 3061").click();
        expect(accepted.acts.open).toHaveBeenCalledWith("todo:3061");
        const installed = shown(plugin({decision: "install", installed: "plugin:3"}, {completed: 1}));
        expect(installed.text()).toContain("You said yes. Code Commandments is installed.");
        const declined = shown(other({decision: "decline"}, {completed: 1}));
        expect(declined.text()).toContain("You said no. The agent won't suggest it again.");
    });
});
