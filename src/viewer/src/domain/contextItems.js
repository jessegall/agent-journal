import {copyText} from "../platform/clipboard.js";
import {onMac} from "../platform/keys.js";
import {insert} from "../platform/pasteByHand.js";
import {go} from "../route.js";

export const short = (text, size = 40) => (text.length > size ? `${text.slice(0, size - 1)}…` : text);
const chord = (letter) => (onMac ? `⌘${letter}` : `Ctrl+${letter}`);

// copies words and says so; what names the thing copied when the words themselves are long
export async function copying(text, what, say) {
    say((await copyText(text)) ? `Copied ${what || short(text)}` : "The browser did not allow copying");
}

// a text field keeps Cut, Copy, Paste and Select all, since the browser's own menu is gone there too
export function fieldItems(field) {
    const picked = field.selectionStart != null ? field.value.slice(field.selectionStart, field.selectionEnd) : String(getSelection());
    const locked = field.readOnly || field.disabled;
    const paste = ({say}) => {
        field.focus();
        Promise.resolve().then(() => navigator.clipboard.readText()).then((text) => insert(field, text)).catch(() => say(`The browser did not allow pasting: press ${chord("V")}`));
    };
    return [
        {label: "Cut", group: "copy", keys: chord("X"), disabled: !picked || locked, reason: locked ? "Read only" : "Nothing chosen", run: () => (field.focus(), document.execCommand("cut"))},
        {label: "Copy", group: "copy", keys: chord("C"), disabled: !picked, reason: "Nothing chosen", run: ({say}) => copying(picked, "", say)},
        {label: "Paste", group: "copy", keys: chord("V"), disabled: locked, reason: "Read only", run: paste},
        {label: "Select all", group: "own", keys: chord("A"), run: () => (field.focus(), field.select ? field.select() : document.execCommand("selectAll"))},
    ];
}

// chosen text: copy it, look for it, or quote it where the place can take a quote
export function selectionItems(picked, quote) {
    return [
        {label: "Copy", group: "copy", run: ({say}) => copying(picked, "", say)},
        {label: "Search for it", group: "own", run: () => go("search", 0, picked)},
        {label: "Quote in a comment", group: "own", disabled: !quote, reason: "Not here", run: () => quote(picked)},
    ];
}

// empty space: the page itself
export const pageItems = () => [
    {label: "Search", group: "open", run: () => go("search")},
    {label: "Copy link to this page", group: "copy", run: ({say}) => copying(location.href, "the link", say)},
    {label: "Reload", group: "own", run: () => location.reload()},
];


// The delete item of a row: it asks once in place, then sends the delete and says what it did.
// word is Delete or Remove, and the toast says it in the past ("Deleted", "Removed"). remove() answers {ok, error}.
// restore is the journal command that brings the row back (["memory", "restore", "12"]) and gives the toast an Undo for 6 seconds; a model with no such command passes none and gets no Undo.
// erase is for a value that is gone for good, like a secret's: it says so when it asks and has no Undo.
export function deleteItem({word = "Delete", name, remove, restore = null, erase = false}) {
    return {
        label: word,
        danger: true,
        armedLabel: erase ? "Click again: the value is erased for good" : `${word}: click again`,
        run: async ({say}) => {
            const answer = await remove();
            if (!answer.ok) return say(answer.error);
            if (erase) return say(`Deleted ${name}. The value is erased.`);
            say(`${word}d ${name}`, restore ? {line: restore} : null);
        },
    };
}
