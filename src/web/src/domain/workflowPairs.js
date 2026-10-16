// one workflow per state per event: what a row says about a workflow, and which workflow a state answers an event with
export function statusOf(workflow) {
    if (workflow.off) return "Turned off";
    if (workflow.failed) return "Failed";
    if (!workflow.shipped) return "Made by you";
    if (workflow.edited) return "Changed by you";
    return "";
}

export function markOf(workflow, borrowed) {
    if (!workflow) return "none";
    if (workflow.off) return "off";
    if (workflow.failed) return "failed";
    if (borrowed) return "borrowed";
    if (!workflow.shipped || workflow.edited) return "yours";
    return "default";
}

export const MARKS = [
    {mark: "default", words: "Default"},
    {mark: "yours", words: "Changed or made by you"},
    {mark: "off", words: "Turned off"},
    {mark: "failed", words: "Last run failed"},
    {mark: "borrowed", words: "From the parent state"},
    {mark: "none", words: "No workflow"},
];

export function pairs(workflows, states, catalogue) {
    const byPair = Object.fromEntries(workflows.map((w) => [`${w.state}:${w.event}`, w]));
    const titleOf = (key) => states.find((s) => s.key === key)?.title || key;
    const parentOf = (key) => states.find((s) => s.key === key)?.parent || "";
    const ownFor = (state, event) => byPair[`${state}:${event}`] || null;
    // the workflow a state answers an event with: its own, or its parent's where it has none
    const servingFor = (state, event) => ownFor(state, event) || (parentOf(state) ? ownFor(parentOf(state), event) : null);
    const agentEvents = catalogue.filter((e) => e.kind === "trigger" && !e.group);
    const rowEvents = catalogue.filter((e) => e.kind === "trigger" && e.group);
    // the events listed for a state: every agent event, and the row events it or its parent has a workflow for
    const eventsFor = (state) => [...agentEvents, ...rowEvents.filter((e) => servingFor(state, e.key))];
    const addableFor = (state) => rowEvents.filter((e) => !servingFor(state, e.key));
    // what an event row says beside its name: the workflow's one status word, or whose it borrows
    const wordsFor = (state, event) => {
        const own = ownFor(state, event);
        const serving = servingFor(state, event);
        return own ? statusOf(own) : serving ? `${titleOf(parentOf(state))}'s` : "";
    };
    return {titleOf, parentOf, ownFor, servingFor, eventsFor, addableFor, wordsFor};
}
