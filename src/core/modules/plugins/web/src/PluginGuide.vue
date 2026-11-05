<script setup>
import {Dialog} from "@journal/window-kit";

const emit = defineEmits(["close"]);
const EXAMPLE = `{
    "name": "standup",
    "title": "Standup",
    "version": "1.0.0",
    "program": "run.sh",
    "hears": ["task.close"],
    "settings": "settings.json",
    "requires": {"node": {"check": "node --version", "hint": "install Node 20"}},
    "setup": [{"name": "packages", "run": "npm install"}],
    "services": [{"name": "web", "command": ["server.sh"], "restart": "on-failure"}],
    "dashboard": {"name": "standup", "title": "Standup"}
}`;
const KEYS = [
    ["name, title, version", "Required. The name is how every command refers to the plugin."],
    ["program", "The file run for each event, in the plugin's folder. It gets the event as one line of JSON on its input."],
    ["hears", "The events it runs for."],
    ["holds", "The events it answers before they go on, each with an optional window_ms."],
    ["settings", "A JSON file listing its settings, each with a key, title and type."],
    ["requires", "Programs that must be installed, each with a check command and a hint."],
    ["setup", "Commands run once, in order, when it installs."],
    ["installed", "A command that answers with JSON settings once it is installed."],
    ["services", "Programs kept running while the plugin is on, each with a name and a command; when, restart and answers are optional."],
    ["health", "How a service answers a health check: socket_env, request and answer."],
    ["cards", "The tone of each type of card it shows."],
    ["skills", "The folder containing its skills."],
    ["reaches", "For an event, which helpers besides the main agent it reaches."],
    ["aliases", "The commands it provides under short names."],
    ["dashboard", "A page it writes, with a name and a title."],
];
const ANSWER = '{"answer": "refuse", "reason": "why", "line": "a line for the agent", "commands": ["task log 7 done"], "cards": [], "require_skills": []}';
</script>

<template>
    <Dialog title="Create a plugin" @close="emit('close')">
        <div class="plugin-guide" data-plugin-guide>
            <h3>Manifest</h3>
            <p>A plugin is a folder or a repository with a <code>journal-plugin.json</code>. The journal reads it, shows you everything it would run, and copies it when you install it, using the latest version tag for a repository.</p>
            <pre>{{ EXAMPLE }}</pre>
            <h3>Keys</h3>
            <dl>
                <template v-for="[key, text] in KEYS" :key="key">
                    <dt>{{ key }}</dt>
                    <dd>{{ text }}</dd>
                </template>
            </dl>
            <h3>Answering an event</h3>
            <p>The program prints JSON, and printing nothing allows the event. Every key is optional:</p>
            <pre>{{ ANSWER }}</pre>
            <h3>Environment variables</h3>
            <p>A plugin runs as you, with <code>journal</code> on its path. <code>$JOURNAL_PLUGIN_DIR</code> is its folder, <code>$JOURNAL_PLUGIN_DATA</code> a folder for its data, and <code>$JOURNAL_SETTINGS</code> a file with its settings.</p>
            <h3>Dashboard</h3>
            <p>It writes <code>dashboards/&lt;name&gt;.json</code> in its data folder, stating <code>start</code> and <code>pages</code>. The journal draws that file; a plugin's own code never runs in the viewer.</p>
        </div>
    </Dialog>
</template>

<style scoped>
.plugin-guide h3 {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.plugin-guide p,
.plugin-guide dd {
    margin: 0 0 12px;
    color: var(--text-2);
    font-size: 12.5px;
}

.plugin-guide dt {
    font-size: 12.5px;
    font-weight: 500;
}

.plugin-guide pre {
    margin: 0 0 16px;
    padding: 10px;
    border-radius: 6px;
    background: var(--hover);
    font-size: 12px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
</style>
