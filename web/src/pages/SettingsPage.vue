<script setup>
import FeaturePanel from "./FeaturePanel.vue";
import {features, flip, on} from "./featureSettings.js";

import Section from "./Section.vue";

import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Switch from "../kit/Switch.vue";
import {route} from "../route.js";
import {remember, remembered} from "../composables/remembered.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";

const chosen = ref("");
const feature = computed(() => features.value.find((f) => f.name === chosen.value) || null);
const stopping = ref(false);

async function stop() {
    stopping.value = true;
    try {
        await api.stop();
    } catch (e) {
        stopping.value = false;
    }
}

const delivers = (how) => {
    const set = (store.settings && store.settings.delivery) || {};
    return how in set ? !!set[how] : true;
};

async function setDelivery(how, value) {
    await api.saveSettings({delivery: {...((store.settings && store.settings.delivery) || {}), [how]: value}});
}
const OPENED = "journal.settings.opened";
const opened = ref(remembered(OPENED, []));
const open = (key) => opened.value.includes(key);

function fold(key) {
    opened.value = open(key) ? opened.value.filter((k) => k !== key) : [...opened.value, key];
    remember(OPENED, opened.value);
}
const envs = computed(() => rows("environment").filter((e) => !e.completed));
const extension = ref(null);

onMounted(async () => {
    extension.value = await api.extension();
});

async function saveColor(color) {
    store.identity = await api.saveIdentity({color});
}

const removing = ref({});

async function remove(e) {
    try {
        await api.act("environment", e.n, "remove", {how: "removed from the viewer", ...(removing.value[e.n] ? {yes: true} : {})});
        removing.value = {...removing.value, [e.n]: ""};
    } catch (error) {
        removing.value = {...removing.value, [e.n]: error.message};
    }
}

const sweeping = ref({});

async function sweep(e) {
    const said = await api.act("environment", e.n, "sweep", sweeping.value[e.n] ? {yes: true} : {});
    sweeping.value = {...sweeping.value, [e.n]: sweeping.value[e.n] ? "" : said};
}
</script>

<template>
    <section class="settings">
        <section class="group" :class="{shut: !open('project-identity')}">
            <header class="group-head" role="button" tabindex="0" @click="fold('project-identity')">
                <span class="fold" />
                <h2>Project identity</h2>
                <p class="lead">The band across the viewer distinguishes this project from other open journals.</p>
            </header>
            <div class="row">
                <span class="text">
                    <span class="title">Color</span>
                    <span class="help">Defaults to a stable color chosen from the project name.</span>
                </span>
                <Section @save-color="saveColor" />
            </div>
        </section>
        <section class="group" :class="{shut: !open('chrome-extension')}">
            <header class="group-head" role="button" tabindex="0" @click="fold('chrome-extension')">
                <span class="fold" />
                <h2>Chrome extension</h2>
                <p class="lead">Float the chat over any page, point at elements, send pictures, and let the agent drive the tab.</p>
            </header>
            <div class="row">
                <span class="text">
                    <span class="title">Agent journal for Chrome</span>
                    <span class="help">The unpacked extension is served from this exact journal version.</span>
                </span>
                <template v-if="extension && extension.available">
                    <span class="control">
                        <template v-if="extension.store">
                            <a class="download" :href="extension.store" target="_blank" rel="noopener">Add to Chrome</a>
                        </template>
                        <a class="download" :href="api.extensionZip()">Download</a>
                    </span>
                </template>
            </div>
        </section>
        <section class="group" :class="{shut: !open('features-on')}">
            <header class="group-head" role="button" tabindex="0" @click="fold('features-on')">
                <span class="fold" />
                <h2>Features on {{ route.env }}</h2>
                <p class="lead">Open a feature to see what it does, when it speaks and what it says.</p>
            </header>
            <div class="features">
                <template v-for="f in features" :key="f.name">
                    <div class="feature" role="button" tabindex="0" @click="chosen = f.name" @keydown.enter="chosen = f.name">
                        <span class="text">
                            <span class="title">{{ f.title }}</span>
                            <span class="help clamp">{{ f.abstract }}</span>
                        </span>
                        <span class="control" @click.stop>
                            <template v-if="f.fixed">
                                <span class="note">Always on</span>
                            </template>
                            <template v-else>
                                <Switch :on="on(f.name, f.default)" @change="(v) => flip(f.name, v)" />
                            </template>
                        </span>
                    </div>
                </template>
            </div>
        </section>
        <section class="group" :class="{shut: !open('delivery')}">
            <header class="group-head" role="button" tabindex="0" @click="fold('delivery')">
                <span class="fold" />
                <h2>Delivery</h2>
                <p class="lead">How the engine gets a line to the agent. With both off it types into the terminal.</p>
            </header>
            <div class="row">
                <span class="text">
                    <span class="title">Use the channel</span>
                    <span class="help">The agent reads it mid-turn, with nothing wrapped around it</span>
                </span>
                <span class="control">
                    <Switch :on="delivers('channel')" @change="(v) => setDelivery('channel', v)" />
                </span>
            </div>
            <div class="row">
                <span class="text">
                    <span class="title">Use the socket</span>
                    <span class="help">Delivered without typing, but the agent's own client says another session sent it</span>
                </span>
                <span class="control">
                    <Switch :on="delivers('socket')" @change="(v) => setDelivery('socket', v)" />
                </span>
            </div>
        </section>
        <section class="group" :class="{shut: !open('environments')}">
            <header class="group-head" role="button" tabindex="0" @click="fold('environments')">
                <span class="fold" />
                <h2>Environments</h2>
                <p class="lead">
                    Removing one packs its record into the attic, and journal environment unarchive with its name brings it back. Sweeping
                    one packs its messages, comments, reactions, notifications and closed rows into the attic and keeps what is still true.
                </p>
            </header>
            <template v-for="e in envs" :key="e.n">
                <div class="row">
                    <span class="text">
                        <span class="title">{{ e.title }}</span>
                    </span>
                    <span class="control">
                        <Btn small @click="sweep(e)">{{ sweeping[e.n] ? "Sweep now" : "Sweep" }}</Btn>
                        <Btn kind="danger" small :disabled="e.title === route.env" @click="remove(e)">
                            {{ removing[e.n] ? "Remove anyway" : "Remove" }}
                        </Btn>
                    </span>
                </div>
                <template v-if="sweeping[e.n]">
                    <p class="lead">{{ sweeping[e.n] }}</p>
                </template>
                <template v-if="removing[e.n]">
                    <p class="lead">{{ removing[e.n] }}</p>
                </template>
            </template>
        </section>
        <section class="group" :class="{shut: !open('stop')}">
            <header class="group-head" role="button" tabindex="0" @click="fold('stop')">
                <span class="fold" />
                <h2>Stop</h2>
                <p class="lead">
                    This closes the viewer, ends the engine and takes down every service a plugin runs. The agent's terminal stops with
                    them. Nothing on the record is touched; start it again with journal claude.
                </p>
            </header>
            <div class="row">
                <span class="text">
                    <span class="title">Stop the journal</span>
                </span>
                <span class="control">
                    <Btn kind="danger" small :disabled="stopping" @click="stop">{{ stopping ? "Stopping…" : "Stop" }}</Btn>
                </span>
            </div>
        </section>
        <template v-if="feature">
            <FeaturePanel :feature="feature" @close="chosen = ''" />
        </template>
    </section>
</template>

<style scoped>
.settings {
    max-width: 720px;
    padding: 22px 28px 60px;
}

.group + .group {
    margin-top: 32px;
}

.group-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
    padding: 6px 8px 6px 4px;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
}

.group-head:hover {
    background: var(--hover);
}

.fold {
    flex: none;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 7px solid var(--text-3);
    transform: rotate(90deg);
    transition: transform 0.15s ease;
}

.group.shut .fold {
    transform: rotate(0deg);
}

.group-head:hover .fold {
    border-left-color: var(--text);
}

.group.shut > :not(.group-head) {
    display: none;
}

.group.shut .lead {
    display: none;
}

.group-head .lead {
    flex-basis: 100%;
    padding-left: 19px;
}

h2 {
    margin: 0 0 3px;
    font-size: 15px;
    font-weight: 600;
}

.lead {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 8px;
    padding: 4px 0 8px;
}

.feature {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--raised);
    cursor: pointer;
    transition:
        border-color 0.15s,
        background 0.15s;
}

.feature:hover {
    border-color: var(--border-3);
    background: var(--hover);
}

.feature .text {
    flex: 1;
    min-width: 0;
}

.clamp {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.row {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 52px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
}

.text {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.names {
    width: 280px;
    padding: 6px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg-2);
    color: var(--text);
    font-size: 13px;
}

.part {
    padding-left: 20px;
    border-left: 2px solid var(--border);
    margin-left: 2px;
}

.part .title {
    font-weight: 400;
    color: var(--text-2);
}

.title {
    font-weight: 500;
}

.help {
    color: var(--text-2);
    font-size: 12.5px;
}

.slot {
    color: var(--accent-text);
}

.note {
    color: var(--text-3);
    font-size: 12px;
}

.control {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    min-width: 96px;
}

.days,
.names {
    height: 30px;
    padding: 0 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg-2);
    color: var(--text);
    font-size: 12.5px;
    transition:
        border-color 0.12s ease,
        background 0.12s ease;
}

.days:hover,
.names:hover {
    border-color: var(--border);
}

.days:focus,
.names:focus {
    outline: none;
    border-color: var(--progress);
    background: var(--raised);
}

.days {
    width: 64px;
    text-align: right;
}

.unit {
    color: var(--text-3);
    font-size: 12.5px;
}

.none {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.download {
    height: 28px;
    padding: 4px 10px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    color: var(--text);
    text-decoration: none;
}

.download:hover {
    background: var(--hover);
}

.color-control {
    min-width: 116px;
}

.color {
    width: 34px;
    height: 28px;
    padding: 2px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--raised);
    cursor: pointer;
}
</style>
