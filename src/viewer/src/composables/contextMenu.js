import {ref} from "vue";

// the groups of a menu in the order they are drawn: open and close, copy and reveal, the page's own actions, then delete in red
const GROUPS = ["open", "copy", "own", "delete"];
const groupOf = (item) => (item.danger ? "delete" : item.group ?? "own");

// items: [{label, group, keys, children, danger, disabled, reason, run}] in any order; the menu draws them in group order with a separator between groups
export function menuEntries(items) {
    const groups = GROUPS.map((group) => items.filter((item) => groupOf(item) === group)).filter((group) => group.length);
    return groups.flatMap((group, at) => [
        ...(at ? [{separator: true, key: `separator-${at}`}] : []),
        ...group.map((item, place) => ({...item, key: `${at}-${place}`})),
    ]);
}

// the one open menu of a component: it opens at the pointer, or under the focused element on Shift+F10 or the Menu key, and gives focus back to the element it belongs to
export function useContextMenu() {
    const menu = ref(null);
    // focus goes back to returnTo, which is the element the menu belongs to unless the shell says it was somewhere else
    let returnTo = null;
    const show = (at, head, items, target, back = target) => {
        returnTo = back;
        menu.value = {at, head, items, target};
    };

    function open(event, head, items) {
        event.preventDefault();
        show({x: event.clientX, y: event.clientY}, head, items, event.currentTarget);
    }

    function openFromKey(event, head, items) {
        if (event.key !== "ContextMenu" && !(event.shiftKey && event.key === "F10")) return;
        event.preventDefault();
        const box = event.target.getBoundingClientRect();
        show({x: Math.max(8, box.left + 8), y: Math.min(window.innerHeight - 8, box.bottom + 2)}, head, items, event.currentTarget);
    }

    function close() {
        menu.value = null;
        if (returnTo?.isConnected) returnTo.focus({preventScroll: true});
    }

    return {menu, show, open, openFromKey, close};
}
