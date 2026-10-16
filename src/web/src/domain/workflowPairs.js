// a workflow answers one event, bound to a state or to none: what a row says about it, and the event's list in the order the workflows run
export function statusOf(workflow) {
    if (workflow.off) return "Turned off";
    if (workflow.failed) return "Failed";
    if (!workflow.shipped) return "Made by you";
    if (workflow.edited) return "Changed by you";
    return "";
}

export function markOf(workflow) {
    if (!workflow) return "none";
    if (workflow.off) return "off";
    if (workflow.failed) return "failed";
    if (!workflow.shipped || workflow.edited) return "yours";
    return "default";
}

export const MARKS = [
    {mark: "default", words: "Default"},
    {mark: "yours", words: "Changed or made by you"},
    {mark: "off", words: "Turned off"},
    {mark: "failed", words: "Last run failed"},
    {mark: "none", words: "No workflow"},
];

export function pairs(workflows, states, catalogue) {
    const titleOf = (key) => states.find((s) => s.key === key)?.title || key;
    const parentOf = (key) => states.find((s) => s.key === key)?.parent || "";
    // the state and its parents, nearest first: a filter on a state shows the workflows that run while the agent is in it
    const lineageOf = (key) => {
        const names = [];
        for (let name = key; name; name = parentOf(name)) names.push(name);
        return names;
    };
    const byPlace = (a, b) => a.place - b.place || a.id - b.id;
    const answering = (event) => workflows.filter((w) => w.event === event).sort(byPlace);
    // the event's list as it runs for a state: the stateless ones always, and the ones bound to the nearest state in the lineage that has any; no filter shows the whole list
    const listFor = (event, state) => {
        const all = answering(event);
        if (!state) return all;
        const nearest = lineageOf(state).find((name) => all.some((w) => w.state === name));
        return all.filter((w) => !w.state || w.state === nearest);
    };
    const whoOf = (workflow) => (workflow.state ? `when the agent is ${titleOf(workflow.state).toLowerCase()}` : "always");
    const agentEvents = catalogue.filter((e) => e.kind === "trigger" && !e.group);
    const rowEvents = catalogue.filter((e) => e.kind === "trigger" && e.group);
    // the events listed: every agent event, and the row events any workflow answers
    const events = () => [...agentEvents, ...rowEvents.filter((e) => answering(e.key).length)];
    const addable = () => rowEvents.filter((e) => !answering(e.key).length);
    return {titleOf, parentOf, lineageOf, answering, listFor, whoOf, events, addable};
}
