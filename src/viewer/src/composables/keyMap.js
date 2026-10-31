import {useWindowEvent} from "./windowEvent.js";

const TYPING = "input,textarea,select,[contenteditable]";

export function useKeyMap(keys, on = () => true) {
    function pressed(event) {
        const act = keys[event.key];
        if (!act || !on() || event.target.closest?.(TYPING)) return;
        event.preventDefault();
        act(event);
    }
    useWindowEvent("keydown", pressed);
}
