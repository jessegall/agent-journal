import {counted} from "../format/number.js";
import {ago} from "../format/time.js";

export const KEPT_DAYS = 30;
const DAY = 86400;

export const KINDS = [
    {
        key: "api key",
        title: "API key",
        icon: "key",
        line: "One key a service gave you, such as a token.",
        fields: [{name: "key", hidden: true}],
    },
    {
        key: "login",
        title: "Login",
        icon: "lock",
        line: "A username and a password for a site or a tool.",
        fields: [
            {name: "username", hidden: false},
            {name: "password", hidden: true},
        ],
    },
    {
        key: "custom",
        title: "Custom",
        icon: "tools",
        line: "Any other values, with fields you name yourself.",
        fields: [{name: "", hidden: true}],
    },
];

const BROWSER_LOGIN = {
    key: "browser login",
    title: "Browser login",
    icon: "lock",
    line: "A site the agent's browser stays logged in to, after you log in once.",
    fields: [],
};

export const kindOf = (row) => [...KINDS, BROWSER_LOGIN].find((k) => k.key === row.data.kind) || KINDS[2];

export const variableOf = (title, name) =>
    `${title}_${name}`
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

export const fieldsOf = (row) => row.data.secret_fields || [];

export const isSet = (row, field) => Boolean((row.data.filled || {})[field.name]);

export const isWaiting = (row) => fieldsOf(row).some((field) => !isSet(row, field));

export const asking = (rows) => rows.filter((row) => row.data.asked && isWaiting(row));

export function whenWords(row) {
    if (row.data.kind === BROWSER_LOGIN.key) return row.data.session ? `Logged in ${ago(row.data.session)}` : "Not logged in yet";
    const used = row.data.used;
    if (used) return `Last used ${ago(used)}`;
    const filled = Object.values(row.data.filled || {});
    if (isWaiting(row)) return filled.length ? `${filled.length} of ${fieldsOf(row).length} values set` : "No value set yet";
    return `Set ${ago(Math.max(...filled))}`;
}

export function daysLeft(row, now = Date.now() / 1000) {
    return Math.max(0, Math.ceil(KEPT_DAYS - (now - row.deleted) / DAY));
}

export const keptWords = (row, now) => `${counted(daysLeft(row, now), "day")} left before its values are removed`;

export function withFields(fields, title) {
    return fields
        .filter((field) => field.name.trim())
        .map((field) => ({
            name: field.name.trim(),
            hidden: field.hidden,
            variable: field.variable || variableOf(title, field.name.trim()),
        }));
}

export function drafted(row) {
    return {
        title: row ? row.title : "",
        abstract: row ? row.abstract : "",
        brief: row ? row.brief : "",
        kind: row ? row.data.kind : "",
        fields: row ? fieldsOf(row).map((field) => ({...field})) : [],
        programs: row ? [...(row.data.programs || [])] : [],
        proposed: row ? [...(row.data.proposed || [])] : [],
        helpers: row ? Boolean(row.data.helpers) : false,
    };
}

export function saved(draft) {
    return {
        title: draft.title.trim(),
        abstract: draft.abstract.trim(),
        brief: draft.brief.trim(),
        secret_fields: withFields(draft.fields, draft.title.trim()),
        programs: draft.programs,
        proposed: draft.proposed,
        helpers: draft.helpers,
    };
}

export function allowedProgram(draft, name) {
    draft.proposed = draft.proposed.filter((proposal) => proposal !== name);
    if (!draft.programs.includes(name)) draft.programs.push(name);
}

export function creating(draft) {
    const {secret_fields: fields, ...rest} = saved(draft);
    return draft.kind === "custom" ? {...rest, kind: draft.kind, secret_fields: fields} : {...rest, kind: draft.kind};
}

export const complete = (draft) => Boolean(draft.title.trim() && draft.kind);

export const handedVariable = (row) => (fieldsOf(row).find((field) => field.hidden) || {variable: ""}).variable;

export const pickable = (rows) => rows.filter((row) => handedVariable(row));

export const pickedBy = (rows, variable) => pickable(rows).find((row) => handedVariable(row) === variable) || null;
