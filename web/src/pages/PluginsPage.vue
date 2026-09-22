<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import PluginSettings from "./PluginSettings.vue";
import Icon from "../kit/Icon.vue";
import Spinner from "../kit/Spinner.vue";
import Switch from "../kit/Switch.vue";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {polled} from "../sync/polled.js";
import {rows} from "../sync/rows.js";
import {usePoll} from "../poll.js";
import {sendMessage} from "../chat/outbox.js";
import PluginGuide from "./PluginGuide.vue";

usePoll(...polled.pages);

const source = ref("");
const guide = ref(false);
const asking = ref(false);
const repository = ref("");
const wish = ref("");
const asked = ref(false);
const previewText = ref("");
const shown = ref(null);
const removing = ref(null);
const outcome = ref(null);
const configuring = ref(0);
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
            what: p.abstract || "It says nothing about itself.",
            version: p.data.version || "no version",
            source: p.data.source,
            commit: p.data.commit ? p.data.commit.slice(0, 12) : "linked folder",
            enabled: !!p.data.enabled,
            settings: Object.entries((p.data.manifest || {}).settings || {}).map(([key, s]) => ({
                key,
                title: s.title || key,
                help: s.help || "",
                type: s.type || "text",
                options: s.options || [],
                group: s.group || "",
                value: String(((p.data.settings || {}).chosen || {})[key] ?? s.default ?? ""),
            })),
        }))
);
const services = ref([]);
const reading = ref("");
const logged = ref("");
const tail = ref(null);
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

async function install() {
    busy.value = "install";
    try {
        const upgrading = shown.value.upgrading;
        const said = upgrading
            ? await api.act("plugin", upgrading, "upgrade", {yes: true, again: shown.value.current})
            : await api.command("plugin", "install", {source: source.value, yes: true});
        outcome.value = {ok: true, text: typeof said === "string" ? said : `${shown.value.title} is up to date.`};
        if (!upgrading) source.value = "";
    } catch (e) {
        outcome.value = {ok: false, text: e.message};
    }
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

async function plugin(p, action, body = {}) {
    busy.value = `${p.n}`;
    reading.value = p.name;
    await readLog();
    try {
        await api.act("plugin", p.n, action, body);
    } catch (e) {
        previewText.value = e.message;
    }
    busy.value = "";
    await readLog();
}

async function remove(everything) {
    const p = removing.value;
    removing.value = null;
    await plugin(p, "remove", {how: "removed from the viewer"});
    if (everything) await plugin(p, "purge");
}

async function configure(p, key, value) {
    await plugin(p, "configure", {key, value});
}

async function readLog() {
    if (!reading.value) return;
    try {
        logged.value = (await api.pluginLog(reading.value)).log;
    } catch (e) {
        logged.value = e.message;
    }
    await nextTick();
    if (tail.value) tail.value.scrollTop = tail.value.scrollHeight;
}

function readingOf(p) {
    return reading.value === p.name;
}

function toggleLog(p) {
    reading.value = readingOf(p) ? "" : p.name;
    logged.value = "";
    readLog();
}

async function askAgent() {
    const text = repository.value.trim()
        ? `Please make a journal plugin for ${repository.value.trim()}. First check that you can reach the repository and tell me whether you can build the integration there, then build it.${wish.value.trim() ? ` It should: ${wish.value.trim()}` : ""}`
        : `Please make a new journal plugin: ${wish.value.trim()}`;
    await sendMessage(route.value.env, {brief: text});
    asking.value = false;
    repository.value = "";
    wish.value = "";
    asked.value = true;
}
</script>

<template>
    <section class="plugins">
        <header class="head">
            <h2>Plugins</h2>
            <p class="lead">
                Paste a repository. You see every command it would run before anything runs, and it installs at that exact commit. A plugin
                runs as you, with your files and your network.
            </p>
            <div class="make">
                <Btn small @click="guide = true">How to make a plugin</Btn>
                <Btn small @click="((asking = !asking), (asked = false))">Ask the agent to make one</Btn>
                <template v-if="asked">
                    <span class="note">Sent to the agent; its answer comes in the chat.</span>
                </template>
            </div>
            <template v-if="asking">
                <div class="ask">
                    <input v-model="repository" class="source" placeholder="A GitHub repository to build it in (optional)" />
                    <textarea v-model="wish" class="wish" rows="2" placeholder="What should the plugin do?" />
                    <Btn kind="primary" small :disabled="!repository.trim() && !wish.trim()" @click="askAgent">Send to the agent</Btn>
                </div>
            </template>
            <div class="add">
                <input
                    v-model="source"
                    class="source"
                    placeholder="https://github.com/owner/repo, owner/repo, or a folder"
                    @keydown.enter="preview"
                />
                <Btn :disabled="!source || busy === 'preview'" @click="preview">{{ busy === "preview" ? "Reading…" : "Preview" }}</Btn>
            </div>
            <template v-if="previewText">
                <pre class="preview">{{ previewText }}</pre>
            </template>
        </header>
        <template v-if="shown">
            <Dialog :title="shown.title" @close="closeShown">
                <template v-if="outcome">
                    <p :class="['shown-result', {failed: !outcome.ok}]">
                        {{ outcome.ok ? `${shown.title} is installed.` : "It did not install. Nothing of it was kept." }}
                    </p>
                    <pre class="shown-output">{{ outcome.text }}</pre>
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
                        <Btn kind="primary" class="run" :disabled="busy === 'install'" @click="install">
                            <span :class="{hidden: busy === 'install'}">Run</span>
                            <template v-if="busy === 'install'">
                                <Spinner class="run-spinner" />
                            </template>
                        </Btn>
                    </template>
                </template>
            </Dialog>
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
        <div class="cards">
            <template v-for="p in plugins" :key="p.n">
                <article class="card">
                    <header class="card-head">
                        <Icon name="plug" />
                        <span class="name">
                            {{ p.title }}
                            <small>{{ p.version }}</small>
                        </span>
                        <Switch :on="p.enabled" @change="(v) => plugin(p, v ? 'enable' : 'disable')" />
                    </header>
                    <p class="what">{{ p.what }}</p>
                    <p class="from">
                        {{ p.source }}
                        <small>{{ p.commit }}</small>
                    </p>
                    <template v-if="servicesOf(p).length">
                        <div class="services">
                            <template v-for="s in servicesOf(p)" :key="s.id">
                                <span :class="['service', s.state]" :title="s.why || s.state">
                                    <span class="dot" />
                                    {{ s.service }}
                                </span>
                            </template>
                        </div>
                    </template>
                    <template v-if="pagesOf(p).length">
                        <div class="links">
                            <template v-for="page in pagesOf(p)" :key="page.name">
                                <a class="link" :href="`#/${route.env}/page/${page.plugin}.${page.name}`">{{ page.title }}</a>
                            </template>
                        </div>
                    </template>
                    <footer class="acts">
                        <Btn small :disabled="busy === `${p.n}`" @click="upgrade(p)">
                            <template v-if="busy === `${p.n}`">
                                <Spinner />
                            </template>
                            Upgrade
                        </Btn>
                        <Btn small :disabled="busy === `${p.n}`" @click="plugin(p, 'upgrade', {yes: true, again: true})">
                            Run setup again
                        </Btn>
                        <template v-if="p.settings.length">
                            <Btn small @click="configuring = p.n">Settings</Btn>
                        </template>
                        <Btn small @click="toggleLog(p)">{{ readingOf(p) ? "Hide log" : "Log" }}</Btn>
                        <Btn kind="danger" small :disabled="busy === `${p.n}`" @click="removing = p">Remove</Btn>
                    </footer>
                </article>
            </template>
            <template v-if="!plugins.length">
                <p class="none">No plugin is installed on this project.</p>
            </template>
        </div>
        <template v-if="reading">
            <Dialog :title="`${reading} log`" @close="reading = ''">
                <pre ref="tail" class="log">{{ logged || (busy ? "Starting…" : "Nothing is logged yet.") }}</pre>
            </Dialog>
        </template>
        <template v-if="guide">
            <PluginGuide @close="guide = false" />
        </template>
    </section>
</template>

<style scoped>
.plugins {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    overflow: auto;
}

.head {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 760px;
}

h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}

.lead {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 1.5;
}

.make {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

.note {
    color: var(--text-3);
    font-size: 12px;
}

.ask {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
}

.wish {
    padding: 7px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    resize: vertical;
}

.ask :deep(button) {
    align-self: flex-start;
}

.add {
    display: flex;
    align-items: center;
    gap: 8px;
}

.source {
    flex: 1;
    padding: 8px 11px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    color: inherit;
    font: inherit;
}

.run {
    position: relative;
}

.run .hidden {
    visibility: hidden;
}

.run-spinner {
    position: absolute;
    inset: 0;
    margin: auto;
}

.shown-result {
    margin: 0 0 10px;
    color: #63b37c;
    font-size: 13px;
}

.shown-result.failed {
    color: #e0795f;
}

.shown-output {
    margin: 0;
    overflow: auto;
    padding: 12px 14px;
    border: 1px solid #1d2026;
    border-radius: 8px;
    background: #0b0c0e;
    color: #c9d1d9;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
    line-height: 1.55;
    white-space: pre-wrap;
}

.run {
    position: relative;
}

.run .hidden {
    visibility: hidden;
}

.run-spinner {
    position: absolute;
    inset: 0;
    margin: auto;
}

.shown-result {
    margin: 0 0 10px;
    color: #63b37c;
    font-size: 13px;
}

.shown-result.failed {
    color: #e0795f;
}

.shown-output {
    max-height: 360px;
    margin: 0;
    overflow: auto;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--code-bg);
    color: var(--text-2);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
    white-space: pre-wrap;
}

.settings {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 0 4px;
    border-top: 1px solid var(--border);
}

.setting {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.setting-title {
    color: var(--text);
    font-size: 12.5px;
}

.setting-help {
    color: var(--text-3);
    font-size: 11.5px;
}

.setting-value {
    margin-top: 3px;
    padding: 6px 9px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
}

.setting-value:focus {
    outline: none;
    border-color: var(--accent);
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

.shown-kind.new {
    color: #63b37c;
}

.shown-kind.gone {
    color: #e0795f;
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

.shown-kind.refuse {
    color: #d8a94a;
}

.shown-label {
    color: var(--text);
}

.shown-command {
    grid-column: 2;
    color: var(--text-2);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
    word-break: break-all;
}

.preview {
    margin: 0;
    padding: 12px 14px;
    max-height: 340px;
    overflow: auto;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--code-bg);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 12px;
    white-space: pre-wrap;
}

.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 14px;
}

.card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
}

.card-head {
    display: flex;
    align-items: center;
    gap: 10px;
}

.name {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    font-weight: 600;
}

.name small {
    color: var(--text-3);
    font-size: 11.5px;
    font-weight: 400;
}

.what {
    margin: 0;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.5;
}

.from {
    margin: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: var(--text-3);
    font-size: 11.5px;
    word-break: break-all;
}

.services {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.service {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 8px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    color: var(--text-3);
    font-size: 11.5px;
}

.service .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-3);
}

.service.ready .dot,
.service.starting .dot {
    background: var(--created);
}

.service.failed .dot,
.service.blocked .dot {
    background: var(--danger);
}

.links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.link {
    color: var(--accent-text);
    font-size: 12.5px;
}

.log {
    margin: 0;
    padding: 0;
    background: none;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
    white-space: pre-wrap;
}

.acts {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: auto;
}

.none {
    margin: 0;
    color: var(--text-3);
}
</style>
