// a locked workflow or step is the journal's law: what the pages say about it and which controls they take away
export const LOCK_WHY = "Locked: the journal's law. It always runs here.";
export const LOCK_RULE =
    "You can add steps after it, change its numbers and reset to default; it cannot be taken out, reworded or turned off, and no check or Stop here of yours may come before it.";

export function stayOn(workflow) {
    if (!workflow) return "";
    if (workflow.locked) return "Locked: the journal's law. It cannot be turned off or deleted.";
    if (workflow.guarded) return "Holds a locked step: it cannot be turned off.";
    return "";
}

export function nodeLocked(node) {
    return Boolean(node && node.locked);
}
