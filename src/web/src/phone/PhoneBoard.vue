<script setup>
import {computed, ref, watch} from "vue";
import {phone} from "../api/phone.js";
import {usePoll} from "../poll.js";
import Icon from "../kit/Icon.vue";
import PhoneChevron from "./PhoneChevron.vue";
import {ago} from "./ago.js";
import {useUnder} from "./under.js";

const LIST_EVERY = 15000;
const SHOWN = 5;
const WAITING = "waiting";
const DEFAULT = [WAITING, "todo", "question", "plan", "report", "doc", "agent"];
const NAMES = {
    waiting: "Needs you",
    todo: "To-dos",
    question: "Questions",
    suggestion: "Suggestions",
    plan: "Plans",
    report: "Reports",
    doc: "Documents",
    work: "Work",
    agent: "Agents",
};
const props = defineProps({home: {type: Array, required: true}, waiting: {type: Array, required: true}});
const emit = defineEmits(["open", "under"]);
const heading = ref(null);
const under = useUnder(heading);
watch(under, (now) => emit("under", now), {immediate: true});
const cards = ref(props.home.length ? [...props.home] : [...DEFAULT]);
const lists = ref({});
const editing = ref(false);
const opened = ref(new Set());
const told = ref("");
const missing = computed(() => Object.keys(NAMES).filter((kind) => !cards.value.includes(kind)));

async function fetched() {
    const kinds = cards.value.filter((kind) => kind !== WAITING);
    const got = await Promise.all(kinds.map((kind) => phone.list(kind).catch(() => ({rows: [], total: 0}))));
    return Object.fromEntries(kinds.map((kind, i) => [kind, got[i]]));
}

const refresh = usePoll("phone-board", fetched, LIST_EVERY, (got) => got && (lists.value = got));

const rows = (kind) => (kind === WAITING ? props.waiting.map((item) => ({...item, updated: item.created})) : lists.value[kind]?.rows || []);
const total = (kind) => (kind === WAITING ? props.waiting.length : Math.max(lists.value[kind]?.total || 0, rows(kind).length));
const shown = (kind) => (opened.value.has(kind) ? rows(kind) : rows(kind).slice(0, SHOWN));

function more(kind) {
    opened.value = new Set([...opened.value, kind]);
}

async function arranged(next) {
    cards.value = next;
    told.value = "";
    try {
        await phone.arrange(next);
        refresh();
    } catch (error) {
        told.value = error.message;
    }
}

function moved(i, by) {
    const next = [...cards.value];
    [next[i], next[i + by]] = [next[i + by], next[i]];
    arranged(next);
}
</script>

<template>
    <div class="board" data-scroller>
        <div class="board-bar">
            <h1 ref="heading" class="board-large">Home</h1>
            <button type="button" class="board-edit" @click="editing = !editing">{{ editing ? "Done" : "Edit" }}</button>
        </div>
        <template v-if="told">
            <p class="board-told" role="status">{{ told }}</p>
        </template>
        <template v-for="(kind, i) in cards" :key="kind">
            <section class="board-card" :aria-label="NAMES[kind]">
                <header class="board-head">
                    <h2 class="board-name">{{ NAMES[kind] }}</h2>
                    <span class="board-count">{{ total(kind) }}</span>
                    <template v-if="editing">
                        <span class="board-tools">
                            <button type="button" aria-label="Move up" :disabled="i === 0" @click="moved(i, -1)">↑</button>
                            <button type="button" aria-label="Move down" :disabled="i === cards.length - 1" @click="moved(i, 1)">↓</button>
                            <button type="button" aria-label="Remove" @click="arranged(cards.filter((card) => card !== kind))">✕</button>
                        </span>
                    </template>
                </header>
                <div class="board-group">
                    <template v-if="rows(kind).length">
                        <ul class="board-rows">
                            <template v-for="row in shown(kind)" :key="row.ref">
                                <li>
                                    <button type="button" class="board-row" @click="emit('open', row.ref)">
                                        <span class="board-title">{{ row.title }}</span>
                                        <span class="board-age">{{ ago(row.updated) }}</span>
                                        <PhoneChevron class="board-chevron" />
                                    </button>
                                </li>
                            </template>
                        </ul>
                        <template v-if="rows(kind).length > shown(kind).length">
                            <button type="button" class="board-more" @click="more(kind)">{{ total(kind) > rows(kind).length ? `Show ${rows(kind).length} of ${total(kind)}` : `Show all ${rows(kind).length}` }}</button>
                        </template>
                        <template v-else-if="total(kind) > rows(kind).length">
                            <p class="board-part">Showing {{ rows(kind).length }} of {{ total(kind) }}</p>
                        </template>
                    </template>
                    <template v-else>
                        <p class="board-empty">Nothing here</p>
                    </template>
                </div>
            </section>
        </template>
        <template v-if="editing && missing.length">
            <section class="board-card" aria-label="Add a card">
                <header class="board-head">
                    <h2 class="board-name">Add a card</h2>
                </header>
                <div class="board-kinds">
                    <template v-for="kind in missing" :key="kind">
                        <button type="button" class="board-kind" @click="arranged([...cards, kind])"><Icon name="plus" :size="12" /> {{ NAMES[kind] }}</button>
                    </template>
                </div>
            </section>
        </template>
    </div>
</template>

<style scoped>
.board {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 28px;
    min-height: 0;
    padding: 0 0 24px;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
}

.board-bar {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    padding-top: 4px;
    margin-bottom: -16px;
}

.board-large {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
}

.board-edit {
    min-height: 44px;
    padding: 0 4px;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 1rem;
}

.board-told {
    margin: 0;
    color: var(--text-3);
    font-size: 0.794rem;
}

.board-card {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.board-head {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 20px;
    padding: 0 16px;
}

.board-name {
    margin: 0;
    color: var(--text-3);
    font-size: 0.765rem;
    font-weight: 400;
}

.board-count {
    color: var(--text-3);
    font-size: 0.765rem;
}

.board-tools {
    display: flex;
    gap: 4px;
    margin-left: auto;
}

.board-tools button {
    width: 36px;
    height: 36px;
    padding: 0;
    border: 0;
    border-radius: 8px;
    background: var(--hover);
    color: var(--text-2);
    font: inherit;
    font-size: 16px;
}

.board-group {
    overflow: hidden;
    border-radius: 12px;
    background: var(--raised);
}

.board-rows {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
}

.board-rows li + li .board-row {
    box-shadow: inset 16px 1px 0 var(--raised), inset 0 1px 0 var(--line);
}

.board-row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    min-height: 44px;
    padding: 11px 16px;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
}

.board-row:active:not(:disabled),
.board-more:active:not(:disabled) {
    background: var(--hover);
    opacity: 1;
}

.board-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    font-size: 1rem;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.board-age {
    flex: none;
    color: var(--text-3);
    font-size: 0.882rem;
}

.board-chevron {
    flex: none;
    color: var(--text-4);
}

.board-empty {
    margin: 0;
    padding: 12px 16px;
    color: var(--text-3);
    font-size: 0.882rem;
}

.board-part {
    margin: 0;
    padding: 11px 16px;
    border-top: 1px solid var(--line);
    color: var(--text-3);
    font-size: 0.882rem;
}

.board-more {
    width: 100%;
    min-height: 44px;
    padding: 11px 16px;
    border: 0;
    border-top: 1px solid var(--line);
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 1rem;
    text-align: left;
}

.board-kinds {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.board-kind {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-height: 40px;
    padding: 0 14px;
    border: 0;
    border-radius: 20px;
    background: var(--raised);
    color: var(--text-2);
    font: inherit;
    font-size: 0.882rem;
}
</style>
