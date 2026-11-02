import {meta} from "./tables.js";

// the title of a docked item: the one it was docked with, else its declaration's words with {row_id} and {row_title} filled
export const dockTitle = (item, declaration) =>
    item.title ||
    (declaration?.title || "").replace("{row_id}", String(item.target_id)).replace("{row_title}", item.row_title || "");

const own = (action, icon, label, runs) => ({action, icon, label, runs});

// the buttons of a docked item: keep while the item would leave by itself; the declaration's own; open when its row has an inspector, unless its body draws the head and unfolds there; then undock
export function dockButtons(item, declaration) {
    return [
        ...(item.leaves_at && !item.kept ? [own("keep", "pin", "Keep", `dock keep ${item.id}`)] : []),
        ...(declaration?.buttons || []).map((button) => ({...button, action: "declared"})),
        ...(!declaration?.draws_head && (declaration?.reads?.length || meta(item.target_model)) ? [{action: "open", icon: "open", label: "Open", runs: ""}] : []),
        own("undock", "close", "Undock", `dock remove ${item.id}`),
    ];
}

export const dockLook = (item, declaration) => ({
    icon: declaration?.icon || "",
    title: dockTitle(item, declaration),
    buttons: dockButtons(item, declaration),
});
