import {computed} from "vue";
import {isFull} from "@journal/setting-components";

const CORE = "journal.core.helpers";
export const CONTEXT_ON = `${CORE}.context-limit-on`;
export const CONTEXT_TOKENS = `${CORE}.context-limit-tokens`;
export const CONTEXT_KINDS = `${CORE}.context-limit-kinds`;
export const CONTEXT_PROFILES = `${CORE}.context-limit-profiles`;
export const PROFILE_LIMITS = `${CORE}.read-only-helper-profile-limits`;
export const READ_ONLY_RUN = `${CORE}.read-only-helper-run-limit`;
export const READ_ONLY_KEPT = `${CORE}.read-only-helper-kept-limit`;
export const MERGE_HOOKS = "journal.suites.coding.workers.merge-hooks";

const NO_CAP = "none";
const sizeWord = (tokens) => `${tokens / 1000}k`;
// the name and the value of an entry such as worker:200000 or journal-planner:none
export const entryOf = (text) => {
    const at = text.lastIndexOf(":");
    return {name: text.slice(0, at).trim(), value: text.slice(at + 1).trim()};
};
// a merge hook entry such as journal-worker: npm run deploy, split at its first colon as the server splits it; an entry
// with no colon belongs to no profile and is written back as it was
const hookEntryOf = (text) => {
    const at = text.indexOf(":");
    return at < 0 ? {text, name: "", command: ""} : {text, name: text.slice(0, at).trim(), command: text.slice(at + 1).trim()};
};
export const profileHooks = (entries, profile) => (entries ?? []).map(hookEntryOf).filter((entry) => entry.name === profile).map((entry) => entry.command);
export const changedHooks = (entries, profile, commands) => [
    ...(entries ?? []).map(hookEntryOf).filter((entry) => entry.name !== profile).map((entry) => entry.text),
    ...commands.map((command) => `${profile}: ${command}`),
];
export const valueOf = (entries, name) => (entries ?? []).map(entryOf).find((entry) => entry.name === name)?.value;
const worded = (value) => (value === NO_CAP ? "No cap" : sizeWord(Number(value)));

// the context cap of an agent type or a profile and where it comes from: the entry of the profile, else the entry of
// its kind of agent, else the size set for every agent, as the journal works them out; value reads what the form holds
export function capOf(value, role, profile) {
    if (value(CONTEXT_ON) !== true) return {text: "Off", where: "Context limit is off", own: false};
    const own = profile ? valueOf(value(CONTEXT_PROFILES), profile) : undefined;
    if (own !== undefined) return {text: worded(own), where: "Own value", own: true};
    const kind = valueOf(value(CONTEXT_KINDS), role);
    if (kind !== undefined) return {text: worded(kind), where: "Set for its type", own: false};
    return {text: sizeWord(Number(value(CONTEXT_TOKENS))), where: "Set for every agent", own: false};
}

const unlimited = (limit) => (limit > 0 ? limit : null);
// the screen of settings each row opens: workers have theirs, the merger has its own, everything else read-only
const SCREEN_OF_TYPE = {worker: "workers"};
const MERGER_GROUP = "merger";
const DESIGNER_GROUP = "designer";

function rowOf(key, name, line, counts, cap, extra = {}) {
    return {key, name, line, running: counts.running, runLimit: counts.run_limit, kept: counts.kept, keptLimit: unlimited(counts.kept_limit), cap, ...extra};
}

// the rows of the helper type table in the order of the design: the types that have no profiles, the merger and the
// designer, then the line for the limits every read-only profile shares and a row for each profile under it
export function helperRows(limits, value) {
    const types = limits.filter((row) => !row.per_profile).map((row) => rowOf(row.key, row.label, row.line, row, capOf(value, row.key, ""), {screen: SCREEN_OF_TYPE[row.key] ?? "read-only", role: row.key, profile: "", defaultProfile: row.default_profile}));
    const helper = limits.find((row) => row.per_profile);
    if (!helper) return types;
    const named = (profile) => rowOf(`${helper.key}:${profile.profile}`, profile.title, profile.line, profile, capOf(value, helper.key, profile.profile), {screen: profile.group === MERGER_GROUP ? MERGER_GROUP : "read-only", role: helper.key, profile: profile.profile});
    const special = helper.profiles.filter((profile) => profile.group === MERGER_GROUP || profile.group === DESIGNER_GROUP).map(named);
    const rest = helper.profiles.filter((profile) => profile.group !== MERGER_GROUP && profile.group !== DESIGNER_GROUP).map((profile) => ({...named(profile), indent: true}));
    const line = {key: helper.key, name: "Read-only helpers", group: true, screen: "read-only", role: helper.key, profile: "", line: `${helper.running} running, ${helper.kept} kept. Every profile runs up to ${helper.run_limit} and keeps ${helper.kept_limit ? `up to ${helper.kept_limit}` : "any number"} unless it has limits of its own.`};
    return [...types, ...special, line, ...rest];
}

export const CAP_SIZES = Array.from({length: 10}, (_, place) => (place + 1) * 100000);

export const fullCount = (rows) => rows.filter((row) => !row.group && (isFull(row.running, row.runLimit) || isFull(row.kept, row.keptLimit ?? 0))).length;

// the rows of the table for the window in hand, the counts as the journal last read them and the caps as the form holds them
export function useHelperRows(view, draft) {
    const limits = computed(() => view.props.limits.rows.value ?? []);
    const rows = computed(() => helperRows(limits.value, draft.value));
    const unreadable = computed(() => Boolean(view.props.limits.failure.value));
    return {rows, unreadable, reread: () => view.reload("limits")};
}
