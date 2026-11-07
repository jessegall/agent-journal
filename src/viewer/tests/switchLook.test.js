import {createApp, h} from "vue";
import {expect, test} from "vitest";
import {Switch} from "@journal/window-kit";

function drawn(props) {
    const element = document.createElement("div");
    createApp({render: () => h(Switch, props)}).mount(element);
    return element.querySelector("button");
}

test("the switch is version 4's: a 28 by 16 track with a knob, on in the accent, asking for the opposite when pressed", () => {
    const changes = [];
    const button = drawn({on: false, title: "Auto", onChange: (on) => changes.push(on)});
    expect(button.getAttribute("role")).toBe("switch");
    expect(button.getAttribute("aria-checked")).toBe("false");
    expect(button.querySelector(".switch .knob")).not.toBeNull();
    button.click();
    expect(changes).toEqual([true]);
    expect(drawn({on: true, title: "Auto"}).querySelector(".switch").classList.contains("on")).toBe(true);
});
