// The right-click menu of a place is declared where the place is drawn: v-context on the element, with the place or a function that makes it when the menu opens.
//   <li v-context="() => ({head: 'Task 12', items: [{label: 'Open', group: 'open', run: open}]})">
// A place is {head, items, quote}; items are the items of ContextMenu, whose run is given {say} to tell the person what happened ({say: (text) => ...}),
// and quote, when the place can take a quote, is called with the selected text. A function that answers nothing declines the place, and the next one up is asked.
// The shell takes the most particular place under the pointer, the one on the element nearest to it. The place sits on the element under a shared key, so the shell
// and a window built apart find each other's.
import {copying, short} from "../src/domain/contextItems.js";
import {peekRef} from "../src/route.js";

export const PLACE = Symbol.for("journal.context-place");

// a reference to a row anywhere (an element with data-peek="tasks:12") is a place without a declaration: open it or copy its words
const referencePlace = (element) => {
    const words = (element.title || element.textContent).trim().replace(/\s+/g, " ");
    return {
        head: short(words, 40),
        items: [
            {label: "Open", group: "open", run: () => peekRef(element.dataset.peek, element.dataset.sub || "")},
            {label: "Copy reference", group: "copy", run: ({say}) => copying(words.toLowerCase(), "", say)},
        ],
    };
};

export const vContext = {
    mounted(element, binding) {
        element[PLACE] = binding.value;
    },
    updated(element, binding) {
        element[PLACE] = binding.value;
    },
    unmounted(element) {
        delete element[PLACE];
    },
};

// the place nearest to the target, with the element that declares it, or null where nothing is declared
export function placeUnder(target) {
    for (let element = target; element; element = element.parentElement) {
        const declared = element[PLACE] ?? (element.dataset?.peek ? referencePlace : null);
        const place = typeof declared === "function" ? declared(element) : declared;
        if (place?.items?.length) return {...place, el: element};
    }
    return null;
}
