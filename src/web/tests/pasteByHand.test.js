import {expect, test} from "vitest";
import {pasteByHand} from "../src/platform/pasteByHand.js";

function paste(field, text) {
    const event = new Event("paste", {bubbles: true, cancelable: true});
    event.clipboardData = {getData: (kind) => (kind === "text/plain" ? text : ""), files: []};
    field.dispatchEvent(event);
    return event;
}

test("a paste into a field is inserted by the page from the words the event carries, and an input event follows", () => {
    pasteByHand(window);
    const box = document.createElement("textarea");
    document.body.appendChild(box);
    box.value = "Cool. ";
    box.setSelectionRange(6, 6);
    const inputs = [];
    box.addEventListener("input", (e) => inputs.push(e.inputType));
    const event = paste(box, " test 123. ");
    expect(event.defaultPrevented).toBe(true);
    expect(box.value).toBe("Cool.  test 123. ");
    expect(inputs).toEqual(["insertFromPaste"]);
});

test("a paste with no words, or one a field's own handler already took, is left alone", () => {
    pasteByHand(window);
    const box = document.createElement("input");
    document.body.appendChild(box);
    box.addEventListener("paste", (e) => e.preventDefault());
    paste(box, "taken elsewhere");
    expect(box.value).toBe("");
    const other = document.createElement("input");
    document.body.appendChild(other);
    const event = paste(other, "");
    expect(event.defaultPrevented).toBe(false);
});
