import {copying, deleteItem} from "@journal/window-kit";

// the words of a secret card and its menu: the card has the same lines whatever is configured, and a delete erases the value for good, so it has no Undo
export const ICONS = {"api key": "key", login: "lock", custom: "rows"};
export const LABELS = {"api key": "API key", login: "Login", custom: "Custom"};
export const NEEDS = "Needs credentials";
export const READY = "Ready";

export const secretCard = (row) => ({
    id: row.id,
    title: row.title,
    icon: ICONS[row.secret_type],
    state: row.waiting ? NEEDS : LABELS[row.secret_type],
    status: row.waiting ? NEEDS : READY,
    kind: LABELS[row.secret_type],
    line: row.brief || "Note: none",
    programs: row.programs.length ? row.programs.join(", ") : "none",
    row,
});

export const secretFields = [
    {key: "status", label: "State", options: [[READY, READY], [NEEDS, NEEDS]], get: (item) => item.status},
    {key: "kind", label: "Kind", options: Object.values(LABELS).map((label) => [label, label]), get: (item) => item.kind},
];

// Replace value opens the secret's dialog, Copy name copies the title (never the value), and Delete asks once in place
export function secretMenu(item, {edit, remove}) {
    return [
        {label: item.row.waiting ? "Add credentials" : "Replace value", group: "open", run: edit},
        {label: "Copy name", group: "copy", run: ({say}) => copying(item.title, item.title, say)},
        {label: "Duplicate", group: "own", disabled: true, reason: "A secret's value is never copied"},
        deleteItem({word: "Delete", name: item.title, remove, erase: true}),
    ];
}
