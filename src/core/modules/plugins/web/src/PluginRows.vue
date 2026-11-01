<script setup>
import {ref} from "vue";
import {Dialog, Btn, Skeleton, useRows, useWindow} from "@journal/window-kit";

// the plugins of this project: install one from a source, ask the agent to make one, and per plugin its switch, its settings and removing it, with or without its data
const context = useWindow();
const {rows, failure, loaded, load} = useRows("plugin list", ["plugin.*"]);
const refusal = ref("");
const open = ref(null);
const source = ref("");
const wish = ref("");
const removing = ref("");
const settings = ref({});

const switchOver = (row) => run(`plugin ${row.enabled ? "disable" : "enable"} ${row.name}`);

async function run(line) {
    const answer = await context.run(line);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) load();
    return answer.ok;
}

async function install() {
    if (source.value.trim() && (await run(["plugin", "install", source.value.trim(), "--yes"]))) (source.value = ""), (open.value = null);
}

async function askTheAgent() {
    if (wish.value.trim() && (await run(["message", "send", `Please make a plugin: ${wish.value.trim()}`]))) (wish.value = ""), (open.value = null);
}

async function remove(row, purge) {
    if (await run(["plugin", "remove", row.name, ...(purge ? ["--purge"] : [])])) removing.value = "";
}

async function toggleSettings(row) {
    if (settings.value[row.name]) {
        const {[row.name]: _, ...others} = settings.value;
        return void (settings.value = others);
    }
    const answer = await context.read(["plugin", "settings", row.name]);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) settings.value = {...settings.value, [row.name]: answer.value.settings};
}

const configure = (row, setting, value) => run(["plugin", "configure", row.name, setting.key, value]);

const record = ref(null);
const recordFailure = ref("");

async function showRecord(row) {
    const answer = await context.read(`plugin record ${row.name}`);
    recordFailure.value = answer.ok ? "" : answer.error;
    record.value = answer.ok ? answer.value : null;
}
</script>

<template>
    <div class="plugin-tools">
        <Btn small bordered data-plugin-install @click="open = open === 'install' ? null : 'install'">Install a plugin</Btn>
        <Btn small bordered data-plugin-make @click="open = open === 'make' ? null : 'make'">Ask the agent to make one</Btn>
    </div>
    <template v-if="open === 'install'">
        <form class="plugin-form" data-plugin-install-form @submit.prevent="install">
            <input v-model="source" placeholder="owner/repo, a link or a folder" aria-label="Where the plugin is">
            <Btn small kind="primary" type="submit" :disabled="!source.trim()">Install</Btn>
        </form>
    </template>
    <template v-if="open === 'make'">
        <form class="plugin-form" data-plugin-make-form @submit.prevent="askTheAgent">
            <input v-model="wish" placeholder="What should the plugin do?" aria-label="What should the plugin do?">
            <Btn small kind="primary" type="submit" :disabled="!wish.trim()">Ask</Btn>
        </form>
    </template>
    <template v-if="refusal">
        <p class="plugin-fault" role="alert" data-plugin-refusal>{{ refusal }}</p>
    </template>
    <div class="plugins">
        <template v-if="!loaded">
            <Skeleton shape="cards" />
        </template>
        <template v-else-if="!failure && !rows.length">
            <p class="plugin-note">No plugins installed</p>
        </template>
        <template v-else-if="failure">
            <p class="plugin-note">{{ failure }}</p>
        </template>
        <template v-for="row in rows" :key="row.id">
            <div class="plugin" :data-row="row.id">
                <span class="plugin-head">
                    <span class="name">{{ row.title }}</span>
                    <span class="release">{{ row.release }}</span>
                    <button type="button" role="switch" :aria-checked="row.enabled" :aria-label="row.enabled ? 'Switch off' : 'Switch on'" :class="['toggle', {on: row.enabled}]" @click="switchOver(row)" />
                </span>
                <span class="plugin-source">{{ row.source }}</span>
                <template v-if="row.failing">
                    <span class="plugin-fault">{{ row.last_fault || "Failing" }}</span>
                </template>
                <span class="plugin-moves">
                    <Btn small data-plugin-settings @click="toggleSettings(row)">Settings</Btn>
                    <Btn small data-plugin-record @click="showRecord(row)">What it did</Btn>
                    <template v-if="removing === row.name">
                        <Btn small @click="removing = ''">Keep it</Btn>
                        <Btn small kind="danger" data-plugin-remove-keep @click="remove(row, false)">Remove, keep its data</Btn>
                        <Btn small kind="danger" data-plugin-remove-purge @click="remove(row, true)">Remove with its data</Btn>
                    </template>
                    <template v-else>
                        <Btn small data-plugin-remove @click="removing = row.name">Remove</Btn>
                    </template>
                </span>
                <template v-if="settings[row.name]">
                    <div class="plugin-settings" data-plugin-setting-list>
                        <template v-if="!settings[row.name].length">
                            <p class="plugin-note">This plugin has no settings</p>
                        </template>
                        <template v-for="setting in settings[row.name]" :key="setting.key">
                            <label class="plugin-setting">
                                <span class="plugin-setting-title">{{ setting.title || setting.key }}</span>
                                <input :value="setting.value" :data-plugin-setting="setting.key" @change="configure(row, setting, $event.target.value)">
                            </label>
                        </template>
                    </div>
                </template>
            </div>
        </template>
    </div>
    <template v-if="recordFailure">
        <p class="plugin-fault" role="alert" data-plugin-record-failure>{{ recordFailure }}</p>
    </template>
    <template v-if="record">
        <Dialog :title="`What ${record.name} did`" @close="record = null">
            <div data-plugin-record-body>
                <template v-if="record.last_fault">
                    <p class="plugin-fault">Last fault, {{ record.fault_count }} in a row: {{ record.last_fault }}</p>
                </template>
                <template v-if="!record.outputs.length">
                    <p class="plugin-note">It has done nothing yet.</p>
                </template>
                <template v-for="row in record.outputs" :key="row.id">
                    <p class="plugin-output" data-plugin-output>{{ row.output }}</p>
                </template>
            </div>
        </Dialog>
    </template>
</template>

<style scoped>
.plugin-output {
    margin: 0 0 6px;
    font-size: 13px;
    white-space: pre-wrap;
}

.plugin-note {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
}

.plugin-tools {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
}

.plugin-form {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
}

.plugin-form input {
    flex: 1;
    min-width: 0;
}

.plugin-moves {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
}

.plugin-settings {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
}

.plugin-setting {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.plugin-setting-title {
    color: var(--text-3);
    font-size: 12px;
}

.plugins {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 12px;
}

.plugin {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
}

.plugin-head {
    display: flex;
    gap: 10px;
    align-items: center;
}

.name {
    flex: 1;
    font-weight: 500;
}

.release,
.plugin-source,
.plugin-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.plugin-fault {
    color: var(--danger);
    font-size: 12px;
}

.toggle {
    position: relative;
    flex: none;
    width: 30px;
    height: 17px;
    border: 0;
    border-radius: 9px;
    background: var(--raised);
    cursor: pointer;
}

.toggle::after {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #fff;
    content: "";
    transition: transform 0.15s ease;
}

.toggle.on {
    background: var(--accent);
}

.toggle.on::after {
    transform: translateX(13px);
}
</style>
