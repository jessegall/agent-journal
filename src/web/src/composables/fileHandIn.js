import {useWindowEvent} from "./windowEvent.js";

const TYPING = "input,textarea,[contenteditable]";

export function useFileHandIn({active, take, pastedText = false}) {
    function dropped(event) {
        const file = event.dataTransfer && event.dataTransfer.files[0];
        if (!active() || !file) return;
        event.preventDefault();
        take(file);
    }

    // A paste into a field that carries text is the field's, whatever else rides on the clipboard: a dictation tool
    // pastes its words with a file beside them, and taking that file would eat the words.
    function pasted(event) {
        if (!active() || !event.clipboardData) return;
        const file = event.clipboardData.files[0];
        const words = event.clipboardData.getData("text");
        if (event.target.closest(TYPING) && (words.trim() || !file)) return;
        const text = pastedText ? words : "";
        if (!file && !text.trim()) return;
        event.preventDefault();
        take(file || new File([text], "Pasted document.md", {type: "text/markdown"}));
    }

    useWindowEvent("dragover", (event) => active() && event.preventDefault());
    useWindowEvent("drop", dropped);
    useWindowEvent("paste", pasted);
}
