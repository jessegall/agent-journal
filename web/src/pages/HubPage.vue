<script setup>
import {computed, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {api} from "../api.js";
import JournalBar from "../layout/JournalBar.vue";
import {remembered, store} from "../store.js";

const LINGER = 60000;
const journals = ref([]);
const loaded = ref(false);
const running = computed(() => journals.value.filter((j) => j.running));
const opened = reactive(new Set(remembered("journal.hub", [])));
const streams = new Map();
let ticking = 0;
let scanning = false;

function baseOf(j) {
    return j.current ? "" : `http://127.0.0.1:${j.port}`;
}

function keepWatching() {
    try {
        localStorage.setItem("journal.hub", JSON.stringify([...opened]));
    } catch (e) {}
}

function toggle(j) {
    if (opened.has(j.root)) opened.delete(j.root);
    else opened.add(j.root);
    keepWatching();
}

async function refresh(j) {
    if (!j.running) {
        j.summary = null;
        j.unreadable = false;
        return;
    }
    try {
        j.summary = await api("GET", "/summary", undefined, baseOf(j));
        j.gone = 0;
        j.unreadable = false;
    } catch (e) {
        j.unreadable = true;
    }
}

function listenTo(j) {
    const envs = j.running ? ((j.summary || {}).environments || []).map((e) => e.name) : [];
    const have = streams.get(j.root) || new Map();
    for (const name of envs) {
        if (have.has(name)) continue;
        const source = new EventSource(`${baseOf(j)}/api/${name}/stream`);
        source.onmessage = () => refresh(j);
        have.set(name, source);
    }
    for (const [name, source] of have) {
        if (envs.includes(name)) continue;
        source.close();
        have.delete(name);
    }
    streams.set(j.root, have);
}

function drop(root) {
    for (const source of (streams.get(root) || new Map()).values()) source.close();
    streams.delete(root);
    journals.value = journals.value.filter((j) => j.root !== root);
}

async function forget(j) {
    await api("POST", "/journals/forget", {root: j.root});
    drop(j.root);
}

async function scan() {
    if (scanning) return;
    scanning = true;
    try {
        await rescan();
    } finally {
        scanning = false;
    }
}

async function rescan() {
    const listed = (await api("GET", "/journals")).map((got) => ({...got, current: got.port === Number(location.port)}));
    const found = listed.filter(
        (got) => got.current || !listed.some((other) => other.root === got.root && (other.current || other.port < got.port))
    );
    for (const got of found) {
        let j = journals.value.find((x) => x.port === got.port);
        if (!j) {
            j = reactive({...got, summary: null, gone: 0, unreadable: false});
            journals.value.push(j);
            await refresh(j);
        } else {
            const changed = got.version !== j.version;
            Object.assign(j, got);
            if (j.gone || (j.unreadable && changed)) await refresh(j);
        }
        listenTo(j);
    }
    for (const j of [...journals.value]) {
        if (found.some((got) => got.port === j.port)) continue;
        j.gone = j.gone || Date.now();
        if (Date.now() - j.gone > LINGER) drop(j.port);
    }
    journals.value.sort((a, b) => (b.current ? 1 : 0) - (a.current ? 1 : 0) || a.project.localeCompare(b.project));
    loaded.value = true;
}

watch(
    () => store.events,
    () => {
        const mine = journals.value.find((j) => j.current);
        if (mine) refresh(mine);
    }
);

onMounted(async () => {
    await scan();
    ticking = setInterval(scan, 2000);
});

onUnmounted(() => {
    clearInterval(ticking);
    for (const j of [...journals.value]) drop(j.root);
});
</script>

<template>
    <section class="hub">
        <div class="bar">
            <span class="count">
                {{ running.length }} {{ running.length === 1 ? "journal" : "journals" }} running on this machine{{
                    journals.length > running.length ? `, ${journals.length - running.length} stopped` : ""
                }}
            </span>
        </div>
        <template v-if="loaded && running.length < 2">
            <p class="empty">
                Only this journal is running. Start another with
                <code>journal claude</code>
                in its project and it appears here.
            </p>
        </template>
        <div class="bars">
            <template v-for="j in journals" :key="j.root">
                <template v-if="j.summary || j.unreadable || !j.running">
                    <JournalBar :journal="j" :open="opened.has(j.root)" @toggle="toggle(j)" @changed="refresh(j)" @forget="forget(j)" />
                </template>
            </template>
        </div>
    </section>
</template>

<style scoped>
.hub {
    padding: 0 0 40px;
}

.bar {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 44px;
    padding: 0 14px 0 22px;
    border-bottom: 1px solid var(--border);
    color: var(--text-2);
}

.empty {
    padding: 24px 22px;
    color: var(--text-3);
}

.empty code {
    color: var(--text-2);
}

.bars {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 18px 14px 0 22px;
}
</style>
