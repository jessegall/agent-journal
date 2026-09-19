<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {api} from "../api.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import TopBar from "../layout/TopBar.vue";
import {route} from "../route.js";
import {span} from "../store.js";

const EVERY = 2000;
const RUNNING = ["ready", "starting"];
const rows = ref([]);
const error = ref("");
const reading = ref("");
const log = ref("");
const now = ref(Date.now() / 1000);
let timer = 0;

const running = computed(() => rows.value.filter((r) => RUNNING.includes(r.state)).length);

async function look() {
    try {
        rows.value = await api("GET", "/services");
        error.value = "";
        if (reading.value) log.value = (await api("GET", `/services/${reading.value}/log?lines=200`)).log;
    } catch (e) {
        error.value = e.message;
    }
    now.value = Date.now() / 1000;
}

async function ask(id, want) {
    try {
        await api("POST", `/services/${id}`, {want});
        await look();
    } catch (e) {
        error.value = e.message;
    }
}

function read(id) {
    reading.value = reading.value === id ? "" : id;
    log.value = "";
    look();
}

onMounted(() => {
    look();
    timer = setInterval(look, EVERY);
});
onUnmounted(() => clearInterval(timer));
</script>

<template>
    <TopBar :crumbs="[route.env, 'Services']" />
    <section class="services">
        <p class="count">{{ running }} running of {{ rows.length }}</p>
        <template v-if="error">
            <p class="error">{{ error }}</p>
        </template>
        <template v-if="!rows.length">
            <p class="none">No plugin on this project declares a service.</p>
        </template>
        <template v-for="row in rows" :key="row.id">
            <div class="service">
                <span :class="['dot', row.state]" />
                <span class="who">
                    {{ row.id }}
                    <small>{{ row.why || row.state }}</small>
                </span>
                <template v-if="row.url">
                    <a class="where" :href="row.url" target="_blank">{{ row.url }}</a>
                </template>
                <span class="since">{{ row.since ? `up ${span(now - row.since)}` : "" }}</span>
                <span class="acts">
                    <Btn small @click="ask(row.id, RUNNING.includes(row.state) ? 'down' : 'up')">
                        {{ RUNNING.includes(row.state) ? "Stop" : "Start" }}
                    </Btn>
                    <Btn small @click="ask(row.id, 'restart')">Restart</Btn>
                    <Btn small @click="read(row.id)">{{ reading === row.id ? "Hide log" : "Log" }}</Btn>
                </span>
            </div>
            <template v-if="reading === row.id">
                <pre class="log">{{ log || "Nothing is logged yet." }}</pre>
            </template>
        </template>
    </section>
</template>

<style scoped>
.services {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.count {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.none {
    margin: 0;
    color: var(--text-3);
}

.error {
    margin: 0;
    color: var(--danger);
}

.service {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--raised);
}

.dot {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-3);
}

.dot.ready {
    background: var(--created);
}

.dot.starting {
    background: var(--progress);
}

.dot.failed,
.dot.blocked {
    background: var(--danger);
}

.who {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.who small {
    color: var(--text-3);
    font-size: 11.5px;
}

.where {
    flex: none;
    color: var(--accent-text);
    font-size: 12px;
}

.since {
    flex: none;
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
}

.acts {
    flex: none;
    display: flex;
    gap: 6px;
}

.log {
    margin: 0;
    padding: 10px 12px;
    max-height: 300px;
    overflow: auto;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--code-bg);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 12px;
    white-space: pre-wrap;
}
</style>
