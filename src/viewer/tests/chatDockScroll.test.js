import {nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import Chat from "../../core/modules/messages/web/src/Chat.vue";
import {context, mounted, page} from "./support/windowContext.js";

vi.mock("@journal/window-kit", async (original) => {
    const kit = await original();
    const {h} = await import("vue");
    return {...kit, DockStack: {props: ["collapsed"], render() { return h("div", {"data-test-docks": "", "data-collapsed": String(this.collapsed)}); }}};
});

afterEach(() => { vi.useRealTimers(); });

test("scrolling away collapses after half a quiet second and the foot opens immediately", async () => {
    const element = await mounted(Chat, context({"message feed": page([])}));
    const history = element.querySelector(".history");
    Object.defineProperty(history, "scrollHeight", {value: 2000});
    Object.defineProperty(history, "clientHeight", {value: 500});
    Object.defineProperty(history, "scrollTop", {value: 1500, writable: true});
    vi.useFakeTimers();
    history.dispatchEvent(new Event("scroll"));
    history.scrollTop = 500;
    history.dispatchEvent(new Event("scroll"));
    await vi.advanceTimersByTimeAsync(499);
    expect(element.querySelector("[data-test-docks]").dataset.collapsed).toBe("false");
    await vi.advanceTimersByTimeAsync(1);
    await nextTick();
    expect(element.querySelector("[data-test-docks]").dataset.collapsed).toBe("true");
    expect(history.scrollTop).toBe(500);
    history.scrollTop = 1500;
    history.dispatchEvent(new Event("scroll"));
    await nextTick();
    expect(element.querySelector("[data-test-docks]").dataset.collapsed).toBe("false");
});
