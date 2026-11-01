import {expect, test} from "vitest";
import {applyColorScheme, colorScheme, nextColorScheme, pageTitle, SCHEMES} from "../src/windows/colorScheme.js";

const sheet = () => ({cssRules: [{media: {mediaText: "(prefers-color-scheme: light)"}}, {media: {mediaText: "(max-width: 600px)"}}, {}]});
const root = () => ({style: {colorScheme: ""}});

test("a chosen scheme forces the light rules on or off and leaves other media alone", () => {
    const styles = [sheet()];
    const page = root();
    applyColorScheme("light", styles, page);
    expect(styles[0].cssRules[0].media.mediaText).toBe("all");
    expect(styles[0].cssRules[1].media.mediaText).toBe("(max-width: 600px)");
    expect(page.style.colorScheme).toBe("light");
    applyColorScheme("dark", styles, page);
    expect(styles[0].cssRules[0].media.mediaText).toBe("not all");
});

test("following the system gives the rules back what they asked", () => {
    const styles = [sheet()];
    const page = root();
    applyColorScheme("dark", styles, page);
    applyColorScheme("system", styles, page);
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
    expect(pageTitle("development")).toBe("agent-journal · development");
    expect(pageTitle("")).toBe("agent-journal");
});
