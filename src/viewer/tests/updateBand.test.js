import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test} from "vitest";
import UpdateBand from "../src/shell/UpdateBand.vue";
import {settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));


async function drawn(answers) {
    const ran = [];
    const element = document.createElement("div");
    createApp({render: () => h(UpdateBand, {run: async (line) => (ran.push(line.join(" ")), answers[line[1]])})}).mount(element);
    await settle();
    return {element, ran};
}

test("a journal behind the newest release is told, and installs it", async () => {
    const {element, ran} = await drawn({check: {ok: true, value: {is_current: false}}, install: {ok: true, value: {}}});
    expect(element.textContent).toContain("A newer version");
    element.querySelector("[data-update-install]").click();
    await settle();
    expect(ran).toContain("update install");
    expect(element.querySelector("[data-update-band]")).toBeNull();
});

test("a current journal, or a check that cannot answer, shows nothing", async () => {
    expect((await drawn({check: {ok: true, value: {is_current: true}}})).element.querySelector("[data-update-band]")).toBeNull();
    expect((await drawn({check: {ok: false, error: "no network"}})).element.querySelector("[data-update-band]")).toBeNull();
});

test("not now puts it away, and a failed install says why", async () => {
    const later = await drawn({check: {ok: true, value: {is_current: false}}});
    later.element.querySelector("[data-update-later]").click();
    await settle();
    expect(later.element.querySelector("[data-update-band]")).toBeNull();
    const failed = await drawn({check: {ok: true, value: {is_current: false}}, install: {ok: false, error: "the download failed"}});
    failed.element.querySelector("[data-update-install]").click();
    await settle();
    expect(failed.element.textContent).toContain("the download failed");
});
