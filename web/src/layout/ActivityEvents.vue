<script setup>
import {computed, onMounted, ref} from "vue";
import {peek} from "../route.js";
import {byRef} from "../domain/records.js";
import {age} from "../format/time.js";
import {meta, store, word} from "../state/store.js";

const WORDS = {created: "New", updated: "Updated", deleted: "Deleted", linked: "Linked", commented: "Commented on", reopened: "Reopened"};
const settled = ref(false);
onMounted(() => setTimeout(() => (settled.value = true), 400));
const announced = (e) =>
    e.type === "notification" && e.action === "created" && (byRef(`notification:${e.n}`) || {data: {}}).data.kind === "update";
const shown = computed(() =>
    [...store.events]
        .reverse()
        .filter((e) => e.action !== "stamped" && (meta(e.type).notify.includes("user") || announced(e)))
        .slice(0, 80)
);
const did = (e) => (e.action === "updated" && e.data && e.data.section ? "sectioned" : e.action);
function heading(e) {
    if (announced(e)) return "Journal updated";
    const own = (meta(e.type).shown || {})[did(e)];
    if (own) return own;
    if (e.action === "completed") return `${meta(e.type).title} ${word(e.type, "complete")}`;
    return `${WORDS[e.action]} ${meta(e.type).title.toLowerCase()}`;
}
const title = (e) => (byRef(`${e.type}:${e.n}`) || {}).title || "";
const who = (e) => e.actor[0].toUpperCase() + e.actor.slice(1);
</script>

<template>
    <TransitionGroup tag="div" class="activity-list" :name="settled ? 'act' : ''">
        <a
            v-for="e in shown"
            :key="e.id"
            :class="['activity-row', 'activity-link', {'activity-update': announced(e)}]"
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
</template>

<style scoped>
.activity-list {
    position: relative;
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

.activity-text {
    font-size: 12px;
    color: var(--text-2);
    line-height: 1.45;
    overflow-wrap: anywhere;
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

.activity-update {
    margin: 2px 0;
    border-radius: 8px;
    background: color-mix(in srgb, var(--accent) 16%, transparent);
    box-shadow: inset 2px 0 0 var(--accent);
}
</style>
