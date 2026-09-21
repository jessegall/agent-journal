<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import {route} from "../route.js";
import {polled, store} from "../store.js";
import {usePoll} from "../poll.js";

usePoll(...polled.pages);

const EVERY = 3000;
const RUNNING = ["ready", "starting"];
const pages = computed(() => store.pages || []);
const log = ref("");
const error = ref("");
let timer = 0;

const page = computed(() => pages.value.find((p) => `${p.plugin}.${p.name}` === String(route.value.n)) || null);
const running = computed(() => !!page.value && RUNNING.includes(page.value.state));
const src = computed(() => {
    if (!page.value || !page.value.url) return "";
    const at = route.value.at || page.value.path;
    return page.value.url.replace(page.value.path, "").replace("127.0.0.1", location.hostname) + at;
});

async function look() {
    try {
        store.pages = await api.pages();
        error.value = "";
    } catch (e) {
        error.value = e.message;
    }
}

async function runPluginAction(want) {
    if (!page.value) return;
    await api.setService(page.value.service, want);
    await look();
}

async function read() {
    if (!page.value) return;
    log.value = (await api.serviceLog(page.value.service)).log;
}

watch(
    () => route.value.n,
    () => (log.value = "")
);
onMounted(() => {
    look();
    timer = setInterval(look, EVERY);
});
onUnmounted(() => clearInterval(timer));
</script>

<template>
    <template v-if="running && src">
        <iframe class="plugin-frame" :src="src" :title="page.title" />
    </template>
    <template v-else>
        <section class="down">
            <template v-if="error">
                <p class="why">{{ error }}</p>
            </template>
            <template v-else-if="!page">
                <p class="why">No plugin page is installed under that name.</p>
            </template>
            <template v-else>
                <p class="why">
                    <Icon name="plug" />
                    {{ page.title }} is not running: its service {{ page.service }} is {{ page.state }}.
                </p>
                <span class="acts">
                    <Btn kind="primary" small @click="runPluginAction('up')">Start it</Btn>
                    <Btn small @click="read">Read the log</Btn>
                    <template v-if="page.url">
                        <a class="out" :href="page.url" target="_blank">Open in a new tab</a>
                    </template>
                </span>
                <template v-if="log">
                    <pre class="log">{{ log }}</pre>
                </template>
            </template>
        </section>
    </template>
</template>

<style scoped>
.plugin-frame {
    flex: 1;
    width: 100%;
    height: 100%;
    border: 0;
    background: var(--bg);
}

.down {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
}

.why {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-2);
}

.acts {
    display: flex;
    align-items: center;
    gap: 8px;
}

.out {
    color: var(--accent-text);
    font-size: 12px;
}

.log {
    margin: 0;
    padding: 10px 12px;
    width: 100%;
    max-height: 320px;
    overflow: auto;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--code-bg);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 12px;
    white-space: pre-wrap;
}
</style>
