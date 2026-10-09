import {age, clock} from "../format/time.js";

export const integrationsIn = (features) =>
    Object.values(features || {})
        .filter((feature) => feature.group === "integrations")
        .sort((a, b) => a.position - b.position || a.title.localeCompare(b.title));

export const isOn = (settings, name) => Boolean(settings?.features?.[name]);

export const keyOf = (settings, name) => settings?.[name]?.key || "";

export const keyWords = (title) => ({
    label: "Key",
    none: `No key is picked, so ${title} is not reached.`,
    picked: `${title} signs in with the secret {title}.`,
    note: `The key is only for ${title}, and no command can use it. Add one on the Secrets page.`,
});

export const refusedKey = (feature, state) => (feature.key_refused || []).some((mark) => (state?.last_error || "").includes(mark));

export function stateWords(title, on, state, refused = false) {
    if (!on) return "Off";
    if (state?.paused_until > Date.now() / 1000) return `Paused until ${clock(state.paused_until)}, because ${title}'s request limit is nearly used`;
    if (state?.last_error) return refused ? `${title} did not accept the key. Pick another key.` : `Could not reach ${title}.`;
    if (!state?.last_checked) return "Not checked yet";
    const since = age(state.last_checked);
    return since === "now" ? "Last checked just now" : `Last checked ${minutesAgo(state.last_checked)} ago`;
}

function minutesAgo(at) {
    const minutes = Math.floor(Math.max(0, Date.now() / 1000 - at) / 60);
    if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? "day" : "days"}`;
}

export const textOf = (settings, name, field) => String(settings?.[name]?.[field] || "");

export const boardOf = (settings, name) => Number(settings?.[name]?.board) || 0;

export const teamsOf = (settings, name) => String(settings?.[name]?.teams || "").split(",").filter(Boolean);

export const withTeam = (picked, id, on) => (on ? [...new Set([...picked, id])] : picked.filter((one) => one !== id)).join(",");

export const settingsWith = (settings, name, patch) => ({[name]: {...(settings?.[name] || {}), ...patch}});

export const stageStatesOf = (settings, name) => settings?.[name]?.stage_states || {};

export const withStageState = (settings, name, stage, state) => ({...stageStatesOf(settings, name), [stage]: state});

export const mapped = (settings, name) => Object.values(stageStatesOf(settings, name)).some(Boolean);

export const statesFor = (choices, teams) =>
    (choices || []).filter((one) => !teams.length || teams.includes(one.team)).map((one) => ({value: one.id, label: one.name}));

export const webhookWords = (title) => ({
    label: "Webhook signing secret",
    none: `No signing secret is picked, so events from ${title} are not taken.`,
    picked: `${title} events are checked with the secret {title}.`,
    note: "Copy the signing secret from Linear's webhook settings into a secret on the Secrets page.",
    address: `Paste this address into ${title}'s webhook settings`,
    absent: "Turn on sharing to get an address Linear can reach. Until then the journal checks Linear every five minutes.",
});

export const signingOf = (settings, name) => settings?.[name]?.signing_key || "";

export const switchWords = (title) => ({
    mcp: `Agents can use ${title} directly`,
    mcpHelp: `Agents get ${title}'s own tools. What they read there is not marked as untrusted. Off until you turn it on.`,
    fetching: `Read ${title} into tickets`,
    fetchingHelp: `The journal reads ${title} and keeps what it finds as tickets. Off until you turn it on.`,
});

export const mcpOn = (settings, name) => Boolean(settings?.[name]?.use_mcp);

export const fetchingOn = (settings, name) => Boolean(settings?.[name]?.fetching);

export const loginWords = (title) => ({
    label: `Log in to ${title}`,
    button: "Log in",
    waiting: `Waiting for you to finish signing in to ${title}.`,
});

export const loginLine = (title, state) => (state?.logged_in_at ? `Logged in to ${title} ${minutesAgo(state.logged_in_at)} ago.` : `Not logged in to ${title}.`);
