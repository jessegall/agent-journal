<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {api} from "../api.js";
import {peek} from "../route.js";
import {route} from "../route.js";
import {age, byRef, meta, store, word} from "../store.js";

const EVERY = 4000;
const TABS = [
    ["events", "Activity"],
    ["files", "Files"],
];
const tab = ref("events");
const changes = ref([]);

async function readChanges() {
    if (tab.value !== "files") return;
    try {
        changes.value = (await api("GET", `/${route.value.env}/changes`)).changes || [];
    } catch {
        changes.value = [];
    }
}

const reading = setInterval(readChanges, EVERY);
onUnmounted(() => clearInterval(reading));

function show(name) {
    tab.value = name;
    readChanges();
}

const updated = (e) =>
    e.type === "notification" && e.action === "created" && (byRef(`notification:${e.n}`) || {data: {}}).data.kind === "update";
const settled = ref(false);
onMounted(() => setTimeout(() => (settled.value = true), 400));
const shown = computed(() =>
    [...store.events]
        .reverse()
        .filter((e) => meta(e.type).notify.includes("user") || updated(e))
        .slice(0, 80)
);
const words = {created: "New", updated: "Updated", deleted: "Deleted", linked: "Linked", commented: "Commented on"};
const heading = (e) =>
    updated(e)
        ? "Journal updated"
        : e.action === "completed"
          ? `${meta(e.type).title} ${word(e.type, "complete")}`
          : `${words[e.action]} ${meta(e.type).title.toLowerCase()}`;
const title = (e) => (byRef(`${e.type}:${e.n}`) || {}).title || "";
const who = (e) => e.actor[0].toUpperCase() + e.actor.slice(1);
</script>

<template>
    <aside class="activity-dock">
        <div class="activity-panel">
            <div class="activity-head">
                <button
                    v-for="[name, label] in TABS"
                    :key="name"
                    :class="['activity-tab', {on: tab === name}]"
                    type="button"
                    @click="show(name)"
                >
                    {{ label }}
                </button>
            </div>
            <TransitionGroup v-if="tab === 'events'" tag="div" class="activity-list" :name="settled ? 'act' : ''">
                <a
                    v-for="e in shown"
                    :key="e.id"
                    :class="['activity-row', 'activity-link', {'activity-update': updated(e)}]"
                    href="#"
                    @click.prevent="peek(e.type, e.n)"
                >
                    <span class="activity-text">
                        {{ heading(e) }}
                        <span class="activity-n">{{ e.n }}</span>
                    </span>
                    <template v-if="title(e)">
                        <span class="activity-title">{{ title(e) }}</span>
                    </template>
                    <span class="activity-age">{{ who(e) }} · {{ age(e.at) || "just now" }}</span>
                </a>
            </TransitionGroup>
            <TransitionGroup v-else tag="div" class="activity-list" :name="settled ? 'act' : ''">
                <div v-for="(change, i) in changes" :key="`${change.at}-${change.path}-${i}`" class="activity-row">
                    <span class="activity-text">
                        {{ change.path.split("/").pop() }}
                        <span :class="['activity-kind', change.kind]">{{ change.kind }}</span>
                    </span>
                    <span class="activity-title">{{ change.path }}</span>
                    <span class="activity-age">
                        <span v-if="change.added" class="activity-added">+{{ change.added }}</span>
                        <span v-if="change.removed" class="activity-removed">−{{ change.removed }}</span>
                        {{ age(change.at) || "just now" }}
                    </span>
                </div>
                <p v-if="!changes.length" key="none" class="activity-none">No file has changed yet.</p>
            </TransitionGroup>
        </div>
    </aside>
</template>

<style scoped>
.activity-dock {
    width: 290px;
    flex: none;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0 10px;
    background: var(--side);
    border-left: 1px solid var(--border);
}

.activity-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.activity-head {
    height: 48px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 14px;
    padding: 0 18px;
    margin: 0 -10px;
    padding: 0 10px;
    border-bottom: 1px solid var(--border);
}

.activity-tab {
    display: inline-flex;
    align-items: center;
    height: 100%;
    padding: 0;
    border: 0;
    background: none;
    font-size: 11.5px;
    letter-spacing: 0.03em;
    color: var(--text-3);
    white-space: nowrap;
    cursor: pointer;
}

.activity-tab:hover {
    color: var(--text-2);
}

.activity-tab.on {
    color: var(--text);
    box-shadow: inset 0 -1px 0 var(--accent);
}

.activity-kind {
    margin-left: 5px;
    font-size: 10px;
    color: var(--text-3);
}

.activity-kind.created {
    color: var(--created);
}

.activity-kind.deleted {
    color: var(--danger);
}

.activity-added {
    margin-right: 5px;
    color: var(--created);
}

.activity-removed {
    margin-right: 5px;
    color: var(--danger);
}

.activity-none {
    margin: 10px 8px;
    font-size: 12px;
    color: var(--text-3);
}

.group-label {
    font-size: 11.5px;
    font-weight: 500;
    color: var(--text-3);
    padding: 0 8px;
}

.activity-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 8px 0 12px;
}

.activity-row {
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 5px 8px;
}

.activity-link {
    color: inherit;
    border-radius: 7px;
}

.activity-link:hover {
    background: var(--hover);
}

.activity-link:hover .activity-text {
    color: var(--text);
}

.activity-text {
    font-size: 12px;
    color: var(--text-2);
    line-height: 1.45;
    overflow-wrap: anywhere;
}

.activity-n {
    margin-left: 0.35em;
    font-size: 10.5px;
    color: var(--text-3);
    opacity: 0.65;
    font-variant-numeric: tabular-nums;
}

.activity-n::before {
    content: "·";
    margin-right: 0.35em;
}

.activity-title {
    font-size: 11.5px;
    color: var(--text-3);
    line-height: 1.4;
    overflow-wrap: anywhere;
}

.activity-age {
    font-size: 11px;
    color: var(--text-3);
    white-space: nowrap;
    opacity: 0.8;
}
.activity-list {
    position: relative;
}

.act-enter-active {
    transition:
        opacity 0.24s ease-out,
        transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.act-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

.act-leave-active {
    position: absolute;
    left: 0;
    right: 0;
    transition: opacity 0.18s ease-in;
}

.act-leave-to {
    opacity: 0;
}

.act-move {
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.activity-update {
    margin: 2px 0;
    border-radius: 8px;
    background: color-mix(in srgb, var(--accent) 16%, transparent);
    box-shadow: inset 2px 0 0 var(--accent);
}
</style>
