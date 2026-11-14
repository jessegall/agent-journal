import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {afterEach, beforeEach, expect, test, vi} from "vitest";

const SCRIPT = readFileSync(resolve(__dirname, "../public/splash.js"), "utf8");

let reduce = false;
beforeEach(() => {
    vi.useFakeTimers({toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"]});
    reduce = false;
    vi.stubGlobal("matchMedia", (query) => ({matches: query.includes("reduce") ? reduce : false}));
    Object.defineProperty(document, "fonts", {configurable: true, value: {load: async () => []}});
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({fillText() {}, getImageData: () => ({data: new Uint8ClampedArray(400 * 400 * 4)})});
    history.replaceState(null, "", "/");
});
afterEach(() => {
    document.body.innerHTML = "";
    document.head.querySelectorAll("style").forEach((style) => style.remove());
    delete window.AJSplash;
    delete document.currentScript;
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

// the page loads it as a plain script before the app: it plays by itself when it is run from a script tag, which the test stands in for
function load() {
    Object.defineProperty(document, "currentScript", {configurable: true, get: () => ({})});
    new Function(SCRIPT)();
    return window.AJSplash;
}
const cover = () => document.querySelector(".ajs-cover");
const later = (ms) => vi.advanceTimersByTimeAsync(ms);

test("test_skip_on_click: a click fades the cover at once and removes it, and Escape does the same", async () => {
    const splash = load();
    expect(cover()).not.toBeNull();
    await later(50);
    cover().click();
    expect(cover().classList.contains("ajs-skip")).toBe(true);
    await later(splash.timing.skip + 20);
    expect(cover()).toBeNull();
    const again = splash.play();
    expect(cover()).not.toBeNull();
    window.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape"}));
    await later(splash.timing.skip + 20);
    expect(again.done).toBe(true);
    expect(cover()).toBeNull();
});

test("test_reduced_motion_shows_lockup: with reduced motion the cover is blank first, then holds the finished lockup, with no ring turning", async () => {
    reduce = true;
    const splash = load();
    expect(cover().classList.contains("ajs-reduced")).toBe(true);
    expect(cover().querySelector(".ajs-word")).toBeNull();
    await later(50);
    expect(cover().dataset.stage).toBe("blank");
    await later(splash.timing.blank + 100);
    expect(cover().dataset.stage).toBe("loading");
    expect(cover().querySelectorAll(".ajs-word span")).toHaveLength(8);
    splash.ready();
    await later(2000);
    expect(cover()).toBeNull();
});

test("test_waits_for_first_request: the ring keeps spinning until the app says its first request has loaded, then the word comes out and the cover goes", async () => {
    const stages = [];
    const splash = load();
    splash.play({onStage: (stage) => stages.push(stage)});
    await later(30000);
    expect(cover().dataset.stage).toBe("loading");
    splash.ready();
    await later(20000);
    expect(document.querySelector(".ajs-cover")).toBeNull();
    expect(stages).toEqual(["blank", "entrance", "loading", "ending", "reveal"]);
});

test("test_splash_off_option: ?splash=off draws no cover, and without it the cover shows at once", () => {
    history.replaceState(null, "", "/?splash=off");
    load();
    expect(cover()).toBeNull();
    delete window.AJSplash;
    history.replaceState(null, "", "/");
    load();
    expect(cover()).not.toBeNull();
    expect(cover().getAttribute("role")).toBe("status");
});

test("the cover says it is still starting after 9 seconds", async () => {
    const splash = load();
    await later(splash.timing.slow + 500);
    expect(cover().querySelector(".ajs-status").textContent).toBe("Starting the journal…");
});
