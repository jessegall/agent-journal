import {ref, watchEffect} from "vue";
import {remember, remembered} from "../platform/storage.js";

const KEY = "viewer.color-scheme";
const FOLLOWS_SYSTEM = /prefers-color-scheme:\s*light/;
const FORCED = {light: "all", dark: "not all"};
const original = new WeakMap();

export const SCHEMES = [
    {key: "system", label: "Follow the system"},
    {key: "light", label: "Light"},
    {key: "dark", label: "Dark"},
];

export const colorScheme = ref(remembered(KEY, "system"));

export function chooseColorScheme(key) {
    colorScheme.value = key;
    remember(KEY, key);
}

export function nextColorScheme() {
    const at = SCHEMES.findIndex((scheme) => scheme.key === colorScheme.value);
    chooseColorScheme(SCHEMES[(at + 1) % SCHEMES.length].key);
}

// a stylesheet of another origin, such as a web font's, refuses to show its rules, and holds none of the theme's
function rulesOf(sheet) {
    try {
        return [...sheet.cssRules];
    } catch {
        return [];
    }
}

const lightRules = (sheets) => [...sheets].flatMap((sheet) => rulesOf(sheet).filter((rule) => rule.media && (original.has(rule) || FOLLOWS_SYSTEM.test(rule.media.mediaText))));

// a chosen scheme forces the stylesheet's light rules on or off, by rewriting what they ask of the browser; following the system gives them back their own
function applyColorScheme(key, sheets = document.styleSheets, root = document.documentElement) {
    root.style.colorScheme = FORCED[key] ? key : "";
    for (const rule of lightRules(sheets)) {
        if (!original.has(rule)) original.set(rule, rule.media.mediaText);
        rule.media.mediaText = FORCED[key] || original.get(rule);
    }
}

export const followColorScheme = () => watchEffect(() => applyColorScheme(colorScheme.value));

export const pageTitle = (environment, project = "agent-journal") => (environment ? `${project} · ${environment}` : project);
