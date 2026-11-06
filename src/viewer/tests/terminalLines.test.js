import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import Terminal from "../../suites/coding/web/src/Terminal.vue";

const FOOT = 1000;
const OPENING = 100;
const CALLS = 700;

// every fourth hook call is a Bash command and the others are reads, as a long run of an agent leaves them: 175 commands in 700 calls
const calls = Array.from({length: CALLS}, (_, index) => {
    const id = CALLS - index;
    return {id, agent_id: 7, hook: "pre_tool_use", tool: id % 4 === 0 ? "Bash" : "Read", summary: `call ${id}`, answer: "allow", refusal: ""};
});

// the feed as the journal answers it: the newest calls below the id asked for, as many as --limit says
const feed = async (line) => {
    const before = Number(line.match(/--before-id (\d+)/)?.[1] ?? Infinity);
    const limit = Number(line.match(/--limit (\d+)/)[1]);
    return {ok: true, value: {rows: calls.filter((call) => call.id < before).slice(0, limit)}};
};

beforeEach(() => {
    Object.defineProperties(HTMLElement.prototype, {scrollHeight: {value: FOOT, configurable: true}, clientHeight: {value: 100, configurable: true}});
    HTMLElement.prototype.scrollTo = function scrollTo({top}) {
        this.scrollTop = top;
    };
});

afterEach(() => {
    delete HTMLElement.prototype.scrollHeight;
    delete HTMLElement.prototype.clientHeight;
    delete HTMLElement.prototype.scrollTo;
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
});

async function opened() {
    const window = context({}, 7);
    window.read = async (line) => (line.startsWith("hook-call feed") ? feed(line) : {ok: false, error: line});
    window.option = () => ({value: "commands"});
    const element = await mounted(Terminal, window);
    await settle();
    return {element, window};
}

const lines = (element) => [...element.querySelectorAll("[data-terminal-command]")].map((line) => line.textContent.trim());

test("the terminal opens with the last 100 lines, reading older pages until it has them", async () => {
    const {element} = await opened();
    const shown = lines(element);
    expect(shown).toHaveLength(OPENING);
    expect(shown[0]).toBe("$call 304");
    expect(shown.at(-1)).toBe("$call 700");
});

test("scrolled to the top, the terminal reads an older page and adds its lines above", async () => {
    const {element} = await opened();
    expect(lines(element)).toHaveLength(OPENING);
    const pane = element.querySelector(".auto-scroll-pane");
    pane.scrollTop = 0;
    pane.dispatchEvent(new Event("scroll"));
    await settle();
    const after = lines(element);
    expect(after).toHaveLength(OPENING + 50);
    expect(after[0]).toBe("$call 104");
    expect(after.at(-1)).toBe("$call 700");
});

test("opening a command reads one output page and closing it hides the output", async () => {
    const window = context({}, 7);
    window.read = async (line) => feed(line);
    window.props = {};
    window.readKey = vi.fn(async () => ({ok: true, value: {lines: ["a result"], first_byte: 0, last_byte: 8, total: 8, cut_bytes: 0, command: "full command\nwith another line"}}));
    window.option = () => ({value: "commands"});
    const element = await mounted(Terminal, window);
    const command = element.querySelector("[data-terminal-command] .terminal-text");
    expect(window.readKey).not.toHaveBeenCalled();
    command.click();
    await settle();
    expect(command.classList.contains("open")).toBe(true);
    expect(command.textContent).toBe("full command\nwith another line");
    expect(element.querySelector("[data-terminal-output]").textContent).toContain("a result");
    expect(window.readKey).toHaveBeenCalledExactlyOnceWith("terminal-output.304", {});
    command.click();
    await settle();
    expect(command.classList.contains("open")).toBe(false);
    expect(command.textContent).toBe("call 304");
    expect(element.querySelector("[data-terminal-output]")).toBeNull();
    expect(window.readKey).toHaveBeenCalledTimes(1);
});
