// How a step of a workflow is drawn as a card: its size, where its ports sit and what they are called.
export const CARD = {width: 240, plain: 48, text: 84};
export const PORT_AT = {then: 50, yes: 30, no: 70};
export const WORD = {then: "Next", yes: "Yes", no: "No"};
export const KIND = {trigger: "Trigger", check: "Check", action: "Action"};
export const STOPS_WHY = "When this step runs, no later workflow of the event runs; the agent is not stopped by it";

export const portWord = (node, port) => (node.key === "count_wait" && port === "no" ? "Waits here" : WORD[port]);
export const stopsTheWalk = (node) => node.kind === "action" && ["stop_here", "block_stop"].includes(node.key);
export const placeholderOf = (node) => (node.kind === "check" ? "A number, or the name of a setting" : "Message to the agent");
