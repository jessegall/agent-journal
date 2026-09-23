<script setup>
import StateDot from "../kit/StateDot.vue";
import {peek} from "../route.js";

defineProps({slots: Object, only: String});
const emit = defineEmits(["only"]);
</script>

<template>
    <div class="slots">
        <span class="part">
            <StateDot state="running" />
            Agents {{ slots.running.length }} of {{ slots.limit }} running
        </span>
        <template v-for="ticket in slots.running" :key="ticket.n">
            <button type="button" class="ticket" @click="peek('ticket', ticket.n)">#{{ ticket.n }} {{ ticket.title }}</button>
        </template>
        <template v-if="slots.queued">
            <button type="button" :class="['part', 'filter', {on: only === 'queued'}]" @click="emit('only', 'queued')">
                <StateDot state="queued" />
                {{ slots.queued }} queued
            </button>
        </template>
        <template v-if="slots.waiting">
            <button type="button" :class="['part', 'filter', {on: only === 'you'}]" @click="emit('only', 'you')">
                <StateDot state="you" />
                {{ slots.waiting }} {{ slots.waiting === 1 ? "needs" : "need" }} you
            </button>
        </template>
    </div>
</template>

<style scoped>
.slots {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 14px;
    color: var(--text-3);
    font-size: 12.5px;
}

.part {
    display: inline-flex;
    align-items: center;
    gap: 7px;
}

.ticket,
.filter {
    padding: 2px 6px;
    border: 1px solid transparent;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    cursor: pointer;
}

.ticket:hover,
.filter:hover {
    background: var(--hover);
    color: var(--text);
}

.filter.on {
    border-color: var(--border-3);
    background: var(--sel);
    color: var(--text);
}
</style>
