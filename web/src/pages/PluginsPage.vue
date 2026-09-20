<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {act, api, command} from "../api.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import Switch from "../kit/Switch.vue";
import {route} from "../route.js";
import {load, rows, store} from "../store.js";

const source = ref("");
const shown = ref("");
const busy = ref("");
const plugins = computed(() => rows("plugin").filter((p) => !p.completed && !p.deleted));
const services = ref([]);
const EVERY = 3000;
let timer = 0;
const pagesOf = (p) => (store.pages || []).filter((page) => page.plugin === p.data.manifest.name);

function servicesOf(p) {
    return services.value.filter((s) => s.plugin === p.data.manifest.name);
}

async function look() {
    try {
        services.value = await api("GET", "/services");
    } catch (e) {
        services.value = [];
    }
}

onMounted(() => {
    look();
    timer = setInterval(look, EVERY);
});
onUnmounted(() => clearInterval(timer));

async function preview() {
    busy.value = "preview";
    shown.value = "";
    try {
        shown.value = await command(route.value.env, "plugin", "preview", {source: source.value});
    } catch (e) {
        shown.value = e.message;
    }
    busy.value = "";
}

async function install() {
    busy.value = "install";
    try {
        await command(route.value.env, "plugin", "install", {source: source.value, yes: true});
        source.value = "";
        shown.value = "";
        await load("plugin");
    } catch (e) {
        shown.value = e.message;
    }
    busy.value = "";
}

async function plugin(p, action, body = {}) {
    busy.value = `${p.n}`;
    try {
        await act(route.value.env, "plugin", p.n, action, body);
        await load("plugin");
    } catch (e) {
        shown.value = e.message;
    }
    busy.value = "";
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
            <div class="add">
                <input
                    v-model="source"
                    class="source"
                    placeholder="https://github.com/owner/repo, owner/repo, or a folder"
                    @keydown.enter="preview"
                />
                <Btn :disabled="!source || busy === 'preview'" @click="preview">{{ busy === "preview" ? "Reading…" : "Preview" }}</Btn>
            </div>
            <template v-if="shown">
                <pre class="preview">{{ shown }}</pre>
                <div class="add">
                    <span class="lead">Installing runs these commands on your machine.</span>
                    <Btn @click="shown = ''">Cancel</Btn>
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
                            <small>{{ p.data.version || "no version" }}</small>
                        </span>
                        <Switch :on="!!p.data.enabled" @change="(v) => plugin(p, v ? 'enable' : 'disable')" />
                    </header>
                    <p class="what">{{ p.abstract || "It says nothing about itself." }}</p>
                    <p class="from">
                        {{ p.data.source }}
                        <small>{{ p.data.commit ? p.data.commit.slice(0, 12) : "linked folder" }}</small>
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
                        <Btn small :disabled="busy === `${p.n}`" @click="plugin(p, 'upgrade', {yes: true})">Upgrade</Btn>
                        <Btn small :disabled="busy === `${p.n}`" @click="plugin(p, 'upgrade', {yes: true, again: true})">
                            Run setup again
                        </Btn>
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
