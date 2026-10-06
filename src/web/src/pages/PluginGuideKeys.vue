<script setup>
import PluginGuidePart from "./PluginGuidePart.vue";
</script>

<template>
    <PluginGuidePart title="Keys">
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
    </PluginGuidePart>
</template>
