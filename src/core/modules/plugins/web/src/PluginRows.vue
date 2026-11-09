<script setup>
import {computed, ref, watch} from "vue";
import {Dashboard, Dialog, Btn, Icon, Skeleton, TextInput, runChanged, useWindow} from "@journal/window-kit";
import {fileAddress} from "./fileAddress.js";
import PluginCard from "./PluginCard.vue";
import PluginGuide from "./PluginGuide.vue";
import PluginInstallPreview from "./PluginInstallPreview.vue";
import PluginMakeDialog from "./PluginMakeDialog.vue";
import PluginRecordDialog from "./PluginRecordDialog.vue";
import PluginRemoveDialog from "./PluginRemoveDialog.vue";
import PluginSettingsDialog from "./PluginSettingsDialog.vue";
import PluginUpgradeDialog from "./PluginUpgradeDialog.vue";

// the plugins of this project as version 4's page drew them: a bar to install one from a source, a line on what installing means, a card for each plugin with its
// switch, settings and removing it, with or without its data, and a card to ask the agent to make one; the services read again while the page is open
const context = useWindow();
context.state.tab = "list";
const {rows, failure, loaded, load} = context.props.plugins;
const {rows: boards} = context.props.dashboards;
const boardOf = (row) => boards.value.find((board) => board.plugin === row.name);
const {rows: descriptions} = context.props.descriptions;
const descriptionOf = (row) => descriptions.value.find((each) => each.plugin === row.name)?.description ?? "";
const {rows: services} = context.props.services;
const servicesOf = (row) => services.value.filter((service) => service.plugin === row.name);
const refusal = ref("");
const source = ref("");
const making = ref(false);
const repository = ref("");
const wish = ref("");
const asked = ref(false);
const removing = ref(null);
const settings = ref([]);
const settingsOf = ref("");
const openedPlugin = computed(() => rows.value.find((row) => row.name === settingsOf.value) ?? null);

const switchOver = (row) => run(["plugin", row.enabled ? "disable" : "enable", row.name], {target: row, fields: {enabled: !row.enabled}});

async function run(line, change = null) {
    refusal.value = "";
    const answer = await runChanged(change, line, context.run);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) load();
    return answer.ok;
}

const preview = ref(null);
const guide = ref(false);

// an install shows everything the plugin would run first, and goes ahead only from there
async function showPreview() {
    if (!source.value.trim()) return;
    const key = "preview";
    context.state["preview.source"] = source.value.trim();
    await context.reload(key);
    const prop = context.props[key];
    refusal.value = prop.failure.value;
    preview.value = prop.failure.value ? null : prop.data.value;
}

async function install() {
    const installed = await run(["plugin", "install", preview.value.source, "--yes"]);
    preview.value = null;
    if (installed) source.value = "";
}

const latest = ref({});

async function checkLatest(row) {
    const key = `latest.${row.name}`;
    await context.reload(key);
    const prop = context.props[key];
    latest.value = {...latest.value, [row.name]: prop.failure.value ? {line: prop.failure.value, is_newer: false} : prop.data.value};
}

const upgrade = ref(null);

async function showUpgrade(row) {
    const answer = await context.run(["plugin", "upgrade", row.name]);
    refusal.value = answer.ok ? "" : answer.error;
    upgrade.value = answer.ok ? answer.value : null;
}

async function applyUpgrade() {
    const name = upgrade.value.name;
    upgrade.value = null;
    if (await run(["plugin", "upgrade", name, "--yes"])) latest.value = {...latest.value, [name]: {line: `${name} is upgraded; its running services start again within a minute`, is_newer: false}};
}

function openFile(node) {
    if (context.links.files) window.location.assign(fileAddress(window.location.href, node, context.links.files));
}

const board = ref(null);

function showBoard(row) {
    const {title, events} = boardOf(row);
    const key = events?.length ? "dashboard" : "dashboard-poll";
    context.state[`${key}.plugin`] = row.name;
    board.value = {title, events: events ?? [], key};
}

watch(board, (shown, previous, onCleanup) => {
    context.state.tab = shown ? shown.key : "list";
    if (!shown) return;
    if (context.props[shown.key].loaded.value) context.reload(shown.key);
    const stop = context.follow(shown.events, () => context.reload(shown.key));
    if (stop) onCleanup(stop);
});

async function askTheAgent() {
    const words = [wish.value.trim(), repository.value.trim() && `Build it in ${repository.value.trim()}.`].filter(Boolean).join(" ");
    if (!words || !(await run(["message", "send", `Please make a plugin: ${words}`]))) return;
    repository.value = "";
    wish.value = "";
    making.value = false;
    asked.value = true;
}

function readGuide() {
    making.value = false;
    guide.value = true;
}

async function remove(purge) {
    if (await run(["plugin", "remove", removing.value.name, ...(purge ? ["--purge"] : [])])) removing.value = null;
}

async function showSettings(row) {
    const key = `settings.${row.name}`;
    await context.reload(key);
    const prop = context.props[key];
    refusal.value = prop.failure.value;
    settingsOf.value = prop.failure.value ? "" : row.name;
    settings.value = prop.failure.value ? [] : prop.data.value.settings;
}

async function configure(setting, value) {
    if (await run(["plugin", "configure", settingsOf.value, setting.key, value])) await showSettings(openedPlugin.value);
}

const record = ref(null);
const recordFailure = ref("");
async function showRecord(row) {
    const key = `record.${row.name}`;
    await context.reload(key);
    const prop = context.props[key];
    recordFailure.value = prop.failure.value;
    record.value = prop.failure.value ? null : prop.data.value;
}
</script>

<template>
    <section class="plugins" data-plugins>
        <div class="bar">
            <form class="install" data-plugin-install-form @submit.prevent="showPreview">
                <TextInput v-model="source" icon="download" placeholder="Install a plugin from owner/repo, a GitHub link or a folder" aria-label="Install a plugin from">
                    <template #end>
                        <Btn variant="primary" small type="submit" :disabled="!source.trim()">Check before installing</Btn>
                    </template>
                </TextInput>
            </form>
        </div>
        <div class="body">
            <p class="lead">
                A plugin runs as you, with your files and your network. Check before installing shows every command it would run before
                anything runs, and it installs at that exact commit.
            </p>
            <template v-if="refusal">
                <p class="plugin-fault" role="alert" data-plugin-refusal>{{ refusal }}</p>
            </template>
            <template v-if="recordFailure">
                <p class="plugin-fault" role="alert" data-plugin-record-failure>{{ recordFailure }}</p>
            </template>
            <template v-if="asked">
                <p class="asked" data-plugin-asked>Sent to the agent; its answer comes in the chat.</p>
            </template>
            <template v-if="!loaded">
                <Skeleton shape="cards" />
            </template>
            <template v-else-if="failure">
                <p class="plugin-fault">{{ failure }}</p>
            </template>
            <template v-else-if="!rows.length">
                <p class="none" data-plugin-none><strong>No plugin is installed</strong> Paste a repository above to see what it would run.</p>
            </template>
            <div class="cards">
                <template v-for="row in rows" :key="row.id">
                    <PluginCard :plugin="row" :description="descriptionOf(row)" :services="servicesOf(row)" :board="boardOf(row)" @toggle="switchOver(row)" @settings="showSettings(row)" @board="showBoard(row)" @record="showRecord(row)" @latest="checkLatest(row)" @remove="removing = row">
                        <template v-if="latest[row.name]">
                            <span class="plugin-note" data-plugin-latest-line>{{ latest[row.name].line }}</span>
                            <template v-if="latest[row.name].is_newer">
                                <Btn small variant="primary" data-plugin-upgrade @click="showUpgrade(row)">See what changes</Btn>
                            </template>
                        </template>
                    </PluginCard>
                </template>
                <button type="button" class="make" data-plugin-make @click="(making = true), (asked = false)">
                    <span class="make-mark"><Icon name="plus" :size="16" /></span>
                    <span class="make-title">Create a plugin</span>
                    <span class="make-text">Ask the agent to build one for you, or read how plugins are made.</span>
                </button>
            </div>
        </div>
        <template v-if="openedPlugin">
            <PluginSettingsDialog :plugin="openedPlugin" :description="descriptionOf(openedPlugin)" :settings="settings" @close="settingsOf = ''" @configure="configure" @toggle="switchOver(openedPlugin)" />
        </template>
        <template v-if="making">
            <PluginMakeDialog v-model:repository="repository" v-model:wish="wish" @close="making = false" @guide="readGuide" @ask="askTheAgent" />
        </template>
        <template v-if="removing">
            <PluginRemoveDialog :title="removing.title" @close="removing = null" @remove="remove" />
        </template>
        <template v-if="record">
            <PluginRecordDialog :record="record" @close="record = null" />
        </template>
        <template v-if="preview">
            <PluginInstallPreview :preview="preview" @close="preview = null" @install="install" />
        </template>
        <template v-if="upgrade">
            <PluginUpgradeDialog :upgrade="upgrade" @close="upgrade = null" @apply="applyUpgrade" />
        </template>
        <template v-if="guide">
            <PluginGuide @close="guide = false" />
        </template>
        <template v-if="board">
            <Dialog padded :title="board.title" @close="board = null">
                <template v-if="context.props[board.key].failure.value"><p class="plugin-fault">{{ context.props[board.key].failure.value }}</p></template>
                <template v-else-if="context.props[board.key].data.value"><Dashboard :document="context.props[board.key].data.value" @file="openFile" /></template>
            </Dialog>
        </template>
    </section>
</template>

<style scoped>
.plugins {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
}

.bar {
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
    padding: 8px 14px 8px 22px;
    border-bottom: 1px solid var(--border);
}

.install {
    flex: 1 1 360px;
    max-width: 640px;
}

.body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 1180px;
    padding: 22px 24px 40px;
    box-sizing: border-box;
}

.lead {
    max-width: 640px;
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 1.55;
}

.asked {
    margin: 0;
    color: var(--accent-text);
    font-size: 12.5px;
}

.none {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.none strong {
    display: block;
    margin-bottom: 4px;
    color: var(--text-2);
    font-size: 14px;
    font-weight: 500;
}

.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 16px;
}

.plugin-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.plugin-fault {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
}

.make {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-height: 160px;
    padding: 10px 12px;
    border: 1px dashed var(--border-2);
    border-radius: 14px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
    transition:
        border-color 0.15s,
        color 0.15s,
        background 0.15s;
}

.make:hover {
    border-color: var(--accent);
    background: var(--hover);
    color: var(--text);
}

.make-mark {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    margin-bottom: 8px;
    border: 1px solid var(--border-2);
    border-radius: 50%;
    transition:
        border-color 0.2s,
        color 0.2s;
}

.make:hover .make-mark {
    border-color: var(--accent);
    color: var(--accent-text);
}

.make-title {
    color: var(--text-2);
    font-weight: 500;
}

.make-text {
    max-width: 240px;
    color: var(--text-4);
    font-size: 12px;
    line-height: 1.45;
    text-align: center;
}

@media (max-width: 640px) {
    .install {
        flex-basis: 100%;
        max-width: none;
    }

    .body {
        padding: 16px 16px 32px;
    }

    .cards {
        grid-template-columns: 1fr;
    }
}
</style>
