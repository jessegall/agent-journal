<script setup>
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Console from "../kit/Console.vue";
import EmptyState from "../kit/EmptyState.vue";
import PageBar from "../kit/PageBar.vue";
import TextInput from "../kit/TextInput.vue";
import PluginCard from "./PluginCard.vue";
import PluginDashboard from "./PluginDashboard.vue";
import PluginGuide from "./PluginGuide.vue";
import PluginSettings from "./PluginSettings.vue";
import ServicesPanel from "./ServicesPanel.vue";
import PluginInstallDialog from "./PluginInstallDialog.vue";
import PluginLogDialog from "./PluginLogDialog.vue";
import PluginMakeCard from "./PluginMakeCard.vue";
import PluginMakeDialog from "./PluginMakeDialog.vue";
import PluginRemoveDialog from "./PluginRemoveDialog.vue";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";
import {usePoll} from "../poll.js";
import {sendMessage} from "../chat/outbox.js";

const source = ref("");
const guide = ref(false);
const making = ref(false);
const servicesFor = ref("");
const repository = ref("");
const wish = ref("");
const asked = ref(false);
const previewText = ref("");
const shown = ref(null);
const removing = ref(null);
const outcome = ref(null);
const configuring = ref(0);
const viewing = ref(null);
const configured = computed(() => plugins.value.find((p) => p.n === configuring.value));
const busy = ref("");
const plugins = computed(() =>
    rows("plugin")
        .filter((p) => !p.completed && !p.deleted)
        .map((p) => ({
            n: p.n,
            name: (p.data.manifest || {}).name || "",
            title: p.title,
            description: p.abstract || "It says nothing about itself.",
            version: p.data.version || "no version",
            source: p.data.source,
            commit: p.data.commit ? p.data.commit.slice(0, 12) : "linked folder",
            enabled: !!p.data.enabled,
            dashboards: (p.data.manifest || {}).dashboards || [],
            settings: Object.entries((p.data.manifest || {}).settings || {}).map(([key, s]) => ({
                key,
                title: s.title || key,
                help: s.help || "",
                type: s.type || "text",
                options: s.options || [],
                group: s.group || "",
                parent: s.parent || "",
                when: [s.when || []].flat().map((choice) => Object.entries(choice).map(([other, value]) => [other, String(value)])),
                detail: !!s.detail,
                value: String(((p.data.settings || {}).chosen || {})[key] ?? s.default ?? ""),
            })),
        }))
);
const services = ref([]);
const reading = ref("");
const logged = ref("");
const EVERY = 3000;
const WHILE_BUSY = 1000;
const pagesOf = (p) => (store.pages || []).filter((page) => page.plugin === p.name);

function servicesOf(p) {
    return services.value.filter((s) => s.plugin === p.name);
}

const look = usePoll(
    "services",
    () => api.services(),
    () => (busy.value ? WHILE_BUSY : EVERY),
    (got) => {
        services.value = got;
        if (busy.value) readLog();
    }
);
watch(busy, () => look());

async function preview() {
    busy.value = "preview";
    previewText.value = "";
    shown.value = null;
    try {
        shown.value = await api.previewPlugin(source.value);
    } catch (e) {
        previewText.value = e.message;
    }
    busy.value = "";
}

const LOG_EVERY = 1000;
const LOG_LINES = 5000;
const live = ref("");
let following = false;

async function logLines(name) {
    return (await api.pluginLog(name, LOG_LINES).catch(() => ({log: ""}))).log.split("\n");
}

async function follow(name, skipped) {
    live.value = (await logLines(name)).slice(skipped).join("\n");
    if (following) setTimeout(() => follow(name, skipped), LOG_EVERY);
}

async function install() {
    busy.value = "install";
    live.value = "";
    const name = shown.value.name;
    const skipped = (await logLines(name)).length;
    following = true;
    follow(name, skipped);
    try {
        const upgrading = shown.value.upgrading;
        const said = upgrading ? await api.upgradePlugin(upgrading, shown.value.current) : await api.installPlugin(source.value);
        outcome.value = {ok: true, text: typeof said === "string" ? said : `${shown.value.title} is up to date.`};
        if (!upgrading) source.value = "";
        if (!upgrading && said && said.n) {
            closeShown();
            configuring.value = said.n;
        }
    } catch (e) {
        outcome.value = {ok: false, text: e.message};
    }
    following = false;
    await follow(name, skipped);
    busy.value = "";
}

async function upgrade(p) {
    busy.value = `${p.n}`;
    try {
        shown.value = {...(await api.previewUpgrade(p.n)), upgrading: p.n};
        outcome.value = null;
    } catch (e) {
        previewText.value = e.message;
    }
    busy.value = "";
}

function closeShown() {
    shown.value = null;
    outcome.value = null;
}

async function act(p, action, body = {}) {
    busy.value = `${p.n}`;
    try {
        await api.act("plugin", p.n, action, body);
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

async function configure(p, key, value) {
    await api.act("plugin", p.n, "configure", {key, value});
}

async function clearLog() {
    const p = plugins.value.find((row) => row.name === reading.value);
    if (p) await api.act("plugin", p.n, "clear_log");
    await readLog();
}

async function readLog() {
    if (!reading.value) return;
    try {
        logged.value = (await api.pluginLog(reading.value)).log;
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
    const text = repository.value.trim()
        ? `Please make a journal plugin for ${repository.value.trim()}. First check that you can reach the repository and tell me whether you can build the integration there, then build it.${wish.value.trim() ? ` It should: ${wish.value.trim()}` : ""}`
        : `Please make a new journal plugin: ${wish.value.trim()}`;
    await sendMessage(route.value.env, {brief: text});
    making.value = false;
    repository.value = "";
    wish.value = "";
    asked.value = true;
}
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
                        Scan
                    </Btn>
                </template>
            </TextInput>
        </PageBar>

        <div class="body">
            <p class="lead">
                A plugin runs as you, with your files and your network. Scan shows every command it would run before anything runs, and it
                installs at that exact commit.
            </p>
            <template v-if="previewText">
                <Console :text="previewText" />
            </template>
            <template v-if="asked">
                <p class="note">Sent to the agent; its answer comes in the chat.</p>
            </template>
            <template v-if="!plugins.length">
                <EmptyState title="No plugin is installed">Paste a repository above to see what it would run.</EmptyState>
            </template>
            <div class="cards">
                <template v-for="p in plugins" :key="p.n">
                    <PluginCard
                        :plugin="p"
                        :services="servicesOf(p)"
                        :pages="pagesOf(p)"
                        :busy="busy === `${p.n}`"
                        :reading="reading === p.name"
                        @toggle="(on) => plugin(p, on ? 'enable' : 'disable')"
                        @upgrade="upgrade(p)"
                        @setup="plugin(p, 'upgrade', {yes: true, again: true})"
                        @settings="configuring = p.n"
                        @dashboard="(board) => (viewing = {plugin: p, board})"
                        @log="toggleLog(p)"
                        @remove="removing = p"
                        @services="servicesFor = p.name"
                    />
                </template>
                <PluginMakeCard @click="((making = true), (asked = false))" />
            </div>
        </div>

        <template v-if="servicesFor">
            <ServicesPanel :plugin="servicesFor" @close="servicesFor = ''" />
        </template>
        <template v-if="making">
            <PluginMakeDialog
                v-model:repository="repository"
                v-model:wish="wish"
                @close="making = false"
                @guide="readGuide"
                @ask="askAgent"
            />
        </template>
        <template v-if="shown">
            <PluginInstallDialog
                :shown="shown"
                :outcome="outcome"
                :live="live"
                :busy="busy"
                @close="closeShown"
                @back="outcome = null"
                @install="install"
            />
        </template>
        <template v-if="viewing">
            <PluginDashboard :plugin="viewing.plugin" :board="viewing.board" @close="viewing = null" />
        </template>
        <template v-if="configured">
            <PluginSettings :plugin="configured" @close="configuring = 0" @change="(key, value) => configure(configured, key, value)" />
        </template>
        <template v-if="removing">
            <PluginRemoveDialog :title="removing.title" @close="removing = null" @remove="remove" />
        </template>
        <template v-if="reading">
            <PluginLogDialog :name="reading" :logged="logged" :busy="Boolean(busy)" @close="reading = ''" @clear="clearLog" />
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
