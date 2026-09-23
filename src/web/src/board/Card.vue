<script setup>
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import {computed, inject, ref} from "vue";
import Icon from "../kit/Icon.vue";
import PriorityIcon from "../kit/PriorityIcon.vue";
import {useCardDrag} from "../composables/cardDrag.js";
import {api} from "../api/client.js";
import {peek} from "../route.js";
import {store} from "../state/store.js";
import CardMenu from "./CardMenu.vue";

const props = defineProps({card: Object});
const board = inject("board");
const drag = useCardDrag();
const menu = ref(false);
const plan = computed(() => props.card.plan);
const opener = ref(null);
const titleOf = (name) => (store.board.agents.find((agent) => agent.name === name) || {title: name}).title;
const people = () => [...new Set([props.card.assigned, props.card.worker && props.card.worker.agent].filter(Boolean))];

async function act(action) {
    await api.act(props.card.type, props.card.n, action);
    board.refresh();
}

function begin(event) {
    event.dataTransfer.effectAllowed = "move";
    drag.start(props.card);
}
</script>

<template>
    <div
        :class="['card', {moving: board.moving.value === card.n, dragged: drag.dragged.value && drag.dragged.value.n === card.n}]"
        role="button"
        tabindex="0"
        :draggable="card.targets.length > 0"
        @dragstart="begin"
        @dragend="drag.end"
        @click="peek(card.type, card.n)"
        @keydown.enter="peek(card.type, card.n)"
    >
        <span class="top">
            <span class="title">{{ card.title }}</span>
            <button ref="opener" type="button" class="more" title="Move, assign or open" @click.stop="menu = !menu">
                <Icon name="more" />
            </button>
        </span>
        <template v-if="card.actions.length">
            <span class="actions">
                <template v-for="(action, i) in card.actions" :key="action.action">
                    <Btn small :kind="i ? 'ghost' : 'primary'" @click.stop="act(action.action)">{{ action.label }}</Btn>
                </template>
            </span>
        </template>
        <span class="meta">
            <PriorityIcon :value="card.priority" />
            <span class="number">#{{ card.n }}</span>
            <template v-if="card.reason">
                <span class="reason">{{ card.reason }}</span>
            </template>
            <template v-if="card.link">
                <a class="app" :href="card.link" target="_blank" rel="noopener" @click.stop>Open app ↗</a>
            </template>
        </span>
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
        <template v-if="plan">
            <Chip @click.stop="peek('plan', plan.n)">Plan {{ plan.n }} · phase {{ plan.phase }}</Chip>
        </template>
        <template v-if="menu">
            <CardMenu :card="card" :anchor="opener" @close="menu = false" />
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
    font-weight: 500;
    line-height: 1.45;
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
    color: var(--text-4);
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
