<script setup>
import {computed, ref} from "vue";
import {Btn, Icon, ListTools, Skeleton, WindowRoom, useListTools, useWindow} from "@journal/window-kit";
import CheckDialog from "./CheckDialog.vue";
import CheckRunBar from "./CheckRunBar.vue";

// a click on a card opens its dialog; a run shows at once and the server's answer settles it, a refusal naming why
const window = useWindow();
const {rows, failure, loaded} = window.props.checks;
const tools = useListTools(rows, {title: (row) => row.title, isOpen: (row) => !row.stopped});
const openedId = ref(null);
const opened = computed(() => rows.value.find((row) => row.id === openedId.value) || null);
const runningIds = ref(new Set());
const refusal = ref("");

async function start(row) {
    refusal.value = "";
    const answer = await window.run(["check", "start", String(row.id)]);
    if (!answer.ok) refusal.value = answer.error;
}

async function run(row) {
    refusal.value = "";
    runningIds.value = new Set([...runningIds.value, row.id]);
    const answer = await window.run(["check", "run", String(row.id)]);
    runningIds.value = new Set([...runningIds.value].filter((id) => id !== row.id));
    if (!answer.ok) refusal.value = answer.error;
}
</script>

<template>
    <WindowRoom>
        <ListTools :tools="tools" />
        <div class="cards">
            <template v-if="!loaded">
                <Skeleton shape="cards" />
            </template>
            <template v-else-if="failure">
                <p class="cards-note">{{ failure }}</p>
            </template>
            <template v-else-if="loaded && !rows.length">
                <p class="cards-note">No checks yet</p>
            </template>
            <template v-if="refusal">
                <p class="cards-note" data-check-refusal>{{ refusal }}</p>
            </template>
            <template v-for="row in tools.shown.value" :key="row.id">
                <div role="button" tabindex="0" class="card" :data-row="row.id" @click="openedId = row.id" @keydown.enter="openedId = row.id">
                    <span class="card-head"><Icon name="check" class="card-icon" /> Check {{ row.id }}<span :class="['card-state', {failing: row.last_passed === false, passing: row.last_passed === true}]">{{ row.last_passed === true ? "Passing" : row.last_passed === false ? "Failing" : "Not run" }}</span></span>
                    <span class="card-title">{{ row.title }}</span>
                    <code class="card-detail">{{ row.command }}</code>
                    <template v-if="row.run_percent !== null && row.run_percent !== undefined">
                        <CheckRunBar :percent="row.run_percent" />
                    </template>
                    <template v-if="!row.stopped">
                        <Btn small bordered class="card-run" data-check-card-run :disabled="runningIds.has(row.id)" @click.stop="run(row)">{{ runningIds.has(row.id) ? "Running" : "Run" }}</Btn>
                    </template>
                    <template v-else>
                        <Btn small bordered class="card-run" data-check-card-start @click.stop="start(row)">Start</Btn>
                    </template>
                    <span class="card-foot">{{ row.status }} · {{ row.interval_minutes ? `Every ${row.interval_minutes} minutes` : "Only when run by hand" }}</span>
                </div>
            </template>
        </div>
        <template v-if="opened">
            <CheckDialog :row="opened" :running="runningIds.has(opened.id)" @close="openedId = null" @run="run" />
        </template>
    </WindowRoom>
</template>

<style scoped>
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
    align-content: start;
    padding: 16px 20px;
}

.card {
    display: flex;
    flex-direction: column;
    min-width: 0;
    gap: 8px;
    min-height: 110px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
    color: inherit;
    text-align: left;
    cursor: pointer;
}

.card:hover {
    border-color: var(--border-strong, var(--border));
}

.card-head {
    display: flex;
    gap: 6px;
    align-items: center;
    color: var(--text-2);
    font-size: 13px;
}

.card-icon {
    width: 14px;
    height: 14px;
}

.card-title {
    font-weight: 600;
}

.card-run {
    align-self: flex-start;
}

.card-detail {
    margin: 0;
    overflow-wrap: anywhere;
    color: var(--text-2);
    font-size: 12px;
    white-space: pre-wrap;
}

.card-foot {
    margin-top: auto;
    color: var(--text-3);
    font-size: 12px;
}

.cards-note {
    margin: 0;
    color: var(--text-2);
}
.card-state {
    margin-left: auto;
    color: var(--text-3);
}

.card-state.passing {
    color: var(--accent-text);
}

.card-state.failing {
    color: var(--danger);
}
</style>
