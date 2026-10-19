<script setup>
import {pluginRequest} from "../domain/plugins.js";
import {computed, nextTick, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Console from "../kit/Console.vue";
import EmptyState from "../kit/EmptyState.vue";
import PageBar from "../kit/PageBar.vue";
import TextInput from "../kit/TextInput.vue";
import PluginCard from "./PluginCard.vue";
import PluginDashboard from "./PluginDashboard.vue";
import PluginGuide from "./PluginGuide.vue";
import PluginInstallDialog from "./PluginInstallDialog.vue";
import LogDialog from "../kit/LogDialog.vue";
import PluginMakeCard from "./PluginMakeCard.vue";
import PluginMakeDialog from "./PluginMakeDialog.vue";
import PluginRemoveDialog from "./PluginRemoveDialog.vue";
import PluginRecord from "./PluginRecord.vue";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {installedPlugins} from "../composables/plugins.js";
import {usePluginInstall} from "../composables/pluginInstall.js";
import {sendMessage} from "../chat/outbox.js";
import {hasLoaded} from "../sync/rows.js";

const source = ref("");
const guide = ref(false);
const making = ref(false);
const repository = ref("");
const wish = ref("");
const asked = ref(false);
const removing = ref(null);
const recording = ref(null);
const viewing = ref(null);
const busy = ref("");
const plugins = installedPlugins();
const reading = ref("");
const logged = ref("");
const pagesOf = (p) => (store.pages || []).filter((page) => page.plugin === p.name);


function installed(name, got) {
    source.value = "";
    if (got && got.id) {
        closePreview();
        settingsOf(name);
    }
}

const {previewText, previewed, outcome, live, preview: checkSource, install: runInstall, upgrade, closePreview} = usePluginInstall(busy, installed);
const preview = () => checkSource(source.value);
const install = () => runInstall(source.value);

async function act(p, action, body = {}) {
    busy.value = `${p.id}`;
    try {
        await api.act("plugins", p.id, action, body);
    } catch (e) {
        previewText.value = e.message;
    }
    busy.value = "";
}

async function plugin(p, action, body = {}) {
    reading.value = p.name;
    await readLog();
    await act(p, action, body);
    await readLog();
}

async function remove(everything) {
    const p = removing.value;
    removing.value = null;
    await act(p, "remove", {how: "removed from the viewer"});
    if (everything) await act(p, "purge");
}

const settingsOf = (name) => (location.hash = `#/${route.value.env}/settings?sub=plugins&plugin=${encodeURIComponent(name)}`);

async function readLog() {
    if (!reading.value) return;
    try {
        const p = plugins.value.find((row) => row.name === reading.value);
        logged.value = (await api.pluginLog(p.id)).log;
    } catch (e) {
        logged.value = e.message;
    }
}

function toggleLog(p) {
    reading.value = reading.value === p.name ? "" : p.name;
    logged.value = "";
    readLog();
}

function readGuide() {
    making.value = false;
    guide.value = true;
}

async function askAgent() {
    await sendMessage(route.value.env, {text: pluginRequest(repository.value, wish.value)});
    making.value = false;
    repository.value = "";
    wish.value = "";
    asked.value = true;
}

watch(
    () => [route.value.plugin, plugins.value.length],
    async ([n]) => {
        if (!n) return;
        await nextTick();
        const card = document.querySelector(`[data-plugin="${n}"]`);
        if (!card) return;
        card.scrollIntoView({block: "center", behavior: "smooth"});
        card.animate([{outline: "2px solid var(--accent)"}, {outline: "2px solid transparent"}], {duration: 1600});
    },
    {immediate: true}
);
</script>

<template>
    <section class="plugins">
        <PageBar>
            <TextInput
                class="install"
                icon="download"
                :value="source"
                placeholder="Install a plugin from owner/repo, a GitHub link or a folder"
                aria-label="Install a plugin from"
                @input="source = $event.target.value"
                @keydown.enter="preview"
            >
                <template #end>
                    <Btn kind="primary" small :busy="busy === 'preview'" :disabled="!source || busy === 'preview'" @click="preview">
                        Check before installing
                    </Btn>
                </template>
            </TextInput>
        </PageBar>

        <div class="body">
            <p class="lead">
                A plugin runs as you, with your files and your network. Check before installing shows every command it would run before
                anything runs, and it installs at that exact commit.
            </p>
            <template v-if="previewText">
                <Console :text="previewText" />
            </template>
            <template v-if="asked">
                <p class="note">Sent to the agent; its answer comes in the chat.</p>
            </template>
            <template v-if="!plugins.length">
                <EmptyState :loading="!hasLoaded('plugins')" title="No plugin is installed">Paste a repository above to see what it would run.</EmptyState>
            </template>
            <div class="cards">
                <template v-for="p in plugins" :key="p.id">
                    <PluginCard
                        :data-plugin="p.id"
                        :plugin="p"
                        :pages="pagesOf(p)"
                        :busy="busy === `${p.id}`"
                        :reading="reading === p.name"
                        @toggle="(on) => plugin(p, on ? 'enable' : 'disable')"
                        @upgrade="upgrade(p)"
                        @setup="plugin(p, 'upgrade', {yes: true, again: true})"
                        @settings="settingsOf(p.name)"
                        @dashboard="(board) => (viewing = {plugin: p, board})"
                        @log="toggleLog(p)"
                        @record="recording = p"
                        @remove="removing = p"
                    />
                </template>
                <PluginMakeCard @click="((making = true), (asked = false))" />
            </div>
        </div>

        <template v-if="making">
            <PluginMakeDialog
                v-model:repository="repository"
                v-model:wish="wish"
                @close="making = false"
                @guide="readGuide"
                @ask="askAgent"
            />
        </template>
        <template v-if="previewed">
            <PluginInstallDialog
                :previewed="previewed"
                :outcome="outcome"
                :live="live"
                :busy="busy"
                @close="closePreview"
                @back="outcome = null"
                @install="install"
            />
        </template>
        <template v-if="viewing">
            <PluginDashboard :plugin="viewing.plugin" :board="viewing.board" @close="viewing = null" />
        </template>
        <template v-if="recording">
            <PluginRecord :plugin="recording" @close="recording = null" />
        </template>
        <template v-if="removing">
            <PluginRemoveDialog :title="removing.title" @close="removing = null" @remove="remove" />
        </template>
        <template v-if="reading">
            <LogDialog :title="`${reading} log`" :logged="logged" :busy="Boolean(busy)" @close="reading = ''" />
        </template>
        <template v-if="guide">
            <PluginGuide @close="guide = false" />
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

.note {
    margin: 0;
    color: var(--accent-text);
    font-size: 12.5px;
}

.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 16px;
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
