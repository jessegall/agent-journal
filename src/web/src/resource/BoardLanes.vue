<script setup>
import {computed} from "vue";
import {rows} from "../sync/rows.js";

const props = defineProps({board: Object});
const emit = defineEmits(["open"]);
const tickets = computed(() => rows("ticket").filter((r) => !r.deleted && r.data?.board === props.board.n));
const lanes = computed(() =>
    (props.board.data?.stages || []).map((stage) => ({stage, cards: tickets.value.filter((r) => r.data?.stage === stage)}))
);
</script>

<template>
    <section class="board" :aria-label="`Board ${board.title}`">
        <h3 class="board-title">{{ board.title }}</h3>
        <div class="lanes">
            <template v-for="lane in lanes" :key="lane.stage">
                <div class="lane">
                    <div class="lane-head">
                        <span>{{ lane.stage }}</span>
                        <span class="count">{{ lane.cards.length }}</span>
                    </div>
                    <template v-for="r in lane.cards" :key="r.n">
                        <button type="button" class="card" @click="emit('open', r)">{{ r.title }}</button>
                    </template>
                </div>
            </template>
        </div>
    </section>
</template>

<style scoped>
.board-title {
    margin: 0 0 8px;
    font-size: 14px;
}

.lanes {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 16px;
}

.lane {
    display: flex;
    flex: 0 0 220px;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
    border-radius: 8px;
    background: var(--surface-2, rgba(127, 127, 127, 0.08));
}

.lane-head {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 600;
}

.count {
    opacity: 0.6;
}

.card {
    padding: 8px;
    border: 1px solid var(--line, #e5e5e5);
    border-radius: 6px;
    background: var(--surface, transparent);
    color: inherit;
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}
</style>
