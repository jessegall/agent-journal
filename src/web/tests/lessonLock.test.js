import {afterEach, describe, expect, it} from "vitest";
import {lockReplay} from "../demo/lock.js";

describe("the lesson lock", () => {
    let unlock = () => {};
    afterEach(() => {
        unlock();
        document.body.innerHTML = "";
    });

    function locked() {
        const standIn = {player: {view: {looking: false}, waiting: null, playing: false}};
        unlock = lockReplay(standIn);
        const pressed = [];
        const button = document.createElement("button");
        button.addEventListener("click", () => pressed.push("click"));
        document.body.append(button);
        return {standIn, button, pressed};
    }

    it("holds a control that is not the one the lesson asks for", () => {
        const {button, pressed} = locked();
        button.click();
        expect(pressed).toEqual([]);
    });

    it("leaves the buttons of the lesson-done card usable, so the lesson always has a way out", () => {
        const {button, pressed} = locked();
        const card = document.createElement("section");
        card.className = "lesson-end";
        card.append(button);
        document.body.append(card);
        button.click();
        expect(pressed).toEqual(["click"]);
    });

    it("leaves every control usable once the user looks around after the lesson", () => {
        const {standIn, button, pressed} = locked();
        standIn.player.view.looking = true;
        button.click();
        const typed = new KeyboardEvent("keydown", {key: "a", bubbles: true, cancelable: true});
        document.body.dispatchEvent(typed);
        expect(pressed).toEqual(["click"]);
        expect(typed.defaultPrevented).toBe(false);
    });
});
