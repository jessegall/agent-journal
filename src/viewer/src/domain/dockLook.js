import {meta} from "./tables.js";

// the title of a docked item: its declaration's words with {row_id} and {row_title} filled
export const dockTitle = (item, declaration) =>
    (declaration?.title || "").replace("{row_id}", String(item.target_id)).replace("{row_title}", item.row_title || "");

const own = (action, icon, label, runs) => ({action, icon, label, runs});

// the buttons of a docked item: undock; keep while the item would leave by itself; open when its row has an inspector; then the declaration's own
export function dockButtons(item, declaration) {
    return [
        ...(item.leaves_at && !item.kept ? [own("keep", "pin", "Keep", `dock keep ${item.id}`)] : []),
        ...(meta(item.target_model) ? [{action: "open", icon: "open", label: "Open", runs: ""}] : []),
        ...(declaration?.buttons || []).map((button) => ({...button, action: "declared"})),
        own("undock", "close", "Undock", `dock remove ${item.id}`),
    ];
}

export const dockLook = (item, declaration) => ({
    icon: declaration?.icon || "",
    title: dockTitle(item, declaration),
    buttons: dockButtons(item, declaration),
});
