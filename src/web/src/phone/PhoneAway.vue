<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import Button from "./kit/Button.vue";
import {kindTitle} from "./kinds.js";

const AWAY_FOR = 1800;
const SHOWN = 4;
const HOUR = 3600;

const props = defineProps({
    items: {type: Array, required: true},
    since: {type: Number, required: true},
    waiting: {type: Number, default: 0},
});
const emit = defineEmits(["needs"]);
const closed = ref(false);
const now = Date.now() / 1000;
const away = now - props.since;
const missed = computed(() => props.items.filter((item) => item.created > props.since && item.who !== "user"));
const lines = computed(() =>
    missed.value.slice(-SHOWN).map((item) => ({key: item.type + item.n, text: `${kindTitle(item.type)} ${item.n}: ${item.title}`}))
);
const more = computed(() => missed.value.length - lines.value.length);
const length = away >= 2 * HOUR ? `${Math.round(away / HOUR)} hours` : away >= HOUR ? "an hour" : `${Math.round(away / 60)} minutes`;
const shown = computed(() => !closed.value && props.since > 0 && away >= AWAY_FOR && missed.value.length > 0);
</script>

<template>
    <template v-if="shown">
        <section class="away" aria-label="While you were away">
            <h3 class="away-title">
                <Icon name="reminders" :size="16" />
                While you were away · {{ length }}
            </h3>
            <ul class="away-lines">
                <template v-for="line in lines" :key="line.key">
                    <li>{{ line.text }}</li>
                </template>
            </ul>
            <template v-if="more > 0">
                <p class="away-more">And {{ more }} more in the chat below.</p>
            </template>
            <div class="away-buttons">
                <Button kind="plain" fill @click="closed = true">Close</Button>
                <template v-if="waiting">
                    <Button fill @click="emit('needs')">See what needs you</Button>
                </template>
            </div>
        </section>
    </template>
</template>

<style scoped>
.away {
    margin: 8px 0 12px;
    padding: 12px 14px;
    border: 1px solid var(--border-2);
    border-radius: 14px;
    background: var(--raised);
    font-size: 0.9375rem;
}

.away-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 6px;
    font-size: 1rem;
}

.away-lines {
    margin: 0 0 10px;
    padding-left: 18px;
    color: var(--text-2);
}

.away-more {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 0.8125rem;
}

.away-buttons {
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    gap: 8px;
}
</style>
