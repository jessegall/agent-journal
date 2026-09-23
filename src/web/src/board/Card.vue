<script setup>
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import {computed, inject, ref} from "vue";
import Icon from "../kit/Icon.vue";
import PriorityIcon from "../kit/PriorityIcon.vue";
import StateDot from "../kit/StateDot.vue";
import {useCardDrag} from "../composables/cardDrag.js";
import {api} from "../api/client.js";
import {peek} from "../route.js";
import {store} from "../state/store.js";
import CardMenu from "./CardMenu.vue";

const props = defineProps({card: Object});
const board = inject("board");
const drag = useCardDrag();
const menu = ref(false);
const self = ref(null);
const cardsIn = (lane) => [...lane.querySelectorAll(".card")];
const beside = (by) => {
    const lanes = [...document.querySelectorAll(".lanes .lane")];
    const next = lanes[lanes.indexOf(self.value.closest(".lane")) + by];
    return next && cardsIn(next)[0];
};
const within = (by) => {
    const cards = cardsIn(self.value.closest(".lane"));
    return cards[cards.indexOf(self.value) + by];
};
const STEPS = {ArrowDown: () => within(1), ArrowUp: () => within(-1), ArrowRight: () => beside(1), ArrowLeft: () => beside(-1)};

function onKey(e) {
    if (e.target !== self.value) return;
    if (e.key === "m") return (e.preventDefault(), (menu.value = !menu.value));
    const target = STEPS[e.key] && STEPS[e.key]();
    if (target) (e.preventDefault(), target.focus());
}

const over = ref(false);
const reorders = computed(() => {
    const moved = drag.dragged.value;
    return Boolean(moved) && moved.n !== props.card.n && moved.state === "queued" && props.card.state === "queued";
});

async function dropBefore() {
    over.value = false;
    const moved = drag.dragged.value;
    drag.end();
    await api.act("ticket", moved.n, "queue_before", {other: props.card.n});
    board.refresh();
}

function closeMenu() {
    menu.value = false;
    self.value.focus();
}
const plan = computed(() => props.card.plan);
const opener = ref(null);
const titleOf = (name) => ([...store.board.agents, ...store.board.roles].find((who) => who.name === name) || {title: name}).title;
const people = () => [...new Set([props.card.assigned, props.card.worker && props.card.worker.agent].filter(Boolean))];

async function act(action) {
    if (action.note) return board.askNote({card: props.card, action});
    await api.act(props.card.type, props.card.n, action.action);
    board.refresh();
}

function begin(event) {
    event.dataTransfer.effectAllowed = "move";
    drag.start(props.card);
}
</script>

<template>
    <div
        :class="[
            'card',
            {moving: board.moving.value === card.n, dragged: drag.dragged.value && drag.dragged.value.n === card.n, before: over},
        ]"
        ref="self"
        role="button"
        tabindex="0"
        :draggable="card.targets.length > 0"
        @dragstart="begin"
        @dragend="drag.end"
        @click="peek(card.type, card.n)"
        @keydown.enter="peek(card.type, card.n)"
        @keydown="onKey"
        @dragover="reorders && ($event.preventDefault(), $event.stopPropagation(), (over = true))"
        @dragleave="over = false"
        @drop="reorders && ($event.preventDefault(), $event.stopPropagation(), dropBefore())"
    >
        <span class="top">
            <span class="title">{{ card.title }}</span>
            <span :class="['corner', {open: menu}]">
                <span class="number">
                    <PriorityIcon :value="card.priority" />
                    #{{ card.n }}
                </span>
                <button ref="opener" type="button" class="more" title="Move, assign or open" @click.stop="menu = !menu">
                    <Icon name="more" />
                </button>
            </span>
        </span>
        <template v-if="card.reason || card.link_label || card.session">
            <span class="meta">
                <template v-if="card.reason">
                    <StateDot :state="card.state" />
                    <span class="reason">{{ card.reason }}</span>
                </template>
                <template v-if="card.session">
                    <button type="button" class="watch" @click.stop="board.watchAgent(card)">Watch agent</button>
                </template>
                <template v-if="card.link">
                    <a class="app" :href="card.link" target="_blank" rel="noopener" @click.stop>{{ card.link_label }} ↗</a>
                </template>
                <template v-else-if="card.link_label">
                    <span class="app">{{ card.link_label }}</span>
                </template>
            </span>
        </template>
        <span class="chips">
            <template v-for="name in people()" :key="name">
                <Chip tone="accent">{{ titleOf(name) }}</Chip>
            </template>
            <template v-if="card.worker && card.worker.parked">
                <Chip>parked</Chip>
            </template>
            <template v-if="card.reported">
                <Chip>Reported</Chip>
            </template>
            <template v-if="card.question">
                <Chip tone="danger" title="A question waits on you" @click.stop="peek('question', card.question)">!</Chip>
            </template>
        </span>
        <template v-if="card.actions.length">
            <span class="actions">
                <template v-for="(action, i) in card.actions" :key="action.label">
                    <template v-if="action.href">
                        <a class="action-link" :href="action.href" target="_blank" rel="noopener" @click.stop>{{ action.label }} ↗</a>
                    </template>
                    <template v-else>
                        <Btn small :kind="i ? 'ghost' : 'primary'" @click.stop="act(action)">{{ action.label }}</Btn>
                    </template>
                </template>
            </span>
        </template>
        <template v-if="plan">
            <Chip @click.stop="peek('plan', plan.n)">Plan {{ plan.n }} · phase {{ plan.phase }}</Chip>
        </template>
        <template v-if="menu">
            <CardMenu :card="card" :anchor="opener" @close="closeMenu" />
        </template>
    </div>
</template>

<style scoped>
.card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.card.moving {
    opacity: 0.55;
    pointer-events: none;
}

.card.before {
    box-shadow: 0 -2px 0 var(--accent);
}

.card.dragged {
    opacity: 0.4;
}

.more {
    display: grid;
    flex: none;
    place-items: center;
    width: 22px;
    height: 22px;
    margin: -2px -4px 0 0;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.more:hover {
    background: var(--hover);
    color: var(--text);
}

.card:hover {
    border-color: var(--border-2);
    background: var(--hover);
}

.top {
    display: flex;
    align-items: flex-start;
    gap: 8px;
}

.title {
    flex: 1;
    font-size: 13px;
    line-height: 1.45;
}

.corner {
    display: grid;
    flex: none;
    justify-items: end;
}

.corner > * {
    grid-area: 1 / 1;
}

.corner .more {
    visibility: hidden;
}

.card:hover .corner .number,
.card:focus-within .corner .number,
.corner.open .number {
    visibility: hidden;
}

.card:hover .corner .more,
.card:focus-within .corner .more,
.corner.open .more {
    visibility: visible;
}

.action-link {
    align-self: center;
    color: var(--text-2);
    font-size: 12px;
}

.action-link:hover {
    color: var(--text);
}

.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 1.4;
}

.number {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--text-4);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
    line-height: 20px;
}

.watch {
    margin-left: auto;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    cursor: pointer;
}

.watch:hover {
    color: var(--text);
}

.app {
    margin-left: auto;
    color: var(--text-2);
}

.app:hover {
    color: var(--text);
}

.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.chips:empty {
    display: none;
}
</style>
