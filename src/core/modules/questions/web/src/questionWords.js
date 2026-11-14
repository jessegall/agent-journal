import {peekRef} from "@journal/window-kit";

// the Questions window's words: the open questions and the done ones (answered and closed), the clock time of a card, the asking agent and the plan a question belongs to
export const isOpen = (row) => row.state === "open";
export const clockOf = (at) => (at ? new Date(at).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false}) : "");
export const askerOf = (row) => row.agent_name || `Agent ${row.session_agent_id}`;
export const planOf = (row) => (row.row_model === "plan" ? row.row_id : null);

// More: Elaborate asks the agent to ask again with more context, Close closes the question; Open reads it in the inspector
export function questionMenu(row, {elaborate, close, elaborated}) {
    return [
        {label: "Open", group: "open", run: () => peekRef(`questions:${row.id}`)},
        {label: elaborated ? "Asked to elaborate" : "Elaborate", group: "own", disabled: elaborated, reason: "Already asked", run: elaborate},
        {label: "Close", group: "own", run: close},
    ];
}
