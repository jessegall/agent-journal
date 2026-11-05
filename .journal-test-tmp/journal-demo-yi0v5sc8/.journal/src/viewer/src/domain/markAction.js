import {meta} from "./tables.js";

// what a mark's one-click action opens, named for the kind of thing it opens: Open the task, Open the output, Open the agent
const OWN_WORDS = {outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page"};

export function actionLabel(table) {
    const word = OWN_WORDS[table] || meta(table)?.title.toLowerCase();
    return word ? `Open the ${word}` : "Open it";
}

// the action of a mark whose card names what it is about by its ref, as tasks:12
export const refAction = (ref) => actionLabel(String(ref).split(":")[0]);
