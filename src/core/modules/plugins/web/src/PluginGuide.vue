<script setup>
import {Dialog} from "@journal/window-kit";

const emit = defineEmits(["close"]);
const EXAMPLE = `{
    "name": "standup",
    "title": "Standup",
    "version": "1.0.0",
    "program": "run.sh",
    "hears": ["file_edited"],
    "settings": "settings.json",
    "requires": {"node": {"check": "node --version", "hint": "install Node 20"}},
    "setup": [{"name": "packages", "run": "npm install"}],
    "services": [{"name": "web", "command": ["server.sh"], "restart": "on-failure"}],
    "dashboard": {"name": "standup", "title": "Standup", "events": ["core.tasks.task.created"]}
}`;
const KEYS = [
    ["name, title, version", "Required. The name is how every command refers to the plugin."],
    ["program", "The file run for each event, in the plugin's folder. It gets the event as one line of JSON on its input."],
    ["hears", "The events it runs for."],
    ["holds", "The events it answers before they go on, each with an optional window_ms."],
    ["listen", "Scripts to run for a change, each entry with an event key from journal event keys and a script for any of guard, listen and commit. The journal puts no time limit on a script, except that a guard on an agent's tool step or prompt keeps the journal's own limit."],
    ["listen: guard", "Before a change. The script can refuse it, and then nothing is saved. Set \"skip\": false on the entry and nobody can pass it with --skip-guard plugins.event-guard:<plugin>; a person can always turn the plugin off."],
    ["listen: listen", "During a change. The script sees the item before it is saved, its answered commands are saved with the change, and a journal command it runs itself is saved at once and stays. An id it reads may still change, and only commit promises the change happened."],
    ["listen: commit", "After a change. The script runs after the change is saved and cannot stop it."],
    ["docs/writing-a-plugin.md", "The whole contract for a plugin's author, with a working sample."],
    ["listen: service", "A form's value may be service:<name>, a service with answers set, so the event goes to the running service and no new program starts. If its socket is closed the program runs, if there is one."],
    ["one at a time", "All deliveries run in turn on one thread, for every plugin. A slow script or service holds the others until it ends."],
    ["waiting", "A guard or listen script holds no lock, but whoever made the change waits for it. Turn the plugin off to stop a script that never ends."],
    ["files", "Other files of the plugin, by relative path, that count as what it runs: changing one switches it off until you read the change. A folder counts every file in it, and a big folder costs time at every step of an agent."],
    ["settings", "A JSON file listing its settings, each with a key, title and type."],
    ["requires", "Programs that must be installed, each with a check command and a hint."],
    ["setup", "Commands run once, in order, when it installs."],
    ["installed", "A command that answers with JSON settings once it is installed."],
    ["services", "Programs kept running while the plugin is on, each with a name and a command; when, restart and answers are optional."],
    ["services: children", "A service may hold long-lived children, which end with its process group. A child that calls setsid leaves the group and is not stopped."],
    ["health", "How a service answers a health check: socket_env, request and answer."],
    ["cards", "The tone of each type of card it shows."],
    ["skills", "The folder containing its skills."],
    ["reaches", "For an event, which helpers besides the main agent it reaches."],
    ["aliases", "The commands it provides under short names."],
    ["dashboard", "A page it writes, with a name, a title and the keys of the events that make the viewer read it again."],
    ["project_reads", "Folders of the project, by relative path, that the shell line of a limited agent may read for it. A path that leaves the project is never opened."],
];
const ANSWER = '{"answer": "refuse", "reason": "why", "tell": "a line for the agent", "commands": ["task log 7 done"], "cards": [], "require_skills": []}';
const EVENT_LINE = JSON.stringify({
    v: 1,
    event: "file_edited",
    agent: 612,
    skills: ["journal"],
    checkout: {
        kind: "worktree",
        root: "/Users/me/project/.journal/worktrees/main/agent-612",
        project_root: "/Users/me/project",
        branch: "journal/main/agent-612",
        base_branch: "version-5",
        base_commit: "38fa149f35",
        exists: true,
    },
    data: {
        path: "src/order.py",
        cwd: "/Users/me/project/.journal/worktrees/main/agent-612",
        file: {
            relative: "src/order.py",
            path: "/Users/me/project/.journal/worktrees/main/agent-612/src/order.py",
            project_path: "/Users/me/project/src/order.py",
            status: "changed",
            renamed_from: "",
            in_base: true,
            linked: false,
        },
    },
}, null, 4);
const PATH_RULES = [
    "A plugin never works out a checkout: the journal says which one it is, in checkout.",
    "relative is the name of a file. It runs from the root of the checkout with /, and it is the same for one file in the project and in every worktree, so a plugin matches files on it and nothing else.",
    "Every absolute path is a real path, with every link resolved, so it can be compared with any other.",
    "A plugin may keep a relative path and an agent. With those two the journal answers the rest.",
    "Fields are added and their meaning never changes. A change of meaning raises v.",
];
const FILE_FIELDS = [
    ["path", "Its real place in this checkout."],
    ["project_path", "Where the same name lies in the project. It may not exist."],
    ["status", "changed, added, deleted or renamed. One edit of a moved file says added; the list of changes at a hand-in says renamed."],
    ["renamed_from", "The old relative name, for renamed."],
    ["in_base", "Whether the commit the checkout started from holds this name."],
    ["linked", "The name lies under a link in the checkout, such as a shared node_modules, so path is outside root."],
];
const CALLS = [
    ["journal plugin checkout [--agent <n>] --json", "The checkout object above."],
    ["journal plugin changes [--agent <n>] [--since <commit>] --json", "One file object for each name that differs, by default from the commit the checkout started from."],
    ["journal plugin file <relative> [--agent <n>] [--from checkout, project or base]", "The text of that name in that place. A name that is not there exits with code 4."],
    ["journal plugin run [--agent <n>] [--read-only] -- <command>", "Runs a command at the root of the checkout, with the sandbox of that agent. Only a plugin or a person may call it."],
];
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
            <h3>What an event gives the program</h3>
            <p>One line of JSON on its input. An event about a file has a <code>file</code> in its data, and the list of changes at a hand-in holds one for each name.</p>
            <pre>{{ EVENT_LINE }}</pre>
            <ul>
                <template v-for="rule in PATH_RULES" :key="rule"><li>{{ rule }}</li></template>
            </ul>
            <dl>
                <template v-for="[field, text] in FILE_FIELDS" :key="field">
                    <dt>{{ field }}</dt>
                    <dd>{{ text }}</dd>
                </template>
            </dl>
            <h3>Asking the journal about a checkout</h3>
            <p>Plugins and people can name any agent. An agent names only the checkout it works in and reads project folders listed in <code>project_reads</code>.</p>
            <dl>
                <template v-for="[call, text] in CALLS" :key="call">
                    <dt><code>{{ call }}</code></dt>
                    <dd>{{ text }}</dd>
                </template>
            </dl>
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
.plugin-guide li,
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
