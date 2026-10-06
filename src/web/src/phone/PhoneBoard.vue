<script setup>
import {scrollIntoRoom} from "./reveal.js";
import {cache, cached} from "./cache.js";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {phone} from "../api/phone.js";
import {usePoll} from "../composables/poll.js";
import Icon from "../kit/Icon.vue";
import {CARDS, kindCard} from "./kinds.js";
import PhoneBoardList from "./PhoneBoardList.vue";
import {useUnder} from "./under.js";
import {toast} from "./kit/toast.js";

const LIST_EVERY = 15000;
const PREVIEW_ROWS = 5;
const WAITING = "waiting";
const DEFAULT = [WAITING, "todo", "question", "plan", "report", "doc", "agent"];
const props = defineProps({
    home: {type: Array, required: true},
    waiting: {type: Array, required: true},
    place: {type: String, default: ""},
    sub: {type: String, default: ""},
});
const editing = defineModel("editing", {type: Boolean, default: false});
const CACHE = `board:${props.place}`;
const emit = defineEmits(["open", "under"]);
const heading = ref(null);
const under = useUnder(heading);
watch(under, (now) => emit("under", now), {immediate: true});
const cards = ref(props.home.length ? [...props.home] : [...DEFAULT]);
const lists = ref(cached(CACHE) || {});
const loaded = (kind) => kind === WAITING || kind in lists.value;
const opened = ref(new Set());
const told = ref("");
const missing = computed(() => CARDS.filter((kind) => !cards.value.includes(kind)));

async function fetched() {
    const kinds = cards.value.filter((kind) => kind !== WAITING);
    const got = await Promise.allSettled(kinds.map((kind) => phone.list(kind)));
    if (got.every((result) => result.status === "rejected")) return null;
    return Object.fromEntries(
        kinds.map((kind, i) => [kind, got[i].status === "fulfilled" ? got[i].value : lists.value[kind]]).filter(([, rows]) => rows)
    );
}

const refresh = usePoll("phone-board", fetched, LIST_EVERY, (got) => got && (lists.value = cache(CACHE, {...lists.value, ...got})));

const newRefs = computed(() => new Set(props.waiting.map((item) => item.ref)));
const board = ref(null);

onMounted(() => {
    if (!props.waiting.length) return;
    nextTick(() => scrollIntoRoom(board.value, board.value?.querySelector('[data-card="waiting"]')));
});
const listed = (kind) => lists.value[kind]?.rows || [];
const rows = (kind) => (kind === WAITING ? props.waiting.map((item) => ({...item, updated: item.created})) : listed(kind));
const total = (kind) => (kind === WAITING ? props.waiting.length : Math.max(lists.value[kind]?.total || 0, rows(kind).length));

function remove(kind) {
    const before = [...cards.value];
    arranged(cards.value.filter((card) => card !== kind));
    toast(`Removed ${kindCard(kind)} from Home`, () => arranged(before));
}
const visibleRows = (kind) => (opened.value.has(kind) ? rows(kind) : rows(kind).slice(0, PREVIEW_ROWS));

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
    <div ref="board" class="board" data-scroller>
        <div class="board-bar">
            <h1 ref="heading" class="board-large">Home</h1>
            <template v-if="sub">
                <p class="board-sub">{{ sub }}</p>
            </template>
        </div>
        <template v-if="told">
            <p class="board-told" role="status">{{ told }}</p>
        </template>
        <TransitionGroup name="card" tag="div" class="board-cards">
            <template v-for="(kind, i) in cards" :key="kind">
                <template v-if="!editing && loaded(kind) && !total(kind)">
                    <p class="board-none">{{ kindCard(kind) }} · none yet</p>
                </template>
                <template v-else>
                    <section class="board-card" :aria-label="kindCard(kind)" :data-card="kind">
                        <header class="board-head">
                            <h2 class="board-name">{{ kindCard(kind) }}</h2>
                            <template v-if="loaded(kind)">
                                <span class="board-count">{{ total(kind) }}</span>
                            </template>
                            <template v-if="editing">
                                <span class="board-tools">
                                    <button
                                        type="button"
                                        :aria-label="`Move ${kindCard(kind)} up`"
                                        :disabled="i === 0"
                                        @click="moved(i, -1)"
                                    >
                                        <Icon name="up" :size="16" />
                                    </button>
                                    <button
                                        type="button"
                                        :aria-label="`Move ${kindCard(kind)} down`"
                                        :disabled="i === cards.length - 1"
                                        @click="moved(i, 1)"
                                    >
                                        <Icon name="down" :size="16" />
                                    </button>
                                    <button type="button" :aria-label="`Remove ${kindCard(kind)}`" @click="remove(kind)">
                                        <Icon name="close" :size="16" />
                                    </button>
                                </span>
                            </template>
                        </header>
                        <PhoneBoardList
                            :loaded="loaded(kind)"
                            :rows="rows(kind)"
                            :visibleRows="visibleRows(kind)"
                            :total="total(kind)"
                            :fresh="kind === 'waiting' ? [] : [...newRefs]"
                            :mark="kind === 'question' ? 'Waiting' : 'New'"
                            @open="(ref) => emit('open', ref)"
                            @more="more(kind)"
                        />
                    </section>
                </template>
            </template>
        </TransitionGroup>
        <template v-if="editing && missing.length">
            <section class="board-card" aria-label="Add a card">
                <header class="board-head">
                    <h2 class="board-name">Add a card</h2>
                </header>
                <div class="board-kinds">
                    <template v-for="kind in missing" :key="kind">
                        <button type="button" class="board-kind" @click="arranged([...cards, kind])">
                            <Icon name="plus" :size="12" />
                            {{ kindCard(kind) }}
                        </button>
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
    padding: 0 0 calc(32px + var(--safe-bottom));
    overflow-y: auto;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
}

.board-bar {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 4px;
    margin-bottom: -16px;
}

.board-sub {
    margin: 0;
    color: var(--text-3);
    font-size: 0.9375rem;
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


.board-cards {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 28px;
}

.card-move {
    transition: transform 250ms var(--push);
}

.card-enter-active,
.card-leave-active {
    transition:
        opacity 200ms ease-out,
        transform 200ms ease-out;
}

.card-enter-from,
.card-leave-to {
    opacity: 0;
    transform: scale(0.97);
}

.card-leave-active {
    position: absolute;
    right: 0;
    left: 0;
}

.board-tools {
    animation: tools-in 200ms ease-out;
}

@keyframes tools-in {
    from {
        opacity: 0;
        transform: translateX(8px);
    }
}

.board-none {
    margin: -16px 0 0;
    padding: 0 16px;
    color: var(--text-3);
    font-size: 0.824rem;
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
