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
    note: "Add one on the Secrets page.",
});

export function stateWords(title, on, state) {
    if (!on) return "Off";
    if (state?.paused_until > Date.now() / 1000) return `Paused until ${clock(state.paused_until)}, because ${title}'s request limit is nearly used`;
    if (state?.last_error) return `Could not reach ${title}: ${state.last_error}`;
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

export const boardOf = (settings, name) => Number(settings?.[name]?.board) || 0;

export const teamsOf = (settings, name) => String(settings?.[name]?.teams || "").split(",").filter(Boolean);

export const withTeam = (picked, id, on) => (on ? [...new Set([...picked, id])] : picked.filter((one) => one !== id)).join(",");
