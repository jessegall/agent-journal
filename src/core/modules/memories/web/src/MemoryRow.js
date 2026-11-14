import {copying, deleteItem, peekRef, short} from "@journal/window-kit";

// the items of a memory's menu, the same in a right click on a row and in the Actions button of its reader. run(line) sends a journal line and answers {ok, error}; ask() opens the Edit dialog.
// The row's menu weighs in three steps the agent knows (9, 7, 5), the reader in the ten steps of the weight; the reader's Open reads Open in inspector
export const MENU_WEIGHTS = [["9", "owed work"], ["7", "later today"], ["5", "work in hand"]];
export const READER_WEIGHTS = Array.from({length: 10}, (_, at) => [String(at + 1), ""]);

export function memoryItems(row, {run, ask, weights = MENU_WEIGHTS, openLabel = "Open"}) {
    const id = String(row.id);
    const removed = row.state === "removed";
    const restore = ["memory", "restore", id];
    const said = (line, done, refused) => async ({say}) => say((await run(line)).ok ? done : refused);
    return [
        {label: openLabel, group: "open", run: () => peekRef(`memories:${row.id}`)},
        {label: "Weigh", group: "open", disabled: removed, reason: "Removed", children: weights.map(([weight, meaning]) => ({
            label: meaning ? `${weight}: ${meaning}` : weight,
            run: said(["memory", "weigh", id, weight], `Memory ${id} weighs ${weight}`, "The journal refused the weight"),
        }))},
        {label: "Copy text", group: "copy", run: ({say}) => copying(row.text, short(row.text, 30), say)},
        {label: "Edit", group: "own", disabled: removed, reason: "Removed", run: ask},
        removed
            ? {label: "Bring it back", group: "own", run: said(restore, `Memory ${id} is back`, "The journal could not restore it")}
            : deleteItem({word: "Remove", name: `memory ${id}`, remove: () => run(["memory", "remove", id, "--reason", "Removed from the memory list"]), restore}),
    ];
}
