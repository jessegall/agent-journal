// the item some steps away from the current one in a list, stopping at its ends; with no current item, the first
export function steppedItem(items, current, by) {
    const at = items.indexOf(current);
    return items[at < 0 ? 0 : Math.max(0, Math.min(items.length - 1, at + by))];
}
