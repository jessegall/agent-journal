import {watchEffect} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import {saveViewerSetting, viewerSetting} from "./settings.js";

const KEY = "color_scheme";
const FOLLOWS_SYSTEM = /prefers-color-scheme:\s*light/;
const FORCED = {light: "all", dark: "not all"};
const original = new WeakMap();

export const SCHEMES = [
    {key: "system", label: "Follow this phone"},
    {key: "light", label: "Light"},
    {key: "dark", label: "Dark"},
];

export const colorScheme = () => viewerSetting(KEY, "system");

export const saveColorScheme = (key) => saveViewerSetting(KEY, key);

const lightRules = () =>
    [...document.styleSheets].flatMap((sheet) => [...sheet.cssRules].filter((rule) => rule.media && (original.has(rule) || FOLLOWS_SYSTEM.test(rule.media.mediaText))));

function apply(key) {
    document.documentElement.style.colorScheme = FORCED[key] ? key : "";
    lightRules().forEach((rule) => {
        if (!original.has(rule)) original.set(rule, rule.media.mediaText);
        rule.media.mediaText = FORCED[key] || original.get(rule);
    });
}

export const followColorScheme = () => watchEffect(() => apply(colorScheme()));

export async function loadViewerSettings() {
    store.settings ??= await api.settings().catch(() => null);
}
