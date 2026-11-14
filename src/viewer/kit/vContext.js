// The right-click menu of a place is declared where the place is drawn: v-context on the element, with the place or a function that makes it when the menu opens.
//   <li v-context="() => ({head: 'Task 12', items: [{label: 'Open', group: 'open', run: open}]})">
// A place is {head, items, quote}; items are the items of ContextMenu, whose run is given {say} to tell the person what happened ({say: (text) => ...}),
// and quote, when the place can take a quote, is called with the selected text. A function that answers nothing declines the place, and the next one up is asked.
// The shell takes the most particular place under the pointer, the one on the element nearest to it. The place sits on the element under a shared key, so the shell
// and a window built apart find each other's.
export const PLACE = Symbol.for("journal.context-place");

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
        const declared = element[PLACE];
        const place = typeof declared === "function" ? declared(element) : declared;
        if (place?.items?.length) return {...place, el: element};
    }
    return null;
}
