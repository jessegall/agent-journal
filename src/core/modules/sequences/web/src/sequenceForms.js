import {TRIGGER_TYPES, blankTrigger, triggerBody, triggersProblem} from "./sequenceTriggers.js";

// the dialogs of the Sequences page: what each asks, its check and the journal line it runs
const STEP_MISSING = "Add instructions for each step.";
export const stepsField = (steps) => ({key: "steps", label: "Steps, in order", kind: "slot", required: true, value: steps});
export const checkSteps = (values) => (values.steps.some((step) => !step.trim()) ? {steps: STEP_MISSING} : {});
const quoted = (word) => (/\s/.test(word) ? JSON.stringify(word) : word);
const shown = (words) => `journal ${words.map(quoted).join(" ")}`;

// a new sequence, and a copy of one
export const newSequenceFields = (title = "", steps = [""]) => [{key: "title", label: "Title", required: true, placeholder: "Releasing a version", value: title}, stepsField(steps)];
export const checkNewSequence = (values) => (values.title.trim() ? checkSteps(values) : {title: "Give the sequence a title."});
export const newSequenceLine = (values) => ["sequence", "make", values.title.trim(), "--steps", values.steps.map((step) => step.trim()).join(" | ")];
export const newSequenceCommand = (values) => shown(["sequence", "make", values.title.trim() || "…", "--steps", values.steps.map((step) => step.trim()).join(" | ") || "…"]);

const guardsOf = (sequence) => JSON.parse(sequence.step_guards || "[]");
const NO_GUARD = {file_edits_allowed: true, allowed_commands: []};

// editing the steps keeps the guard each step had, by its place, and a step that was added has none
export const editStepsLine = (sequence, values) => ["sequence", "edit", String(sequence.id), "--steps", ...values.steps.map((step) => step.trim()), "--step-guards", JSON.stringify(values.steps.map((_, index) => guardsOf(sequence)[index] ?? NO_GUARD))];
export const editStepsCommand = (sequence) => () => shown(["sequence", "edit", String(sequence.id), "--steps", "…"]);

// a trigger: its kind, then the fields that kind is written with, each under its own key
const fieldKey = (type, name) => `${type.value}:${name}`;
const OPTIONAL = {tool: ["pattern"]};
export const triggerFields = [
    {key: "kind", label: "Starts when", kind: "select", options: TRIGGER_TYPES.map((type) => [type.value, type.label])},
    ...TRIGGER_TYPES.flatMap((type) => type.fields.map((field) => ({key: fieldKey(type, field.name), label: field.label, placeholder: field.placeholder, required: !(OPTIONAL[type.value] ?? []).includes(field.name), when: (values) => values.kind === type.value}))),
];
const triggerOf = (values) => ({...blankTrigger(), trigger_type: values.kind, ...Object.fromEntries(TRIGGER_TYPES.find((type) => type.value === values.kind).fields.map((field) => [field.name, values[fieldKey({value: values.kind}, field.name)] ?? ""]))});
export const checkTrigger = (values) => {
    const problem = triggersProblem([triggerOf(values)]);
    return problem ? {[Object.keys(values).find((key) => key.startsWith(`${values.kind}:`))]: "Complete every field."} : {};
};
export const addTriggerLine = (sequence, values) => ["sequence", "edit", String(sequence.id), "--triggers", JSON.stringify([...JSON.parse(sequence.triggers || "[]"), triggerBody(triggerOf(values))])];
export const addTriggerCommand = (sequence) => () => shown(["sequence", "edit", String(sequence.id), "--triggers", "…"]);

// giving a run up: the server takes the run on top of the agent's stack, and asks for the reason
export const abandonFields = [{key: "why", label: "Why", required: true, placeholder: "The plan changed"}];
export const abandonLine = (values) => ["sequence", "abandon", "--why", values.why.trim(), "--sure"];
export const abandonCommand = (values) => shown(["sequence", "abandon", "--why", values.why.trim() || "…", "--sure"]);
