import {store} from "../state/store.js";
import {markIcon} from "./markIcon.js";

// The chat card kinds, their families and groups as the features declare them, served with the manifest the viewer boots from:
// each kind's label, its family's icon, group and colouring, whether it is one of the family's main cards, whether it is shown until
// hidden, the viewer's turn kinds and message kinds it covers, and the other kinds hiding it hides too.
const registry = () => store.spec?.marks || {groups: [], kinds: []};
const kinds = () => registry().kinds;
const keysOf = (rows) => rows.map((kind) => kind.key);

// the colour of each outcome a card reports: blue running, green passed, red failed, orange warned
const OUTCOME_TONES = {running: "work", passed: "good", failed: "bad", warned: "warn"};

// A card's icon, its family's, its own mark icon, its group, whose mark it is, and its colour, its outcome's wherever it reports one;
// a card from before the registry, or of a kind it does not know, keeps the icon and tone it was written with
export const cardLook = (card, label = "") => {
    const kind = kinds().find((row) => row.key === card.shows);
    if (!kind) return {icon: card.icon || "dot", tone: card.tone || OUTCOME_TONES[card.outcome] || "", group: "", markIcon: ""};
    return {icon: kind.icon, tone: OUTCOME_TONES[card.outcome] || "", group: kind.group, markIcon: markIcon(kind.key, {...card, label})};
};

// the family a card's kind belongs to as its feature declares it, its key and title, or null for a kind the registry does not know
export function familyOf(shows) {
    const kind = kinds().find((row) => row.key === shows);
    return (kind && (registry().families || []).find((family) => family.key === kind.family)) || null;
}

// the marks the chat hides until the user shows them
export const defaultHidden = () => keysOf(kinds().filter((kind) => !kind.shown));

// the marks the chat hid by default before every mark showed, which a pane still holding exactly that list never chose itself
const FORMER_DEFAULT_HIDDEN = ["acknowledgements", "verifiers", "conflicts", "sequence_steps", "worker_steps", "worker_tests"];
const isFormerDefault = (hidden) => hidden.length === FORMER_DEFAULT_HIDDEN.length && FORMER_DEFAULT_HIDDEN.every((key) => hidden.includes(key));

// the marks a pane hides: the ones the user chose, or the default for a pane that never chose or still holds the former default
export const hiddenOf = (saved) => (!saved || isFormerDefault(saved) ? defaultHidden() : saved);

// every chat mark kind, which the Only chat preset hides all at once, leaving the user's and the agent's words, the docks and the pins
export const allMarks = () => keysOf(kinds());

const turnKind = (kind) => kinds().find((row) => row.turns.includes(kind))?.key;
const messageKind = (kind) => kinds().find((row) => row.messages.includes(kind))?.key || "";

export const kindOf = (turn) => {
    if (turn.kind === "message") return messageKind(turn.acknowledgement ? "acknowledgement" : turn.data?.kind);
    return turn.data?.shows || turnKind(turn.kind) || "";
};

const isCovered = (hidden, kind) => kinds().some((row) => hidden.includes(row.key) && row.covers.includes(kind));

export const visibleIn = (hidden) => (turn) => !hidden.includes(kindOf(turn)) && !isCovered(hidden, kindOf(turn));

const groupKinds = (group) => kinds().filter((kind) => kind.group === group.key);
const detailsOf = (group) => keysOf(groupKinds(group).filter((kind) => !kind.main));
const without = (hidden, keys) => hidden.filter((key) => !keys.includes(key));

// Each group as Show in chat lists it: off when every one of its kinds is hidden, main only when exactly its details are, and its kinds
// with whether each shows.
export const visibilityChoices = (hidden) =>
    registry().groups.map((group) => {
        const keys = keysOf(groupKinds(group));
        const shown = without(keys, hidden);
        const details = detailsOf(group);
        return {
            ...group,
            on: shown.length > 0,
            details: details.length > 0,
            mainOnly: details.length > 0 && shown.length === keys.length - details.length && details.every((key) => hidden.includes(key)),
            kinds: groupKinds(group).map((kind) => ({...kind, on: !hidden.includes(kind.key)})),
        };
    });

// the marks hidden once a group's switch is flipped: all of its kinds shown, or all of them hidden
export const groupSwitched = (hidden, group) => {
    const keys = keysOf(groupKinds(group));
    return group.on ? [...without(hidden, keys), ...keys] : without(hidden, keys);
};

// the marks hidden once a group shows only its main marks, or shows its details again
export const mainOnlyToggled = (hidden, group) => {
    const keys = keysOf(groupKinds(group));
    return group.mainOnly ? without(hidden, keys) : [...without(hidden, keys), ...detailsOf(group)];
};

// the presets the Show in chat menu offers, each the marks it hides
export const presets = () => [
    {key: "chat", label: "Only chat", icon: "chat", hidden: allMarks()},
    {key: "context", label: "Chat with context", icon: "list", hidden: defaultHidden()},
];

export const presetOf = (hidden) =>
    presets().find((preset) => preset.hidden.length === hidden.length && preset.hidden.every((key) => hidden.includes(key)))?.key ?? "";

export const toggled = (hidden, key) => (hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key]);
