import {context} from "./windowContext.js";

export const pluginWindowContext = (answers) => context(answers, null, {
    plugins: {line: "plugin list", events: ["plugin.*"]},
    dashboards: {line: "plugin dashboards", events: ["plugin.*"]},
    descriptions: {line: "plugin descriptions", events: ["plugin.*"]},
    services: {line: "plugin services", events: ["plugin.*"]},
    events: {line: "plugin events", events: ["plugin.*"]},
    preview: {line: "plugin preview {source}", loading: "requested"},
    "latest.*": {line: "plugin latest {id}", loading: "requested"},
    "settings.*": {line: "plugin settings {id}", loading: "requested"},
    "record.*": {line: "plugin record {id}", loading: "requested"},
    dashboard: {line: "plugin dashboard {plugin}", tab: "dashboard"},
    "dashboard-poll": {line: "plugin dashboard {plugin}", tab: "dashboard-poll"},
});
