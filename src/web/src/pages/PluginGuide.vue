<script setup>
import SidePanel from "../kit/SidePanel.vue";
import PluginGuideKeys from "./PluginGuideKeys.vue";
import PluginGuidePart from "./PluginGuidePart.vue";

const emit = defineEmits(["close"]);

const EXAMPLE = `{
    "name": "standup",
    "title": "Standup",
    "description": "Posts yesterday's finished to-dos every morning.",
    "journal": "2.60.0",
    "requires": {"node": {"check": "node --version", "hint": "install Node 20"}},
    "setup": [{"name": "packages", "run": "npm install"}],
    "services": {
        "web": {"run": "node server.js --port={port}", "port": "auto", "restart": "on-failure"}
    },
    "on": {
        "todo.completed": "node on-done.js",
        "message.created": "node notify.js"
    },
    "pages": [{"name": "standup", "title": "Standup", "icon": "list", "service": "web", "path": "/"}]
}`;
</script>

<template>
    <SidePanel
        title="How to make a plugin"
        abstract="A repository with one file that says what it listens to, runs and shows"
        @close="emit('close')"
    >
        <PluginGuidePart title="The manifest">
            <p>
                A plugin is any repository with
                <code>.journal-plugin/plugin.json</code>
                . The journal reads it when you press Preview, shows every command it would run, and installs it at that exact commit.
            </p>
            <pre>{{ EXAMPLE }}</pre>
        </PluginGuidePart>
        <PluginGuideKeys />
        <PluginGuidePart title="Writing back to the journal">
            <p>
                A plugin runs as you, so it can call
                <code>journal</code>
                itself. From a service, append journal commands to the file at
                <code>$JOURNAL_QUEUE</code>
                , one per line; the journal runs them a few at a time.
                <code>$JOURNAL_PLUGIN_DIR</code>
                is its folder and
                <code>$JOURNAL_PLUGIN_DATA</code>
                a folder for its own data.
            </p>
        </PluginGuidePart>
        <PluginGuidePart title="Trying it">
            <p>
                Paste a folder path instead of a repository to install from your disk while you build it.
                <code>journal services list</code>
                and
                <code>journal services log &lt;plugin&gt;.&lt;service&gt;</code>
                show its servers.
            </p>
        </PluginGuidePart>
    </SidePanel>
</template>
