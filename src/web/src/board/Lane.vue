<script setup>
import {computed, inject, ref} from "vue";
import {useCardDrag} from "../composables/cardDrag.js";
import StageDot from "../kit/StageDot.vue";
import Card from "./Card.vue";

const props = defineProps({lane: Object, loading: Boolean, meaning: {type: String, default: ""}});
const SAYS = {start: "work starts", review: "waits for review"};
const board = inject("board");
const drag = useCardDrag();
const over = ref(false);
const takes = computed(() => drag.takes(props.lane.key));
const refuses = computed(() => !!drag.dragged.value && drag.dragged.value.lane !== props.lane.key && !takes.value);

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
        <header class="head">
            <StageDot :meaning="meaning" />
            <span class="title">{{ lane.title }}</span>
            <span class="says">{{ SAYS[meaning] }}</span>
            <span class="count">{{ loading ? "" : lane.cards.length }}</span>
        </header>
        <div class="cards">
            <template v-if="loading">
                <template v-for="i in 3" :key="i">
                    <div class="skeleton">
                        <span class="blank short" />
                        <span class="blank" />
                    </div>
                </template>
            </template>
            <template v-else-if="lane.cards.length">
                <template v-for="card in lane.cards" :key="card.n">
                    <Card :card="card" />
                </template>
            </template>
            <template v-else>
                <p class="none">No cards</p>
            </template>
        </div>
    </section>
</template>

<style scoped>
.lane {
    display: flex;
    flex: 1 0 264px;
    flex-direction: column;
    min-height: 0;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--side);
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

.says {
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

.skeleton {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 9px;
    animation: skeleton-wait 1.6s ease-in-out infinite;
}

.blank {
    display: block;
    height: 10px;
    border-radius: 99px;
    background: color-mix(in srgb, var(--text-3) 22%, transparent);
}

.blank.short {
    width: 30%;
}

@keyframes skeleton-wait {
    50% {
        opacity: 0.55;
    }
}
</style>
