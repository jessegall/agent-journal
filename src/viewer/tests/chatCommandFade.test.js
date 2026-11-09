import {afterEach, expect, test, vi} from "vitest";
import {context, mounted, page, settleTransition, unmountAll} from "./support/windowContext.js";
import Chat from "../../core/modules/messages/web/src/Chat.vue";

const FADE_MS = 5000;
const realSetTimeout = globalThis.setTimeout.bind(globalThis);
const realClearTimeout = globalThis.clearTimeout.bind(globalThis);
const READ_GAP_MS = 1000;

afterEach(() => {
    vi.restoreAllMocks();
    unmountAll();
});

// the five second timers the chat sets are caught so a test lets them pass at once; any other timer runs as it is
function catchFadeTimers() {
    const fades = [];
    vi.spyOn(globalThis, "setTimeout").mockImplementation((callback, delay, ...rest) => {
        if (delay !== FADE_MS) return realSetTimeout(callback, delay, ...rest);
        fades.push({callback, cleared: false});
        return -fades.length;
    });
    vi.spyOn(globalThis, "clearTimeout").mockImplementation((id) => {
        if (id < 0) fades[-id - 1].cleared = true;
        else realClearTimeout(id);
    });
    return {
        waiting: () => fades.filter((fade) => !fade.cleared).length,
        pass: () => fades.filter((fade) => !fade.cleared).forEach((fade) => fade.callback()),
    };
}

async function strip() {
    const fades = catchFadeTimers();
    let clock = Date.now();
    vi.spyOn(Date, "now").mockImplementation(() => clock);
    const tool = {ok: true, value: {tool: "", wait_target: ""}};
    const heard = [];
    const window_ = {...context({"message feed": page([]), "usage tool": tool}), follow: (_, listener) => {
        heard.push(listener);
        return () => {};
    }};
    const element = await mounted(Chat, window_);
    const word = () => element.querySelector("[data-running-command]").textContent;
    const run = async (value) => {
        tool.value = value;
        clock += READ_GAP_MS;
        await Promise.all(heard.map((listener) => listener({event: "hook_call.create", row_id: 1})));
        await settleTransition();
    };
    const pass = async () => {
        fades.pass();
        await settleTransition();
    };
    return {word, run, pass, fades};
}

test("a finished command shows until five seconds pass and then gives way to thinking while the agent works", async () => {
    const {word, run, pass, fades} = await strip();
    await run({tool: "Bash ls", running: false});
    expect(word()).toBe("Bash ls");
    expect(fades.waiting()).toBe(1);
    await pass();
    expect(word()).toBe("thinking");
});

test("a new command within five seconds keeps showing and the first command's timer is dropped", async () => {
    const {word, run, pass, fades} = await strip();
    await run({tool: "Bash ls", running: false});
    await run({tool: "Read notes.txt", running: false});
    expect(word()).toBe("Read notes.txt");
    expect(fades.waiting()).toBe(1);
    await pass();
    expect(word()).toBe("thinking");
});

test("a command that still runs does not fade, and fades five seconds after it ends", async () => {
    const {word, run, pass, fades} = await strip();
    await run({tool: "Bash make test", running: true});
    expect(fades.waiting()).toBe(0);
    await pass();
    expect(word()).toBe("Bash make test");
    await run({tool: "Bash make test", running: false});
    expect(word()).toBe("Bash make test");
    expect(fades.waiting()).toBe(1);
    await pass();
    expect(word()).toBe("thinking");
});

test("with no command and no turn under way the strip says idle, and a turn that has begun says thinking", async () => {
    const {word, run} = await strip();
    await run({tool: "", wait_target: "", running: false});
    expect(word()).toBe("idle");
    await run({tool: "", wait_target: "", thinking: true});
    expect(word()).toBe("thinking");
    await run({tool: "", wait_target: "release build"});
    expect(word()).toBe("waiting for release build");
});
