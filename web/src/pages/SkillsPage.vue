<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import Switch from "../kit/Switch.vue";
import {route} from "../route.js";
import {age, agent} from "../store.js";

const rows = ref([]);
const loaded = ref(false);
const opened = ref("");
const text = ref("");
const busy = ref("");
const notice = ref("");

async function reload() {
    rows.value = await api("GET", `/${route.value.env}/skills?agent=${agent.value ? agent.value.n : 0}`);
    loaded.value = true;
}
onMounted(reload);
watch(() => agent.value && agent.value.data.uses, reload);

const loadedCount = computed(() => rows.value.filter((s) => s.loaded).length);
const journal = computed(() => rows.value.filter((s) => s.name === "journal" || s.name.startsWith("journal-")));
const others = computed(() => rows.value.filter((s) => !journal.value.includes(s)));

function state(s) {
    return s.stale ? "Changed since loaded" : s.loaded ? "Loaded" : "";
}

async function open(s) {
    if (opened.value === s.name) {
        opened.value = "";
        return;
    }
    const got = await api("GET", `/${route.value.env}/skills/${s.name}`);
    text.value = got.text.replace(/^---\n[\s\S]*?\n---\n/, "");
    opened.value = s.name;
}

async function loadNow(s) {
    busy.value = s.name;
    const got = await api("POST", `/${route.value.env}/skills/${s.name}/load`, {});
    notice.value = got.said;
    busy.value = "";
}

async function always(s, on) {
    busy.value = s.name;
    await api("POST", `/${route.value.env}/skills/${s.name}/always`, {on});
    await reload();
    busy.value = "";
}
</script>

<template>
    <section class="skills">
        <div class="bar">
            <span class="count">{{ rows.length }} skills · {{ loadedCount }} loaded in the agent's window</span>
            <template v-if="notice">
                <span class="said">{{ notice }}</span>
            </template>
        </div>
        <template v-if="loaded && !rows.length">
            <p class="empty">No skills are installed under .claude/skills or .codex/skills.</p>
        </template>
        <template
            v-for="[label, list] in [
                ['Journal', journal],
                ['Project', others],
            ]"
            :key="label"
        >
            <template v-if="list.length">
                <h3 class="label">
                    {{ label }}
                    <span class="muted">{{ list.length }}</span>
                </h3>
                <div class="rows">
                    <template v-for="s in list" :key="s.name">
                        <div :class="['row', {loaded: s.loaded, stale: s.stale, open: opened === s.name}]">
                            <button type="button" class="main" @click="open(s)">
                                <Icon name="book" />
                                <span class="name">{{ s.name }}</span>
                                <span class="description">{{ s.description }}</span>
                            </button>
                            <span :class="['state', {stale: s.stale}]">{{ state(s) }}</span>
                            <span class="changed" :title="`SKILL.md changed ${age(s.changed)}`">{{ age(s.changed) }}</span>
                            <Btn
                                small
                                :disabled="busy === s.name || (s.loaded && !s.stale)"
                                :title="s.loaded && !s.stale ? 'Loaded, and unchanged since' : `Ask the agent to load ${s.name} now`"
                                @click="loadNow(s)"
                            >
                                Load
                            </Btn>
                            <Switch
                                :on="s.always"
                                word="every start"
                                :title="s.always ? 'Stop naming it at every start' : 'Name it at every start'"
                                @change="always(s, $event)"
                            />
                        </div>
                        <template v-if="opened === s.name">
                            <pre class="text">{{ text }}</pre>
                        </template>
                    </template>
                </div>
            </template>
        </template>
    </section>
</template>

<style scoped>
.skills {
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

.said {
    margin-left: auto;
    font-size: 12px;
    color: var(--accent-text);
}

.empty {
    padding: 24px 22px;
    color: var(--text-3);
}

.label {
    margin: 22px 22px 10px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.muted {
    margin-left: 6px;
    font-weight: 400;
    color: var(--text-4);
}

.rows {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 14px 0 22px;
}

.row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 40px;
    padding: 4px 8px 4px 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
}

.row.loaded {
    border-color: var(--border-2);
}

.main {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.main .ico {
    flex: none;
    width: 14px;
    height: 14px;
    opacity: 0.7;
}

.name {
    flex: none;
    font-weight: 500;
}

.description {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    color: var(--text-3);
}

.state {
    flex: none;
    font-size: 11px;
    color: var(--progress);
}

.state.stale {
    color: var(--blocking);
}

.changed {
    flex: none;
    width: 3ch;
    font-size: 11px;
    color: var(--text-4);
}

.text {
    margin: 0 0 8px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg);
    font-size: 12px;
    line-height: 1.5;
    white-space: pre-wrap;
    color: var(--text-2);
}
</style>
