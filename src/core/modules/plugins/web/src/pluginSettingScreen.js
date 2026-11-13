import {isOn, shownValue} from "./pluginSettingGroups.js";

const OTHER_SECTION = "Settings";
const DRAWN_TYPES = ["flag", "number", "choice", "list"];
const SECRET = "secret";

export const screenName = (plugin) => `plugin.${plugin}`;

function valueOf(setting) {
    if (setting.type === "flag") return isOn(setting);
    if (setting.type === "list") return shownValue(setting).split("\n").filter(Boolean);
    return shownValue(setting);
}

// a plugin's settings as the nodes a settings screen draws: the section of a node is the group of its setting and its
// kind is the type of its setting; a secret is no node, since no command sets it
export function settingNodes(settings) {
    return settings.filter((setting) => setting.type !== SECRET).map((setting) => ({
        key: setting.key,
        title: setting.title,
        description: setting.help,
        kind: DRAWN_TYPES.includes(setting.type) ? setting.type : "text",
        section: setting.group || OTHER_SECTION,
        parent: setting.parent || null,
        source: "",
        component: "",
        rule: null,
        choices: setting.choices,
        requires: [],
        value: valueOf(setting),
    }));
}

// the one screen of a plugin's settings, in the form the settings draft loads; its revision changes with a value
export function settingScreens(plugin, settings) {
    const nodes = settingNodes(settings);
    return [{screen: screenName(plugin), revision: JSON.stringify(nodes.map((node) => [node.key, node.value])), nodes}];
}

// the line the draft sends to save its changes, as the plugin configure commands that save them: each pair is
// key=text, a list as JSON text, which the command takes as a line for each entry
export function configureChanges(line, settings) {
    const pairs = line.slice(line.indexOf("--revision") + 2);
    return pairs.map((pair) => {
        const at = pair.indexOf("=");
        const key = pair.slice(0, at);
        const text = pair.slice(at + 1);
        const isList = settings.find((setting) => setting.key === key)?.type === "list";
        return {key, text: isList ? JSON.parse(text).join("\n") : text};
    });
}

export const secretsOf = (settings) => settings.filter((setting) => setting.type === SECRET);
