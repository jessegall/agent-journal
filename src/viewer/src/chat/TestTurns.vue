<script setup>
import {computed, ref} from "vue";
import {budgetLine, turnLines} from "../domain/testTurns.js";
import {useTestTurns} from "../composables/testTurns.js";
import {store} from "../state/store.js";

const props = defineProps({workers: {type: Array, default: () => []}});
const shown = ref(true);
const {turns, loaded} = useTestTurns(shown);
const lines = computed(() => turnLines(turns.value, props.workers, Date.now() / 1000));
const budget = computed(() => budgetLine(store.settings && store.settings.workers));
</script>

<template>
    <section class="test-turns">
        <header class="test-turns-head">
            <h5 class="test-turns-heading">Test turns</h5>
            <span class="test-turns-budget">{{ budget }}</span>
        </header>
        <template v-if="loaded && !lines.length">
            <p class="test-turns-none">No test turn is running or waiting.</p>
        </template>
        <ul class="test-turns-list">
            <template v-for="line in lines" :key="line.key">
                <li :class="['test-turn', line.state]">
                    <span class="test-turn-worker">{{ line.worker }}</span>
                    <span class="test-turn-ids">{{ line.ids }}</span>
                    <span class="test-turn-time">{{ line.time }}</span>
                </li>
            </template>
        </ul>
    </section>
</template>

<style scoped>
.test-turns {
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
}

.test-turns-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
}

.test-turns-heading {
    margin: 0;
    color: var(--text-2);
    font-size: 12px;
    font-weight: 600;
}

.test-turns-budget {
    color: var(--text-3);
    font-size: 11px;
}

.test-turns-none {
    margin: 6px 0 0;
    color: var(--text-3);
    font-size: 12px;
}

.test-turns-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 6px 0 0;
    padding: 0;
    list-style: none;
}

.test-turn {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) auto;
    gap: 8px;
    color: var(--text);
    font-size: 12px;
}

.test-turn.waiting {
    color: var(--text-2);
}

.test-turn-ids {
    overflow: hidden;
    color: var(--text-2);
    font-family: var(--mono);
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.test-turn-time {
    color: var(--text-3);
    font-size: 11px;
}
</style>
