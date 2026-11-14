import {copying, peekRef} from "@journal/window-kit";

// the items of a document's or a report's menu, the same in a right click on its row and in the Actions button of its reader.
// There is no Duplicate and no Delete: a text is closed, not removed. ask(kind) opens the dialog of that kind (edit, settle); open() chooses the row, where the menu is a row's
export const TABLES = {doc: "docs", report: "reports"};
export const TERM_WORDS = {doc: "document", report: "report"};
export const isClosed = (row) => Boolean(row.close_reason);

export function documentMenu(row, term, {ask, open = null}) {
    return [
        ...(open ? [{label: "Open", group: "open", run: open}] : []),
        {label: "Open in the inspector", group: "open", run: () => peekRef(`${TABLES[term]}:${row.id}`)},
        {label: "Copy the command", group: "copy", run: ({say}) => copying(`journal ${term} show ${row.id}`, "the command", say)},
        {label: "Edit the text", group: "own", run: () => ask("edit")},
        ...(isClosed(row) ? [] : [{label: "Mark as needing no action", group: "own", run: () => ask("settle")}]),
    ];
}
