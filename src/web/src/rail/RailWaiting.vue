<script setup>
import {meta, tables} from "../domain/tables.js";
import TextDisplay from "../kit/TextDisplay.vue";
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import Skeleton from "../kit/Skeleton.vue";
import {store} from "../state/store.js";
import {peek} from "../route.js";
import {happened, open as openRows, unreadByUser} from "../domain/records.js";
import {bodyOf, createdAt, refOf, titleOf} from "../domain/row.js";
import {hasLoaded} from "../sync/rows.js";
import {age} from "../format/time.js";
import {focusTurn} from "../platform/view.js";
import {remember, remembered} from "../platform/storage.js";

const props = defineProps({table: {type: String, default: ""}});
const DISMISSED = "journal.notifications.dismissed";
const dismissed = ref(new Set(remembered(DISMISSED, [])));
const newest = (a, b) => createdAt(b) - createdAt(a);
const waiting = computed(() => openRows(props.table).sort(newest));
const notifications = computed(() =>
    tables.value
        .filter((t) => t.needs_attention && t.name !== "questions")
        .flatMap((t) => unreadByUser(t.name))
        .filter((r) => !dismissed.value.has(refOf(r)))
        .sort(newest)
);
const cards = computed(() => (props.table ? waiting.value : notifications.value));
const loaded = computed(() => (props.table ? hasLoaded(props.table) : store.booted));

function dismiss(r) {
    dismissed.value = new Set([...dismissed.value, refOf(r)]);
    remember(DISMISSED, [...dismissed.value]);
}

function open(r) {
    if (r.table === "questions" || !focusTurn(refOf(r), {instant: Boolean(props.table)})) peek(r.table, r.id);
}
</script>

<template>
    <template v-if="!cards.length && !loaded">
        <Skeleton :label="table ? `Loading what waits on you` : `Loading the notifications`" />
    </template>
    <template v-else-if="!cards.length">
        <div class="home-rail-empty">
            <Icon name="todos" />
            <p>{{ table ? "Nothing waiting on you." : "No notifications." }}</p>
        </div>
    </template>
    <template v-else>
        <section class="home-section">
            <TransitionGroup name="qrow" tag="div" class="needs-slot">
                <div v-for="r in cards" :key="refOf(r)" :class="['needs-card', r.table]" @click="open(r)">
                    <div class="needs-card-top">
                        <span class="needs-card-kind">{{ happened(r) }}</span>
                        <template v-if="!table">
                            <button type="button" class="needs-dismiss" title="Seen — take it off the list" @click.stop="dismiss(r)">
                                <Icon name="close" />
                            </button>
                        </template>
                    </div>
                    <p class="needs-card-title">{{ titleOf(r) }}</p>
                    <template v-if="r.abstract || bodyOf(r)">
                        <TextDisplay class="needs-card-text" :text="(r.abstract || bodyOf(r)).slice(0, 240)" />
                    </template>
                    <p class="needs-card-foot">
                        <span class="needs-card-meta">{{ meta(r.table).title.toLowerCase() }} {{ r.id }}</span>
                        <span class="needs-card-when">{{ age(createdAt(r)) || "just now" }}</span>
                    </p>
                </div>
            </TransitionGroup>
        </section>
    </template>
</template>

<style scoped>
.qrow-enter-active {
    transition:
        opacity 0.24s ease-out,
        transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.qrow-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

.qrow-leave-active {
    position: absolute;
    left: 0;
    right: 0;
    transition:
        opacity 0.16s ease-in,
        transform 0.16s ease-in;
}

.qrow-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

.qrow-move {
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.home-rail-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    padding: 26px 18px;
    text-align: center;
    color: var(--text-3);
}

.home-rail-empty p {
    margin: 0;
    font-size: 11.5px;
}

.home-rail-empty .ico {
    width: 20px;
    height: 20px;
    opacity: 0.5;
}

.needs-slot {
    position: relative;
    display: flex;
    flex-direction: column;
}

.needs-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 10px var(--rail-gutter) 10px 14px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    overflow: hidden;
}

.needs-card::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--text-3);
    opacity: 0.5;
}

.needs-card:hover {
    background: #191a1e;
}

.needs-card:hover::before {
    opacity: 1;
}

.needs-card.question::before {
    width: 3px;
    opacity: 0.9;
}

.needs-card.question .needs-card-title {
    color: var(--text);
    font-weight: 500;
}

.needs-card-top {
    display: flex;
    align-items: baseline;
    gap: 9px;
}

.needs-card-kind {
    flex: none;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-3);
}

.needs-dismiss {
    flex: none;
    width: 26px;
    height: 26px;
    margin: -4px -6px -4px auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--text-3);
    cursor: pointer;
}

.needs-dismiss:hover {
    background: #212329;
    color: var(--text-2);
}

.needs-dismiss .ico {
    width: 12px;
    height: 12px;
}

.needs-card-foot {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 6px 0 0;
}

.needs-card-when {
    font-size: 11px;
    color: var(--text-3);
    white-space: nowrap;
}

.needs-card-meta {
    min-width: 0;
    font-size: 11px;
    color: var(--text-3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.needs-card-title {
    margin: 0;
    font-size: 13px;
    line-height: 1.45;
    color: var(--text-2);
}

.needs-card-text {
    margin: 0;
    font-size: 12px;
    line-height: 1.45;
    color: var(--text-3);
}
</style>
