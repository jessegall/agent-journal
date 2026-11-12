import {settingComponents} from "./registry.js";

// the component a setting is drawn with when the server names none: the one for its kind of value
const DEFAULT_COMPONENTS = Object.freeze({
    "flag": "toggle",
    "number": "number",
    "choice": "choice",
    "list": "entry-list",
    "number list": "number-list",
    "text": "text",
    "any": "text",
});

export const componentNameOf = (node) => node.component || DEFAULT_COMPONENTS[node.kind];
export const hasComponent = (name) => Object.hasOwn(settingComponents, name);

const slug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// the sections of a screen in the order they are drawn: [{key, title}], as the section list shows them
export function sectionsOf(nodes) {
    const titles = [...new Set(nodes.map((node) => node.section))];
    return titles.map((title) => ({key: slug(title), title}));
}

export const sectionKeyOf = slug;
