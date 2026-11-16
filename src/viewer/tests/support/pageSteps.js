import {settle} from "./windowContext.js";

// the steps the page tests share: picking a row, typing into a field, sending a form, applying settings and opening a git tab
export const rowOf = (element, id) => element.querySelector(`[data-row="${id}"]`);
export const choose = async (element, id) => {
    rowOf(element, id).click();
    await settle();
};
export const typeField = async (name, text) => {
    const field = document.body.querySelector(`[data-field="${name}"]`);
    field.value = text;
    field.dispatchEvent(new Event(field.tagName === "SELECT" ? "change" : "input", {bubbles: true}));
    await settle();
};
export const send = async () => {
    document.body.querySelector("[data-create-send]").click();
    await settle();
};
export const applySettings = async (element) => {
    element.querySelector("[data-settings-apply]").click();
    await settle();
};
export const gitTab = async (element, word) => {
    [...element.querySelectorAll("[data-git-tabs] button")].find((button) => button.textContent.includes(word)).click();
    await settle();
};
