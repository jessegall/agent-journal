import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {createApp, h, nextTick, ref} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import ChatMark from "../src/kit/ChatMark.vue";
import {LEAVE_MS, RESIZE_MS} from "../src/composables/markMotion.js";

const SOURCE = readFileSync(resolve(__dirname, "../src/kit/ChatMark.vue"), "utf8");
const CARD = readFileSync(resolve(__dirname, "../src/chat/GrowingCard.vue"), "utf8");
const MARK = {key: "agent:1", label: "A long title that would wrap in a narrow mark", detail: "More"};
let app;
let host;

beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(200);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(24);
});
afterEach(() => {
    app?.unmount();
    host?.remove();
    vi.restoreAllMocks();
    vi.useRealTimers();
});

function opened() {
    const open = ref(false);
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(ChatMark, {mark: MARK, open: open.value})});
    app.mount(host);
    return {open, mark: () => host.querySelector(".mark")};
}

test("a mark that opens is in a step of its transition from the moment it is marked open, so the title rule for the steps applies at once", async () => {
    const {open, mark} = opened();
    await nextTick();
    open.value = true;
    await nextTick();
    expect(mark().hasAttribute("data-open")).toBe(true);
    expect(mark().classList.contains("leaving")).toBe(true);
});

test("the mark goes through leaving, resizing and entering, each a step the title rule names", async () => {
    const {open, mark} = opened();
    await nextTick();
    open.value = true;
    await nextTick();
    await vi.advanceTimersByTimeAsync(LEAVE_MS);
    await nextTick();
    expect(mark().classList.contains("resizing")).toBe(true);
    await vi.advanceTimersByTimeAsync(RESIZE_MS);
    await nextTick();
    expect(mark().classList.contains("entering")).toBe(true);
});

test("the title stays on one line through leaving, resizing and entering", () => {
    for (const phase of ["leaving", "resizing", "entering"]) {
        expect(SOURCE).toContain(`.mark.${phase} .head,`);
        expect(SOURCE).toContain(`.mark.${phase} .head :deep(.md)`);
    }
    expect(SOURCE).toMatch(/\.mark\.entering \.head :deep\(\.md\) \{\s*white-space: nowrap;/);
});

test("the title of a growing card stays on one line as well", () => {
    expect(CARD).toMatch(/\.growing-card-title \{[^}]*white-space: nowrap;/);
});
