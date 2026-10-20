import {expect, test, vi} from "vitest";

window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));

test("on the phone the viewer speaks through /p, finds its files beside the page and offers none of the desk's configuring pages", async () => {
    document.documentElement.classList.add("phone");
    vi.resetModules();
    const {api} = await import("../src/api/client.js");
    const {useNavigation} = await import("../src/composables/navigation.js");
    expect(api.url("/messages")).toBe("/p/journal/messages");
    expect(api.publicUrl("voices/figures/figures.json")).toBe("./voices/figures/figures.json");
    const keys = useNavigation().everywhere.value.map((link) => link.key);
    expect(keys).toContain("code");
    for (const desk of ["settings", "plugins", "mcp", "chart", "profiles", "secrets"]) expect(keys).not.toContain(desk);
    document.documentElement.classList.remove("phone");
});
