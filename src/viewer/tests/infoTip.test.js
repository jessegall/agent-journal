import {createApp, h} from "vue";
import {expect, test} from "vitest";
import InfoTip from "../src/kit/InfoTip.vue";
import FormField from "../src/kit/FormField.vue";

function drawn(component, props, slots = {}) {
    const element = document.createElement("div");
    createApp({render: () => h(component, props, slots)}).mount(element);
    return element;
}

test("the information tip is an icon button with a tooltip of one line per entry", () => {
    const element = drawn(InfoTip, {lines: ["first", "second"], label: "About the field"});
    const button = element.querySelector("[data-info-tip]");
    expect(button.getAttribute("aria-label")).toBe("About the field");
    expect([...element.querySelectorAll(".info-tip-line")].map((line) => line.textContent)).toEqual(["first", "second"]);
    expect(element.querySelector("[data-info-tip-text]").getAttribute("role")).toBe("tooltip");
});

test("a form field with help shows it in a tooltip beside its label and prints no help line", () => {
    const element = drawn(FormField, {label: "Name", help: "Shown on the card"}, {default: () => h("input")});
    expect(element.querySelector(".form-field-head [data-info-tip]")).not.toBeNull();
    expect(element.querySelector("[data-info-tip-text]").textContent).toBe("Shown on the card");
    expect(element.querySelector(".form-field-help")).toBeNull();
    expect(drawn(FormField, {label: "Name"}, {default: () => h("input")}).querySelector("[data-info-tip]")).toBeNull();
});
