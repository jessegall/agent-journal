import {useWindowEvent} from "./windowEvent.js";

const TYPING = "input,textarea,[contenteditable]";

export function useFileHandIn({active, take, pastedText = false}) {
    function dropped(event) {
        const file = event.dataTransfer && event.dataTransfer.files[0];
        if (!active() || !file) return;
        event.preventDefault();
        take(file);
    }

    function pasted(event) {
        if (!active() || !event.clipboardData) return;
        const file = event.clipboardData.files[0];
        const text = pastedText ? event.clipboardData.getData("text") : "";
        if (!file && (!text.trim() || event.target.closest(TYPING))) return;
        event.preventDefault();
        take(file || new File([text], "Pasted document.md", {type: "text/markdown"}));
    }

    useWindowEvent("dragover", (event) => active() && event.preventDefault());
    useWindowEvent("drop", dropped);
    useWindowEvent("paste", pasted);
}
