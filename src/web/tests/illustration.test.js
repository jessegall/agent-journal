import {createApp, h, nextTick} from "vue";
import {describe, expect, test} from "vitest";
import Illustration from "../src/kit/Illustration.vue";
import PickCard from "../src/kit/PickCard.vue";
import {artOf} from "../src/composables/profiles.js";

async function shown(component, props) {
    const host = window.document.createElement("div");
    createApp({render: () => h(component, props, () => "a sample line")}).mount(host);
    await nextTick();
    return host;
}

describe("the picture of a voice", () => {
    test("is drawn from the address of its file, and nothing is drawn for a profile without one", async () => {
        expect([artOf({data: {art: "squire.webp"}}), artOf({data: {art: ""}})]).toEqual(["/voices/squire.webp", ""]);
        const picture = await shown(Illustration, {src: "/voices/squire.webp", size: 56});
        const none = await shown(Illustration, {src: ""});
        expect([picture.querySelector("img").getAttribute("src"), picture.querySelector("img").getAttribute("width"), none.querySelector("img")]).toEqual(["/voices/squire.webp", "56", null]);
    });

    test("shows on the card where the voice is first chosen, and the card has no image without one", async () => {
        const card = await shown(PickCard, {title: "Squire", art: "/voices/squire.webp"});
        const plain = await shown(PickCard, {title: "Custom"});
        expect([card.querySelector("img")?.getAttribute("src"), plain.querySelector("img")]).toEqual(["/voices/squire.webp", null]);
    });
});

describe("a large picture on top of a card", () => {
    test("fills the width of its card at the height it is given", async () => {
        const large = await shown(Illustration, {src: "/voices/squire.webp", size: 150, fill: true});
        const image = large.querySelector("img");
        expect([image.classList.contains("fill"), image.getAttribute("width"), image.getAttribute("height")]).toEqual([true, null, "150"]);
        const card = await shown(PickCard, {title: "Squire", art: "/voices/squire.webp"});
        expect(card.querySelector("img").getAttribute("height")).toBe("130");
    });
});

describe("the phone's list of voices", () => {
    test("shows a voice's picture in place of the dot, and the dot for a row without one", async () => {
        const ItemRow = (await import("../src/phone/kit/ItemRow.vue")).default;
        const withArt = await shown(ItemRow, {title: "Squire", about: "Profile 5", art: "/voices/squire.webp"});
        const without = await shown(ItemRow, {title: "My own", about: "Profile 6"});
        expect(withArt.querySelector(".item-row").classList.contains("pictured")).toBe(true);
        expect([withArt.querySelector("img")?.getAttribute("src"), withArt.querySelector(".item-dot"), without.querySelector("img"), !!without.querySelector(".item-dot")]).toEqual([
            "/voices/squire.webp",
            null,
            null,
            true,
        ]);
    });
});
