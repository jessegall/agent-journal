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
    expect(keys).toContain("files");
    for (const desk of ["settings", "plugins", "mcp", "profiles", "secrets"]) expect(keys).not.toContain(desk);
    document.documentElement.classList.remove("phone");
});

test("the phone's chat, home and acts go through /p/journal with the phone's own header, never the desk's", async () => {
    document.documentElement.classList.add("phone");
    vi.resetModules();
    const fetched = vi.fn(async () => new Response("{}", {status: 200, headers: {"Content-Type": "application/json"}}));
    vi.stubGlobal("fetch", fetched);
    const {api} = await import("../src/api/client.js");
    (await import("../src/state/environment.js")).choose("main");
    await api.create("messages", {text: "from the train"});
    await api.list("tasks", {limit: 50});
    await api.act("questions", 3, "answer", {answer: "beta"});
    expect(fetched.mock.calls.map(([url]) => url.split("?")[0])).toEqual(["/p/journal/messages", "/p/journal/tasks", "/p/journal/questions/3/answer"]);
    for (const [, sent] of fetched.mock.calls) expect(sent.headers["X-Phone"]).toBe("1");
    for (const [, sent] of fetched.mock.calls) expect(sent.headers["X-Journal-Viewer"]).toBeUndefined();
    vi.unstubAllGlobals();
    document.documentElement.classList.remove("phone");
});

test("the phone refuses a file at once, and the desk's Project menu keeps its order", async () => {
    vi.resetModules();
    const {useNavigation} = await import("../src/composables/navigation.js");
    const project = useNavigation().sections.value.find((section) => section.key === "project").links.map((link) => link.key);
    expect(project.slice(-7)).toEqual(["files", "plugins", "mcp", "profiles", "secrets", "resources", "settings"]);
    document.documentElement.classList.add("phone");
    vi.resetModules();
    const {api} = await import("../src/api/client.js");
    const {PHONE_SENDS_TEXT} = await import("../src/platform/phone.js");
    await expect(api.upload("messages", 1, new File(["x"], "x.txt"))).rejects.toMatchObject({status: 403, message: PHONE_SENDS_TEXT});
    document.documentElement.classList.remove("phone");
});

test("the phone app opened at the viewer's own address, which serves no phone state, says what it is instead of a blank page", async () => {
    document.body.innerHTML = '<div id="app"></div><div id="phone-notify"></div>';
    vi.stubGlobal("fetch", async () => new Response("<!doctype html>", {status: 200, headers: {"content-type": "text/html"}}));
    const {ELSEWHERE} = await import("../src/phone/main.js");
    await vi.waitFor(() => expect(document.getElementById("app").textContent).toBe(ELSEWHERE));
    expect(ELSEWHERE).toContain("phone app");
    vi.unstubAllGlobals();
});
