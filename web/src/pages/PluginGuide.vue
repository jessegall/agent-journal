<script setup>
import SidePanel from "../kit/SidePanel.vue";

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
        <section class="part">
            <h3>The manifest</h3>
            <p>
                A plugin is any repository with
                <code>.journal-plugin/plugin.json</code>
                . The journal reads it when you press Preview, shows every command it would run, and installs it at that exact commit.
            </p>
            <pre>{{ EXAMPLE }}</pre>
        </section>
        <section class="part">
            <h3>What each key does</h3>
            <dl>
                <dt>name</dt>
                <dd>2 to 32 lowercase letters, digits or dashes; not the name of a built-in feature.</dd>
                <dt>journal</dt>
                <dd>The oldest journal version it works with; an older journal refuses to install it.</dd>
                <dt>requires</dt>
                <dd>Tools that must be installed, each with a command that checks for it and a hint when it is missing.</dd>
                <dt>env</dt>
                <dd>
                    Variables set for its commands and services;
                    <code>{port}</code>
                    and its folders are filled in.
                </dd>
                <dt>setup</dt>
                <dd>Commands run once, in order, when it installs or upgrades.</dd>
                <dt>services</dt>
                <dd>
                    Servers kept running while the session runs.
                    <code>{port}</code>
                    is filled in with a free port.
                </dd>
                <dt>on</dt>
                <dd>
                    Journal events it hears:
                    <code>*</code>
                    , a type such as
                    <code>todo</code>
                    , an action,
                    <code>type.action</code>
                    or
                    <code>hook.&lt;event&gt;</code>
                    . Each runs a command or posts the event to a URL.
                </dd>
                <dt>refuse</dt>
                <dd>
                    A command asked before each write the agent makes. It is handed the call as JSON, and answering with
                    <code>{"refuse": "&lt;why&gt;"}</code>
                    refuses the write.
                </dd>
                <dt>chat</dt>
                <dd>
                    Rules that turn text in the chat into links:
                    <code>{"find": "&lt;regex&gt;", "as": "&lt;markdown&gt;"}</code>
                    .
                </dd>
                <dt>pages</dt>
                <dd>Pages of one of its services, shown in the sidebar.</dd>
                <dt>settings</dt>
                <dd>Values the user can change on the plugin's card, each with a title, a default and the variable it lands in.</dd>
            </dl>
        </section>
        <section class="part">
            <h3>Writing back to the journal</h3>
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
        </section>
        <section class="part">
            <h3>Trying it</h3>
            <p>
                Paste a folder path instead of a repository to install from your disk while you build it.
                <code>journal services list</code>
                and
                <code>journal services log &lt;plugin&gt;.&lt;service&gt;</code>
                show its servers.
            </p>
        </section>
    </SidePanel>
</template>

<style scoped>
.part {
    margin-bottom: 22px;
}

h3 {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

p,
dd {
    margin: 0 0 8px;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.55;
}

dt {
    margin-top: 8px;
    font-family: var(--mono);
    font-size: 12px;
}

dd {
    margin-left: 0;
}

pre {
    overflow-x: auto;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
    font-size: 11.5px;
    line-height: 1.5;
}

code {
    font-family: var(--mono);
    font-size: 11.5px;
}
</style>
