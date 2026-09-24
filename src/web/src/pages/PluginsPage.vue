<script setup>
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Console from "../kit/Console.vue";
import Dialog from "../kit/Dialog.vue";
import EmptyState from "../kit/EmptyState.vue";
import Icon from "../kit/Icon.vue";
import PageBar from "../kit/PageBar.vue";
import PlaceholderCard from "../kit/PlaceholderCard.vue";
import TextInput from "../kit/TextInput.vue";
import PluginCard from "./PluginCard.vue";
import PluginDashboard from "./PluginDashboard.vue";
import PluginGuide from "./PluginGuide.vue";
import PluginSettings from "./PluginSettings.vue";
import ServicesPanel from "./ServicesPanel.vue";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {polled} from "../sync/polled.js";
import {rows} from "../sync/rows.js";
import {usePoll} from "../poll.js";
import {sendMessage} from "../chat/outbox.js";

usePoll(...polled.pages);

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
const KINDS = {needs: "Needs", setup: "On install", service: "Runs", on: "Listens", refuse: "May refuse", page: "Page", setting: "Setting"};
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
                <PlaceholderCard class="make" @click="((making = true), (asked = false))">
                    <span class="make-mark"><Icon name="plus" :size="16" /></span>
                    <span class="make-title">Make a new plugin</span>
                    <span class="make-text">Ask the agent to build one for you, or read how plugins are made.</span>
                </PlaceholderCard>
            </div>
        </div>

        <template v-if="servicesFor">
            <ServicesPanel :plugin="servicesFor" @close="servicesFor = ''" />
        </template>
        <template v-if="making">
            <Dialog title="Make a new plugin" small @close="making = false">
                <div class="ask">
                    <p class="ask-lead">The agent builds it for you and answers in the chat.</p>
                    <TextInput
                        :value="repository"
                        placeholder="A GitHub repository to build it in (optional)"
                        @input="repository = $event.target.value"
                    />
                    <textarea v-model="wish" class="wish" rows="4" placeholder="What should the plugin do?" />
                </div>
                <template #foot>
                    <Btn @click="readGuide">Read how to make one</Btn>
                    <Btn kind="primary" :disabled="!repository.trim() && !wish.trim()" @click="askAgent">Send to the agent</Btn>
                </template>
            </Dialog>
        </template>
        <template v-if="shown">
            <Dialog :title="shown.title" fixed @close="closeShown">
                <template v-if="outcome">
                    <p :class="['shown-result', {failed: !outcome.ok}]">
                        {{ outcome.ok ? `${shown.title} is installed.` : "It did not install. Nothing of it was kept." }}
                    </p>
                    <Console fill :text="live || outcome.text" />
                </template>
                <template v-else-if="busy === 'install'">
                    <p class="shown-result">{{ shown.upgrading ? "Upgrading" : "Installing" }}…</p>
                    <Console fill :text="live || 'Starting…'" />
                </template>
                <template v-else>
                    <p class="shown-from">
                        from {{ shown.source }}
                        <template v-if="shown.commit">at {{ shown.commit.slice(0, 12) }}</template>
                    </p>
                    <template v-if="shown.description">
                        <p class="shown-what">{{ shown.description }}</p>
                    </template>
                    <template v-if="shown.upgrading">
                        <p class="shown-lead">
                            {{
                                shown.current
                                    ? "It is already at this commit. Run goes through its install steps again."
                                    : shown.changes.length
                                      ? "What it runs changes:"
                                      : "It runs the same commands as the version you have."
                            }}
                        </p>
                        <template v-if="shown.changes && shown.changes.length">
                            <div class="shown-rows changes">
                                <template v-for="(c, i) in shown.changes" :key="i">
                                    <div class="shown-row">
                                        <span :class="['shown-kind', c.kind]">{{ c.kind === "new" ? "Now also" : "No longer" }}</span>
                                        <code class="shown-command">{{ c.line }}</code>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </template>
                    <p class="shown-lead">It runs as you, with your files and your network. This is everything it does:</p>
                    <div class="shown-rows">
                        <template v-for="(row, i) in shown.rows" :key="i">
                            <div class="shown-row">
                                <span :class="['shown-kind', row.kind]">{{ KINDS[row.kind] || row.kind }}</span>
                                <span class="shown-label">{{ row.label }}</span>
                                <code class="shown-command">{{ row.command }}</code>
                            </div>
                        </template>
                    </div>
                </template>
                <template #foot>
                    <template v-if="outcome">
                        <template v-if="!outcome.ok">
                            <Btn @click="outcome = null">Back</Btn>
                        </template>
                        <Btn kind="primary" @click="closeShown">Close</Btn>
                    </template>
                    <template v-else>
                        <Btn :disabled="busy === 'install'" @click="closeShown">Cancel</Btn>
                        <Btn kind="primary" :busy="busy === 'install'" :disabled="busy === 'install'" @click="install">Run</Btn>
                    </template>
                </template>
            </Dialog>
        </template>
        <template v-if="viewing">
            <PluginDashboard :plugin="viewing.plugin" :board="viewing.board" @close="viewing = null" />
        </template>
        <template v-if="configured">
            <PluginSettings :plugin="configured" @close="configuring = 0" @change="(key, value) => configure(configured, key, value)" />
        </template>
        <template v-if="removing">
            <Dialog :title="`Remove ${removing.title}`" @close="removing = null">
                <p class="shown-lead">
                    Its services stop, its hooks and refusals no longer run, and its folder is taken away. What it kept of its own —
                    settings, caches, anything it wrote in its data folder — can stay, in case you install it again, or go with it.
                </p>
                <template #foot>
                    <Btn @click="removing = null">Cancel</Btn>
                    <Btn @click="remove(false)">Remove, keep what it kept</Btn>
                    <Btn kind="danger" @click="remove(true)">Remove everything</Btn>
                </template>
            </Dialog>
        </template>
        <template v-if="reading">
            <Dialog :title="`${reading} log`" follow fixed @close="reading = ''">
                <Console fill :text="logged || (busy ? 'Starting…' : 'Nothing is logged yet.')" />
                <template #foot>
                    <Btn small :disabled="!logged" @click="clearLog">Clear</Btn>
                </template>
            </Dialog>
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

.make {
    flex-direction: column;
    gap: 4px;
    min-height: 160px;
    border-radius: 14px;
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

.ask {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.ask-lead {
    margin: 0 0 4px;
    color: var(--text-3);
    font-size: 12.5px;
}

.wish {
    padding: 7px 9px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    resize: vertical;
}

.wish:focus {
    outline: none;
    border-color: var(--accent);
}

.shown-result {
    margin: 0 0 10px;
    color: var(--tone-good);
    font-size: 13px;
}

.shown-result.failed {
    color: var(--danger);
}

.shown-from,
.shown-what,
.shown-lead {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 12.5px;
}

.shown-what {
    color: var(--text-2);
}

.shown-rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.shown-rows.changes {
    margin-bottom: 14px;
}

.shown-row {
    display: grid;
    grid-template-columns: 92px 1fr;
    gap: 4px 10px;
    padding: 8px 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
    font-size: 12.5px;
}

.shown-kind {
    color: var(--text-3);
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.shown-kind.new {
    color: var(--tone-good);
}

.shown-kind.gone {
    color: var(--danger);
}

.shown-kind.refuse {
    color: var(--tone-warn);
}

.shown-label {
    color: var(--text);
}

.shown-command {
    grid-column: 2;
    color: var(--text-2);
    font-family: var(--mono);
    font-size: 11.5px;
    word-break: break-all;
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
