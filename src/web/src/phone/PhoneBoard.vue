<script setup>
import {computed, ref} from "vue";
import {phone} from "../api/phone.js";
import {usePoll} from "../poll.js";
import Icon from "../kit/Icon.vue";
import {ago} from "./ago.js";

const LIST_EVERY = 15000;
const SHOWN = 5;
const WAITING = "waiting";
const DEFAULT = [WAITING, "todo", "question", "agent"];
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
const emit = defineEmits(["open"]);
const cards = ref(props.home.length ? [...props.home] : [...DEFAULT]);
const lists = ref({});
const editing = ref(false);
const opened = ref(new Set());
const told = ref("");
const missing = computed(() => Object.keys(NAMES).filter((kind) => !cards.value.includes(kind)));

async function fetched() {
    const kinds = cards.value.filter((kind) => kind !== WAITING);
    const got = await Promise.all(kinds.map((kind) => phone.list(kind).then((answer) => answer.rows).catch(() => [])));
    return Object.fromEntries(kinds.map((kind, i) => [kind, got[i]]));
}

const refresh = usePoll("phone-board", fetched, LIST_EVERY, (got) => got && (lists.value = got));

const rows = (kind) => (kind === WAITING ? props.waiting.map((item) => ({...item, updated: item.created})) : lists.value[kind] || []);
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
    <div class="board">
        <div class="board-bar">
            <button type="button" class="board-edit" @click="editing = !editing">{{ editing ? "Done" : "Edit" }}</button>
        </div>
        <template v-if="told">
            <p class="board-told">{{ told }}</p>
        </template>
        <template v-for="(kind, i) in cards" :key="kind">
            <section class="board-card">
                <header class="board-head">
                    <span class="board-name">{{ NAMES[kind] }}</span>
                    <span class="board-count">{{ rows(kind).length }}</span>
                    <template v-if="editing">
                        <span class="board-tools">
                            <button type="button" aria-label="Move up" :disabled="i === 0" @click="moved(i, -1)">↑</button>
                            <button type="button" aria-label="Move down" :disabled="i === cards.length - 1" @click="moved(i, 1)">↓</button>
                            <button type="button" aria-label="Remove" @click="arranged(cards.filter((card) => card !== kind))">✕</button>
                        </span>
                    </template>
                </header>
                <template v-if="rows(kind).length">
                    <ul class="board-rows">
                        <template v-for="row in shown(kind)" :key="row.ref">
                            <li>
                                <button type="button" class="board-row" @click="emit('open', row.ref)">
                                    <span class="board-title">{{ row.title }}</span>
                                    <span class="board-age">{{ ago(row.updated) }}</span>
                                </button>
                            </li>
                        </template>
                    </ul>
                    <template v-if="rows(kind).length > shown(kind).length">
                        <button type="button" class="board-more" @click="more(kind)">Show all {{ rows(kind).length }}</button>
                    </template>
                </template>
                <template v-else>
                    <p class="board-empty">Nothing here</p>
                </template>
            </section>
        </template>
        <template v-if="editing && missing.length">
            <div class="board-add">
                <span class="board-name">Add a card</span>
                <div class="board-kinds">
                    <template v-for="kind in missing" :key="kind">
                        <button type="button" class="board-kind" @click="arranged([...cards, kind])"><Icon name="plus" :size="12" /> {{ NAMES[kind] }}</button>
                    </template>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.board {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 12px;
    min-height: 0;
    padding: 4px 0 24px;
    overflow-y: auto;
}

.board-bar {
    display: flex;
    justify-content: flex-end;
}

.board-edit {
    min-height: 36px;
    padding: 0 12px;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 14px;
}

.board-told,
.board-empty {
    margin: 0;
    color: var(--text-3);
    font-size: 13.5px;
}

.board-card,
.board-add {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--raised);
}

.board-head {
    display: flex;
    align-items: center;
    gap: 8px;
}

.board-name {
    color: var(--text);
    font-weight: 600;
    font-size: 15px;
}

.board-count {
    color: var(--text-3);
    font-size: 13px;
}

.board-tools {
    display: flex;
    gap: 4px;
    margin-left: auto;
}

.board-tools button {
    width: 36px;
    height: 36px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: transparent;
    color: var(--text-2);
    font: inherit;
}

.board-rows {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
}

.board-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    min-height: 44px;
    padding: 6px 0;
    border: 0;
    border-top: 1px solid var(--line);
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
}

.board-title {
    overflow: hidden;
    font-size: 14.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.board-age {
    flex: none;
    color: var(--text-4);
    font-size: 12px;
}

.board-more {
    align-self: flex-start;
    min-height: 36px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 13.5px;
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
    padding: 0 12px;
    border: 1px dashed var(--border-2);
    border-radius: 10px;
    background: transparent;
    color: var(--text-2);
    font: inherit;
    font-size: 14px;
}
</style>
