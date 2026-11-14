import {copying} from "@journal/window-kit";

// the words of the Teams page: an item of the library is Update, Up to date or Not followed on this journal, and an update says which way it goes
export const KIND_WORDS = {doc: "Document", sequence: "Sequence", check: "Check"};
export const GROUP_WORDS = {doc: "Documents", sequence: "Sequences", check: "Checks"};
export const STATE_WORDS = {update: "Update", current: "Up to date", unfollowed: "Not followed"};
export const KEEPS_REVISIONS = ["doc"];
const CHANGED_HERE = ["unsent", "sending", "agent", "denied", "rejected", "paused"];

const stateOf = (copy) => (!copy ? "unfollowed" : copy.status === "synced" ? "current" : "update");
const wayOf = (copy) => {
    if (stateOf(copy) !== "update") return "";
    if (copy.status === "removed") return "Removed from the library";
    return CHANGED_HERE.includes(copy.status) ? "Changed here" : "Newer in library";
};

export const teamFields = [
    {key: "kind", label: "Type", options: Object.entries(KIND_WORDS), get: (item) => item.row.share},
    {key: "state", label: "State", options: Object.entries(STATE_WORDS), get: (item) => item.state},
];

// the library's items with this journal's copy of each, and the copies whose item the library no longer lists; the group names the kind, so a row says only which way an update goes and who shared it
export function teamItems(listing, copies) {
    const byItem = new Map(copies.map((copy) => [`${copy.share}:${copy.item_id}`, copy]));
    const listed = listing.map((row) => ({id: `${row.share}:${row.id}`, title: row.title, share: row.share, item_id: row.id, by: row.updated_by, at: row.updated_at, version: row.version, copy: byItem.get(`${row.share}:${row.id}`) ?? null}));
    const unlisted = copies.filter((copy) => !listing.some((row) => row.share === copy.share && row.id === copy.item_id))
        .map((copy) => ({id: `${copy.share}:${copy.item_id}`, title: copy.local_fields.title, share: copy.share, item_id: copy.item_id, by: "", at: "", version: copy.version, copy}));
    return [...listed, ...unlisted].map((entry) => {
        const state = stateOf(entry.copy);
        return {id: entry.id, title: entry.title, desc: [wayOf(entry.copy), entry.by].filter(Boolean).join(" · "), group: GROUP_WORDS[entry.share], state, way: wayOf(entry.copy), row: entry};
    });
}

// the one action that waits on a row: Follow, Update or Share; the menu of a right click and the reader's Actions say the same
export const primaryOf = (item) => (item.state === "unfollowed" ? "Follow" : item.state === "update" ? (item.way === "Changed here" ? "Share" : "Update") : "");

export function teamMenu(item, {open, act, canWrite, leave}) {
    const primary = primaryOf(item);
    return [
        ...(open ? [{label: "Open", group: "open", run: open}] : []),
        ...(primary ? [{label: primary, group: "open", disabled: !canWrite && primary !== "Follow", reason: "Your role may not change the library", run: () => act(primary)}] : []),
        {label: "Copy name", group: "copy", run: ({say}) => copying(item.title, item.title, say)},
        ...(item.row.copy ? [{label: "Stop following", group: "own", run: leave}] : []),
    ];
}
