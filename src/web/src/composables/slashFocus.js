import {useWindowEvent} from "./windowEvent.js";

const TYPING = ["INPUT", "TEXTAREA", "SELECT"];

export function useSlashFocus(field, on = () => true) {
    function slash(event) {
        if (!on() || event.key !== "/" || TYPING.includes(event.target.tagName) || event.target.isContentEditable) return;
        event.preventDefault();
        field.value?.focus();
    }
    useWindowEvent("keydown", slash);
}
