import {beforeEach, expect, test, vi} from "vitest";
import {createApp, nextTick} from "vue";

const cancelled = vi.fn(() => Promise.resolve({}));
vi.mock("../src/api/client.js", () => ({api: {cancelUpdate: cancelled, env: () => "main"}}));

beforeEach(() => {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
});

test("an automatic update counts down ten seconds with a Not now button that puts it off", async () => {
    const {default: UpdateCover} = await import("../src/layout/UpdateCover.vue");
    const {counting, covered, updating} = await import("../src/state/updating.js");
    counting({version: "2.269.0", seconds: 10});
    const host = window.document.createElement("div");
    window.document.body.append(host);
    const app = createApp(UpdateCover);
    app.directive("tip", {});
    app.mount(host);
    await nextTick();
    expect(host.textContent).toContain("Updating to 2.269.0");
    expect(host.textContent).toMatch(/Starts in (10|9) seconds/);
    const button = [...host.querySelectorAll("button")].find((one) => one.textContent.trim() === "Not now");
    expect(button).toBeTruthy();
    expect(covered()).toBe(true);
    button.click();
    await nextTick();
    expect([cancelled.mock.calls.length, updating.countdown, covered()]).toEqual([1, null, false]);
    app.unmount();
    host.remove();
});
