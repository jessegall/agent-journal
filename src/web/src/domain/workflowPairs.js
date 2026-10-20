// a workflow answers each event it holds a trigger for, bound to a state or to none: what a row says about it, and each event's list in the order the workflows run there
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
    // a workflow with no trigger left, turned off, is still listed under the event it was made for
    const answers = (workflow, event) => (Object.keys(workflow.places || {}).length ? event in workflow.places : workflow.event === event);
    const placeAt = (workflow, event) => (workflow.places && event in workflow.places ? workflow.places[event] : workflow.place);
    const answering = (event) => workflows.filter((w) => answers(w, event)).sort((a, b) => placeAt(a, event) - placeAt(b, event) || a.id - b.id);
    const triggerTitle = (key) => catalogue.find((e) => e.kind === "trigger" && e.key === key)?.title || key;
    // the other events a workflow holds a trigger for, by title, so its listing under one says where else it runs
    const alsoOn = (workflow, event) => Object.keys(workflow.places || {}).filter((key) => key !== event).map(triggerTitle);
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
    return {titleOf, parentOf, lineageOf, answering, listFor, whoOf, events, addable, alsoOn};
}
