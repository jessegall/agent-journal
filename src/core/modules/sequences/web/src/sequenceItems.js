import {deleteItem, removed} from "@journal/window-kit";
import {canAbandon, runsOf} from "./sequenceWords.js";

// the items of a sequence's menu, the same in the right click on its row and in the Actions button of its reader.
// act(line, change) runs a journal line through the window; ask(kind, sequence, run) opens the dialog of that kind (new, copy, steps, trigger, abandon); open() chooses the row, where the menu is a row's
export function sequenceItems(sequence, runs, {act, ask, open = null}) {
    const mine = runsOf(sequence, runs);
    const abandonable = mine.filter((run) => canAbandon(run, runs));
    const said = (words) => async ({say}) => {
        const answer = await words.line();
        say(answer.ok ? words.done : answer.error);
    };
    return [
        ...(open ? [{label: "Open", group: "open", run: open}] : []),
        {label: "Start", group: "own", disabled: mine.length > 0, reason: "Running", run: said({line: () => act(["sequence", "run", String(sequence.id)]), done: `Sequence ${sequence.id} started`})},
        ...abandonable.map((run) => ({label: `Abandon run ${run.id}`, group: "own", run: () => ask("abandon", sequence, run)})),
        {label: "Edit steps", group: "own", run: () => ask("steps", sequence)},
        {label: "Add trigger", group: "own", run: () => ask("trigger", sequence)},
        {label: "Duplicate", group: "own", run: () => ask("copy", sequence)},
        deleteItem({name: `sequence ${sequence.id}`, remove: () => act(["sequence", "delete", String(sequence.id)], removed(sequence.id))}),
    ];
}
