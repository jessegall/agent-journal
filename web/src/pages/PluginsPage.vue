<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
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
    try {
        previewText.value = await api.command("plugin", "preview", {source: source.value});
    } catch (e) {
        previewText.value = e.message;
    }
    busy.value = "";
}

async function install() {
    busy.value = "install";
    try {
        await api.command("plugin", "install", {source: source.value, yes: true});
        source.value = "";
        previewText.value = "";
    } catch (e) {
        previewText.value = e.message;
    }
    busy.value = "";
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
                <div class="add">
                    <span class="lead">Installing runs these commands on your machine.</span>
                    <Btn @click="previewText = ''">Cancel</Btn>
                    <Btn kind="primary" :disabled="busy === 'install'" @click="install">
                        {{ busy === "install" ? "Installing…" : "Install" }}
                    </Btn>
                </div>
            </template>
        </header>
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
                        <Btn small :disabled="busy === `${p.n}`" @click="plugin(p, 'upgrade', {yes: true})">
                            <template v-if="busy === `${p.n}`">
                                <Spinner />
                            </template>
                            Upgrade
                        </Btn>
                        <Btn small :disabled="busy === `${p.n}`" @click="plugin(p, 'upgrade', {yes: true, again: true})">
                            Run setup again
                        </Btn>
                        <Btn small @click="toggleLog(p)">{{ readingOf(p) ? "Hide log" : "Log" }}</Btn>
                        <Btn
                            kind="danger"
                            small
                            :disabled="busy === `${p.n}`"
                            @click="plugin(p, 'remove', {how: 'removed from the viewer'})"
                        >
                            Remove
                        </Btn>
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
    gap: 8px;
    margin-top: auto;
}

.none {
    margin: 0;
    color: var(--text-3);
}
</style>
