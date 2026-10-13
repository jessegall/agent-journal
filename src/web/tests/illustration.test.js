import {describe, expect, test} from "vitest";
import Illustration from "../src/kit/Illustration.vue";
import PickCard from "../src/kit/PickCard.vue";
import {voiceOf} from "../src/composables/profiles.js";
import {shown as drawn} from "./shown.js";

const shown = (component, props) => drawn(component, props, () => "a sample line");

describe("the picture of a voice", () => {
    test("is the flat artwork of the voice named by the profile, and a profile without one names none", async () => {
        expect([voiceOf({data: {voice: "squire"}}), voiceOf({data: {voice: ""}})]).toEqual(["squire", ""]);
        const picture = await shown(Illustration, {src: "/voices/squire.webp", size: 56});
        const none = await shown(Illustration, {src: ""});
        expect([picture.querySelector("img").getAttribute("src"), picture.querySelector("img").getAttribute("width"), none.querySelector("img")]).toEqual(["/voices/squire.webp", "56", null]);
    });

    test("shows on the card where the voice is first chosen, and the card has no picture without one", async () => {
        const card = await shown(PickCard, {title: "Squire", voice: "squire"});
        const plain = await shown(PickCard, {title: "Custom"});
        expect([!!card.querySelector(".voice-pose"), plain.querySelector(".voice-pose")]).toEqual([true, null]);
    });
});

describe("a large picture on top of a card", () => {
    test("fills the width of its card at the height it is given", async () => {
        const large = await shown(Illustration, {src: "/voices/squire.webp", size: 150, fill: true});
        const image = large.querySelector("img");
        expect([image.classList.contains("fill"), image.getAttribute("width"), image.getAttribute("height")]).toEqual([true, null, "150"]);
        const card = await shown(PickCard, {title: "Squire", voice: "squire"});
        expect(card.querySelector(".voice-pose").style.height).toBe("130px");
    });
});

describe("the phone's list of voices", () => {
    test("shows a voice's picture in place of the dot, and the dot for a row without one", async () => {
        const ItemRow = (await import("../src/phone/kit/ItemRow.vue")).default;
        const withArt = await shown(ItemRow, {title: "Squire", about: "Profile 5", voice: "squire"});
        const without = await shown(ItemRow, {title: "Custom", about: "Profile 6"});
        expect(withArt.querySelector(".item-row").classList.contains("pictured")).toBe(true);
        expect([!!withArt.querySelector(".voice-pose"), withArt.querySelector(".item-dot"), without.querySelector(".voice-pose"), !!without.querySelector(".item-dot")]).toEqual([true, null, null, true]);
    });
});
