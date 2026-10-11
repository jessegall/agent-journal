import {createApp, h, nextTick} from "vue";
import {describe, expect, test} from "vitest";
import {PAGES as titles} from "../src/domain/navigation.js";
import {PAGES} from "../src/route.js";
import SecretForm from "../src/pages/SecretForm.vue";

const draft = () => ({title: "flespi", abstract: "", brief: "", kind: "custom", fields: [], programs: [], proposed: ["curl"], helpers: false});

async function shown(on) {
    const host = window.document.createElement("div");
    createApp({render: () => h(SecretForm, {draft: on, onAllowed: (name) => allowed.push(name)})}).mount(host);
    await nextTick();
    return host;
}

const allowed = [];

describe("the secrets page", () => {
    test("is a page of the project with a title and an icon, so the sidebar lists it", () => {
        expect(PAGES).toContain("secrets");
        expect(titles.secrets).toMatchObject({title: "Secrets", icon: "key"});
    });

    test("allowing a program the agent proposed tells the page, which saves it there and then", async () => {
        const on = draft();
        const host = await shown(on);
        const allow = [...host.querySelectorAll("button")].find((button) => button.textContent.includes("Allow curl"));
        expect(allow).toBeTruthy();
        allow.click();
        await nextTick();
        expect(on.programs).toEqual(["curl"]);
        expect(on.proposed).toEqual([]);
        expect(allowed).toEqual(["curl"]);
    });
});
