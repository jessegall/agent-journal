<script setup>
import {inject, ref} from "vue";
import Icon from "../kit/Icon.vue";
import PriorityIcon from "../kit/PriorityIcon.vue";
import {useCardDrag} from "../composables/cardDrag.js";
import {peek} from "../route.js";
import CardMenu from "./CardMenu.vue";

const props = defineProps({card: Object});
const board = inject("board");
const drag = useCardDrag();
const menu = ref(false);

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
        @click="peek('todo', card.n)"
        @keydown.enter="peek('todo', card.n)"
    >
        <span class="top">
            <PriorityIcon :value="card.priority" />
            <span class="number">#{{ card.n }}</span>
            <button type="button" class="more" title="Move, assign or open" @click.stop="menu = !menu"><Icon name="more" /></button>
        </span>
        <span class="title">{{ card.title }}</span>
        <template v-if="card.reason">
            <span class="reason">{{ card.reason }}</span>
        </template>
        <template v-if="card.plan">
            <span class="chip" @click.stop="peek('plan', card.plan.n)">Plan {{ card.plan.n }} · phase {{ card.plan.phase }}</span>
        </template>
        <template v-if="menu">
            <CardMenu :card="card" @close="menu = false" />
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
    place-items: center;
    width: 22px;
    height: 22px;
    margin-left: auto;
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
    align-items: center;
    gap: 6px;
    color: var(--text-3);
    font-size: 11.5px;
}

.title {
    font-size: 13px;
    line-height: 1.4;
}

.reason {
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 1.4;
}

.chip {
    align-self: flex-start;
    padding: 2px 8px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    color: var(--text-2);
    font-size: 11px;
}

.chip:hover {
    color: var(--text);
}
</style>
