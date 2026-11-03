import {expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import UpdatesPanel from "../../core/modules/updates/web/src/UpdatesPanel.vue";

const NOTE = {tag: "v2", text: "A new thing", published_at: "2026-10-01T10:00:00Z"};

function updates(check, notes = {ok: true, value: {notes: [NOTE], is_last_page: true}}) {
    const window = context({"release list": page([]), "update check": {ok: true, value: check}, "update notes": notes});
    window.lines = [];
    window.run = async (line) => {
        window.lines.push(line);
        return {ok: true, value: null};
    };
    return window;
}

test("a journal behind names the release it updates to, then says to reload", async () => {
    const window = updates({line: "a newer release v2 is out", tag: "v2", is_current: false});
    const element = await mounted(UpdatesPanel, window);
    expect(element.querySelector("[data-update-install]").textContent).toContain("Update to v2");
    element.querySelector("[data-update-install]").click();
    await settle();
    expect(window.lines).toEqual([["update", "install"]]);
    expect(element.querySelector("[data-update-cover]")).toBeNull();
    expect(element.querySelector("[data-update-arrived]")).not.toBeNull();
});

test("a journal up to date can install the release again", async () => {
    const window = updates({line: "up to date", tag: "v2", is_current: true});
    const element = await mounted(UpdatesPanel, window);
    expect(element.querySelector("[data-update-install]")).toBeNull();
    element.querySelector("[data-update-force]").click();
    await settle();
    expect(window.lines).toEqual([["update", "install"]]);
});

test("what changed lists the releases and older ones come after the button", async () => {
    const window = updates({line: "up to date", tag: "v2", is_current: true}, {ok: true, value: {notes: [NOTE], is_last_page: false}});
    const element = await mounted(UpdatesPanel, window);
    expect(element.querySelector("[data-update-note]").textContent).toContain("A new thing");
    window.read = async () => ({ok: true, value: {notes: [{...NOTE, tag: "v1"}], is_last_page: true}});
    element.querySelector("[data-update-older]").click();
    await settle();
    expect(element.querySelectorAll("[data-update-note]").length).toBe(2);
    expect(element.querySelector("[data-update-older]")).toBeNull();
});

test("notes that cannot be read say why and the rest of the window stays", async () => {
    const element = await mounted(UpdatesPanel, updates({line: "up to date", tag: "", is_current: true}, {ok: false, error: "could not be read"}));
    expect(element.querySelector("[data-update-notes-failure]").textContent).toBe("could not be read");
    expect(element.textContent).toContain("up to date");
});

test("an unavailable release shows the reason and finishes checking", async () => {
    const window = context({
        "release list": page([]),
        "update check": {ok: false, error: "No installable release was found at the release address."},
        "update notes": {ok: true, value: {notes: [], is_last_page: true}},
    });
    const element = await mounted(UpdatesPanel, window);
    expect(element.textContent).toContain("No installable release was found");
    expect(element.textContent).toContain("Release unavailable");
    expect(element.textContent).not.toContain("Checking for a newer release");
    expect(element.querySelector("[data-update-install]")).toBeNull();
});
