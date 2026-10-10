<script setup>
import {computed, provide, ref} from "vue";
import {api} from "../api/client.js";
import Lane from "./Lane.vue";
import NotePrompt from "./NotePrompt.vue";
import Segmented from "../kit/Segmented.vue";
import {store} from "../state/store.js";

const props = defineProps({
    lanes: {type: Array, required: true},
    meaningOf: {type: Function, required: true},
    move: {type: Function, required: true},
    moving: {type: Number, default: 0},
    refresh: {type: Function, required: true},
    newWork: {type: Function, required: true},
    openAgent: {type: Function, default: () => {}},
    watchAgent: {type: Function, default: () => {}},
    adds: Boolean,
});
const laneCount = (lane) => lane.total || lane.cards.length;
const picked = ref("");
const noting = ref(null);
const loading = computed(() => !store.board.loaded);
const pickedLane = computed(
    () =>
        (props.lanes.find((lane) => lane.key === picked.value) || props.lanes.find((lane) => lane.cards.length) || props.lanes[0] || {}).key
);
const lanePicks = computed(() => props.lanes.map((lane) => ({key: lane.key, label: `${lane.title} ${laneCount(lane)}`})));

async function sendNote(note) {
    const {card, action} = noting.value;
    noting.value = null;
    await api.act(card.type, card.n, action.action, {note});
    props.refresh();
}

provide("board", {
    move: (card, lane) => props.move(card, lane),
    moving: computed(() => props.moving),
    refresh: () => props.refresh(),
    meaningOf: (key) => props.meaningOf(key),
    newWork: (stage) => props.newWork(stage),
    openAgent: (card) => props.openAgent(card),
    watchAgent: (card) => props.watchAgent(card),
    askNote: (ask) => (noting.value = ask),
});
</script>

<template>
    <div class="lane-pick">
        <Segmented fill :options="lanePicks" :value="pickedLane" @pick="(key) => (picked = key)" />
    </div>
    <div class="lanes">
        <template v-for="(lane, i) in lanes" :key="lane.key">
            <Lane
                :class="{away: lane.key !== pickedLane}"
                :lane="lane"
                :loading="loading"
                :meaning="meaningOf(lane.key)"
                :adds="adds && !i"
                :style="{'--order': i}"
            />
        </template>
    </div>
    <template v-if="noting">
        <NotePrompt :ask="noting" @send="sendNote" @close="noting = null" />
    </template>
</template>

<style scoped>
.lane-pick {
    display: none;
}

.lanes {
    display: flex;
    flex: 1;
    gap: 12px;
    min-height: 0;
    padding: 14px 20px 20px;
    overflow-x: auto;
}

@media (max-width: 640px) {
    .lane-pick {
        display: block;
        flex: none;
        margin: 12px 14px 0;
    }

    .lanes {
        padding: 12px 14px 16px;
    }

    .lanes > .away {
        display: none;
    }

    .lanes > :deep(.lane) {
        max-width: none;
    }
}
</style>
