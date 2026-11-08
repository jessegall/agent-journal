import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {h, ref} from "vue";
import {context, mounted, settle} from "./support/windowContext.js";
import {AGENT_TERMINAL_KEYS, terminalWindowContext} from "./support/terminalWindowContext.js";
import Terminal from "../../suites/coding/web/src/Terminal.vue";

const FOOT = 1000;
const NEWEST_PAGE = 50;
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
    const window = terminalWindowContext({}, 7);
    window.read = async (line) => (line.startsWith("hook-call feed") ? feed(line) : {ok: false, error: line});
    window.option = () => ({value: "commands"});
    const element = await mounted(Terminal, window);
    await settle();
    return {element, window};
}

const lines = (element) => [...element.querySelectorAll("[data-terminal-command]")].map((line) => line.textContent.trim());

test("the terminal opens with the commands of the newest page only", async () => {
    const {element, window} = await opened();
    const shown = lines(element);
    expect(shown).toHaveLength(NEWEST_PAGE);
    expect(shown[0]).toBe("$call 504");
    expect(shown.at(-1)).toBe("$call 700");
    expect(window.reads.filter((line) => line.startsWith("hook-call feed") && line.includes("--before-id"))).toEqual([]);
});

test("scrolled to the top, the terminal reads an older page and adds its lines above", async () => {
    const {element} = await opened();
    expect(lines(element)).toHaveLength(NEWEST_PAGE);
    const pane = element.querySelector(".auto-scroll-pane");
    pane.scrollTop = 0;
    pane.dispatchEvent(new Event("scroll"));
    await settle();
    const after = lines(element);
    expect(after).toHaveLength(NEWEST_PAGE * 2);
    expect(after[0]).toBe("$call 304");
    expect(after.at(-1)).toBe("$call 700");
});

test("an embedded terminal loads its agent key and stops following when closed", async () => {
    const window = context({}, null, AGENT_TERMINAL_KEYS);
    const requests = vi.spyOn(window, "readKeys");
    window.read = feed;
    const stopped = vi.fn();
    window.follow = vi.fn(() => stopped);
    window.option = () => ({value: "commands"});
    const shown = ref(true);
    const element = await mounted({render: () => shown.value ? h(Terminal, {agent: 7}) : null}, window);
    await settle();
    expect(lines(element)).toHaveLength(NEWEST_PAGE);
    expect(requests.mock.calls.filter(([request]) => request.only.length).every(([request]) => request.only.join() === "terminal-calls.7")).toBe(true);
    expect(window.follow).toHaveBeenCalledWith(["hook_call.*"], expect.any(Function));
    shown.value = false;
    await settle();
    expect(stopped).toHaveBeenCalledOnce();
});

test("opening a command reads one output page and closing it hides the output", async () => {
    const window = terminalWindowContext({"output hook-page 504": {ok: true, value: {lines: ["a result"], first_byte: 0, last_byte: 8, total: 8, cut_bytes: 0, command: "full command\nwith another line"}}}, 7);
    const read = window.read;
    window.read = async (line) => line.startsWith("hook-call feed") ? feed(line) : read(line);
    const requests = vi.spyOn(window, "readKeys");
    window.option = () => ({value: "commands"});
    const element = await mounted(Terminal, window);
    await settle();
    const command = element.querySelector("[data-terminal-command] .terminal-text");
    expect(window.reads).not.toContain("output hook-page 504");
    command.click();
    await settle();
    expect(command.classList.contains("open")).toBe(true);
    expect(command.textContent).toBe("full command\nwith another line");
    expect(element.querySelector("[data-terminal-output]").textContent).toContain("a result");
    expect(requests.mock.calls.filter(([request]) => request.only.includes("terminal-output.504"))).toHaveLength(1);
    command.click();
    await settle();
    expect(command.classList.contains("open")).toBe(false);
    expect(command.textContent).toBe("call 504");
    expect(element.querySelector("[data-terminal-output]")).toBeNull();
    expect(window.reads).toEqual(["output hook-page 504"]);
});
