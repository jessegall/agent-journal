import {afterEach, expect, test, vi} from "vitest";
import {nextTick} from "vue";
import {chooseColorScheme, colorScheme, followColorScheme, nextColorScheme, pageTitle, SCHEMES} from "../src/windows/colorScheme.js";

const sheet = () => ({cssRules: [{media: {mediaText: "(prefers-color-scheme: light)"}}, {media: {mediaText: "(max-width: 600px)"}}, {}]});
const page = document.documentElement;

let stop = null;

function following(styles) {
    vi.spyOn(document, "styleSheets", "get").mockReturnValue(styles);
    chooseColorScheme("system");
    stop = followColorScheme();
}

async function choose(key) {
    chooseColorScheme(key);
    await nextTick();
}

afterEach(() => {
    stop?.();
    stop = null;
    vi.restoreAllMocks();
    chooseColorScheme("system");
    page.style.colorScheme = "";
});

test("a chosen scheme forces the light rules on or off and leaves other media alone", async () => {
    const styles = [sheet()];
    following(styles);
    await choose("light");
    expect(styles[0].cssRules[0].media.mediaText).toBe("all");
    expect(styles[0].cssRules[1].media.mediaText).toBe("(max-width: 600px)");
    expect(page.style.colorScheme).toBe("light");
    await choose("dark");
    expect(styles[0].cssRules[0].media.mediaText).toBe("not all");
});

test("a stylesheet of another origin that refuses to show its rules is passed over", async () => {
    const foreign = {get cssRules() { throw new DOMException("Cannot access rules", "SecurityError"); }};
    const styles = [foreign, sheet()];
    following(styles);
    await choose("light");
    expect(styles[1].cssRules[0].media.mediaText).toBe("all");
});

test("following the system gives the rules back what they asked", async () => {
    const styles = [sheet()];
    following(styles);
    await choose("dark");
    await choose("system");
    expect(styles[0].cssRules[0].media.mediaText).toBe("(prefers-color-scheme: light)");
    expect(page.style.colorScheme).toBe("");
});

test("the scheme moves on to the next and is kept for the next visit", () => {
    const before = colorScheme.value;
    nextColorScheme();
    expect(colorScheme.value).not.toBe(before);
    expect(JSON.parse(localStorage.getItem("viewer.color-scheme"))).toBe(colorScheme.value);
    expect(SCHEMES.map((scheme) => scheme.key)).toContain(colorScheme.value);
});

test("every page's title names the project and the environment", () => {
    expect(pageTitle("development", "Worldwatch Market")).toBe("Worldwatch Market · development");
    expect(pageTitle("development")).toBe("development");
    expect(pageTitle("")).toBe("Agent journal");
});
