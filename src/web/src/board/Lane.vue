<script setup>
import {computed, inject, ref} from "vue";
import {api} from "../api/client.js";
import {useCardDrag} from "../composables/cardDrag.js";
import Btn from "../kit/Btn.vue";
import PlaceholderCard from "../kit/PlaceholderCard.vue";
import StageDot from "../kit/StageDot.vue";
import {store} from "../state/store.js";
import Card from "./Card.vue";
import {moveEffect, refused} from "./moves.js";
import Skeleton from "../kit/Skeleton.vue";
import {moreOfLane} from "./lanePages.js";

const props = defineProps({lane: Object, loading: Boolean, meaning: {type: String, default: ""}, adds: Boolean});
const MEANING_LABELS = {start: "A card dropped here starts its agent", review: "A card here waits for review"};
const board = inject("board");
const drag = useCardDrag();
const over = ref(false);
const dragged = computed(() => drag.dragged.value);
const takes = computed(() => drag.takes(props.lane.key) && !refused(dragged.value, props.meaning));
const meaningLabel = computed(
    () => (dragged.value && dragged.value.lane !== props.lane.key && moveEffect(dragged.value, props.meaning, store.board.slots)) || ""
);
const refuses = computed(() => !!dragged.value && dragged.value.lane !== props.lane.key && !takes.value);
const proposing = computed(() => props.lane.cards.filter((card) => (card.actions || []).some((a) => a.action === "accept_dependencies")));
const accepting = ref(false);

async function acceptAll() {
    accepting.value = true;
    for (const card of proposing.value) await api.acceptDependencies(card.n);
    accepting.value = false;
    board.refresh();
}

const NEAR_END = 240;

function scrolled(event) {
    const cards = event.target;
    if (props.lane.next && cards.scrollHeight - cards.scrollTop - cards.clientHeight < NEAR_END) moreOfLane(props.lane);
}

function drop() {
    over.value = false;
    const card = drag.dragged.value;
    const accepted = takes.value;
    drag.end();
    if (card && accepted) board.move(card, props.lane.key);
}
</script>

<template>
    <section
        :class="['lane', {over: over && takes, refuses}]"
        @dragover="takes && ($event.preventDefault(), (over = true))"
        @dragleave="over = false"
        @drop.prevent="drop"
    >
        <header class="head" :title="MEANING_LABELS[meaning]">
            <StageDot :meaning="meaning" />
            <span class="title">{{ lane.title }}</span>
            <span class="meaning">{{ meaningLabel }}</span>
            <template v-if="proposing.length > 1">
                <Btn small :busy="accepting" v-tip="'Accept every dependency the agent suggested in this column'" @click="acceptAll">
                    Accept all suggestions in this column
                </Btn>
            </template>
            <span class="count">{{ loading ? "" : lane.total || lane.cards.length }}</span>
        </header>
        <div class="cards" @scroll.passive="scrolled">
            <template v-if="loading">
                <Skeleton shape="cards" :count="3" label="Loading the board" />
            </template>
            <template v-else>
                <template v-for="card in lane.cards" :key="card.n">
                    <Card :card="card" />
                </template>
                <template v-if="lane.next">
                    <Btn small class="more" @click="moreOfLane(lane)">Show more ({{ lane.total - lane.cards.length }} left)</Btn>
                </template>
                <template v-if="adds">
                    <PlaceholderCard :title="`New work in ${lane.title}`" @click="board.newWork(lane.key)">+ New work</PlaceholderCard>
                </template>
                <template v-else-if="!lane.cards.length">
                    <p class="none">No cards</p>
                </template>
            </template>
        </div>
    </section>
</template>

<style scoped>
.lane {
    display: flex;
    flex: 1 0 264px;
    max-width: 340px;
    animation: lane-in 0.45s cubic-bezier(0.2, 0.9, 0.25, 1) both;
    animation-delay: calc(var(--order) * 60ms);
    flex-direction: column;
    min-height: 0;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--side);
}

@keyframes lane-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
}

.lane.over {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 8%, var(--side));
}

.lane.refuses {
    opacity: 0.45;
}

.head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-bottom: 1px solid var(--line);
}

.title {
    font-size: 12.5px;
    font-weight: 600;
}

.meaning {
    color: var(--text-4);
    font-size: 12px;
}

.count {
    margin-left: auto;
    color: var(--text-3);
    font-size: 12px;
}

.cards {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow-y: auto;
    padding: 10px;
}

.none {
    margin: 6px 2px;
    color: var(--text-3);
    font-size: 12px;
}
</style>
