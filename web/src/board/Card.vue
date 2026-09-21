<script setup>
import PriorityIcon from "../kit/PriorityIcon.vue";
import {peek} from "../route.js";

defineProps({card: Object});
</script>

<template>
    <button type="button" class="card" @click="peek('todo', card.n)">
        <span class="top">
            <PriorityIcon :value="card.priority" />
            <span class="number">#{{ card.n }}</span>
        </span>
        <span class="title">{{ card.title }}</span>
        <template v-if="card.reason">
            <span class="reason">{{ card.reason }}</span>
        </template>
        <template v-if="card.plan">
            <span class="chip" @click.stop="peek('plan', card.plan.n)">Plan {{ card.plan.n }} · phase {{ card.plan.phase }}</span>
        </template>
    </button>
</template>

<style scoped>
.card {
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
