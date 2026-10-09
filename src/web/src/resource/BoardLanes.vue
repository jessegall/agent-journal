<script setup>
import {computed} from "vue";
import {rows} from "../sync/rows.js";

const props = defineProps({board: Object, planOf: {type: Function, default: () => ""}});
const emit = defineEmits(["open", "plan"]);
const tickets = computed(() => rows("ticket").filter((r) => !r.deleted && r.data?.board === props.board.n));
const lanes = computed(() =>
    (props.board.data?.stages || []).map((stage) => ({stage, cards: tickets.value.filter((r) => r.data?.stage === stage)}))
);
const goal = computed(() => props.board.data?.goal || "");
const clauses = computed(() => props.board.data?.done_when || []);
</script>

<template>
    <section class="board" :aria-label="`Board ${board.title}`">
        <h3 class="board-title">{{ board.title }}</h3>
        <template v-if="goal">
            <p class="goal">{{ goal }}</p>
        </template>
        <template v-if="clauses.length">
            <ul class="clauses" aria-label="Done when">
                <template v-for="clause in clauses" :key="clause">
                    <li>{{ clause }}</li>
                </template>
            </ul>
        </template>
        <div class="lanes">
            <template v-for="lane in lanes" :key="lane.stage">
                <div class="lane">
                    <div class="lane-head">
                        <span>{{ lane.stage }}</span>
                        <span class="count">{{ lane.cards.length }}</span>
                    </div>
                    <div class="lane-cards">
                        <template v-for="r in lane.cards" :key="r.n">
                            <div class="card">
                                <button type="button" class="card-title" @click="emit('open', r)">{{ r.title }}</button>
                                <template v-if="r.data?.status?.state">
                                    <span class="card-line">{{ r.data.status.state }}</span>
                                </template>
                                <template v-if="planOf(r)">
                                    <button type="button" class="card-plan" :title="`Open the plan of ticket ${r.n}, ${r.title}`" @click="emit('plan', r)">Open plan of ticket {{ r.n }}</button>
                                </template>
                            </div>
                        </template>
                    </div>
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

.goal {
    margin: 0 0 6px;
    font-size: 13px;
}

.clauses {
    margin: 0 0 10px;
    padding-left: 18px;
    font-size: 12px;
    opacity: 0.8;
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

.lane-cards {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: min(60vh, 560px);
    overflow-y: auto;
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
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    border: 1px solid var(--line, #e5e5e5);
    border-radius: 6px;
    background: var(--surface, transparent);
    font-size: 13px;
}

.card-title,
.card-plan {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.card-line {
    font-size: 12px;
    opacity: 0.7;
}

.card-plan {
    font-size: 12px;
    text-decoration: underline;
}
</style>
