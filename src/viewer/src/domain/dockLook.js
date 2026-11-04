import {meta} from "./tables.js";

// the title of a docked item: the one it was docked with, else its declaration's words with {row_id} and {row_title} filled
const dockTitle = (item, declaration) =>
    item.title ||
    (declaration?.title || "").replace("{row_id}", String(item.target_id)).replace("{row_title}", item.row_title || "");

const own = (action, icon, label, runs) => ({action, icon, label, runs});

// the pin of an item that leaves by itself: it keeps the item, and pressed again lets it leave
const leavesByItself = (item, declaration) => Boolean(item.leaves_at || item.kept || declaration?.leaves_after_seconds > 0);
const pin = (item) => (item.kept ? own("unkeep", "pin", "Unpin", `dock unkeep ${item.id}`) : own("keep", "pin", "Pin", `dock keep ${item.id}`));

// the buttons drawn as their icon alone, with their words as the tooltip and the screen reader label
const ICON_ONLY = ["pin", "stop"];
const withLook = (button) => ({...button, iconOnly: ICON_ONLY.includes(button.icon)});

// the buttons of a docked item: the pin while the item leaves by itself; the declaration's own; open when its row has an inspector, unless its body draws the head and unfolds there; then undock
function dockButtons(item, declaration) {
    return [
        ...(leavesByItself(item, declaration) ? [pin(item)] : []),
        ...(declaration?.buttons || []).map((button) => ({...button, module: declaration.module, action: "declared"})),
        ...(!declaration?.draws_head && (declaration?.reads?.length || meta(item.target_model)) ? [{action: "open", icon: "open", label: "Open", runs: ""}] : []),
        own("undock", "close", "Undock", `dock remove ${item.id}`),
    ].map(withLook);
}

export const dockLook = (item, declaration) => ({
    icon: declaration?.icon || "",
    title: dockTitle(item, declaration),
    buttons: dockButtons(item, declaration),
});
