import {meta} from "./spec.js";

const COMMON = {created: "is created", completed: "is closed"};
const OWN = {
    message: {
        created: "is sent",
        completed: "is closed",
        requested: "asks for new work on a board",
        revised: "asks for changes to a board's draft tickets",
        commissioned: "sends a document to turn into tickets",
    },
    ticket: {
        plan_waits: "has a plan waiting for approval",
        checkpoint: "reaches a checkpoint",
        finished: "finishes its plan",
        stuck: "has an agent that is stuck",
        escalated: "needs your attention",
    },
    board: {
        commissioned: "is created from a document",
        started: "starts",
        paused: "is paused",
        resumed: "is resumed",
        finished: "finishes",
    },
};

export const momentWord = (type, moment) => OWN[type]?.[moment] || COMMON[moment] || moment.replaceAll("_", " ");

export const momentsOf = (type) => (meta(type)?.moments || []).map((moment) => ({value: moment, label: momentWord(type, moment)}));

export function eventWords(event) {
    const [type, moment] = event.split(".");
    return `a ${meta(type).title.toLowerCase()} ${momentWord(type, moment)}`;
}
