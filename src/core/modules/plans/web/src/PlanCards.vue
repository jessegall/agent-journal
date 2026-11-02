<script setup>
import {computed, ref} from "vue";
import {Btn, Icon, Skeleton, peekRef, useWindow} from "@journal/window-kit";

// plans as version 4 drew them: a card for each, the task count with a bar, the phase it is in, and tabs for the open and the closed; one read brings a tab's cards and both counts
const context = useWindow();
const PAGE_ROWS = 25;
const tab = ref("open");
const board = ref({open_total: 0, closed_total: 0, plans: []});
const failure = ref("");
const loaded = ref(false);
const tabLine = () => `plan board${tab.value === "closed" ? " --closed" : ""}`;

async function load() {
    const asked = tab.value;
    const held = board.value.plans.length;
    const answer = await context.read(context.shared ? `${context.shared.model} show ${context.shared.id}` : `${tabLine()}${held > PAGE_ROWS ? ` --limit ${held}` : ""}`);
    if (asked !== tab.value) return;
    failure.value = answer.ok ? "" : answer.error;
    loaded.value = true;
    if (answer.ok) board.value = context.shared ? {open_total: 1, closed_total: 0, plans: [{task_count: 0, completed_count: 0, current_phase: 0, ...answer.value}]} : answer.value;
}

async function more() {
    if (!board.value.plans.length) return;
    const asked = tab.value;
    const answer = await context.read(`${tabLine()} --before-id ${Math.min(...board.value.plans.map((plan) => plan.id))}`);
    if (asked !== tab.value) return;
    if (!answer.ok) return void (failure.value = answer.error);
    const shown = new Set(board.value.plans.map((plan) => plan.id));
    board.value = {...answer.value, plans: [...board.value.plans, ...answer.value.plans.filter((plan) => !shown.has(plan.id))]};
}

const choose = (name) => {
    tab.value = name;
    board.value = {...board.value, plans: []};
    load();
};
const shown = computed(() => board.value.plans);
const total = computed(() => (tab.value === "open" ? board.value.open_total : board.value.closed_total));
const share = (row) => (row.task_count ? Math.round((row.completed_count / row.task_count) * 100) : 0);
context.follow(["plan.*", "phase.*", "task.*"], load);
load();
</script>

<template>
    <div class="plans">
        <template v-if="!loaded">
            <Skeleton shape="cards" />
        </template>
        <template v-else-if="failure">
            <p class="plans-note">{{ failure }}</p>
        </template>
        <template v-else>
            <div class="plans-tabs">
                <Btn kind="text" :class="['plans-tab', {on: tab === 'open'}]" data-tab="open" @click="choose('open')">Open {{ board.open_total }}</Btn>
                <Btn kind="text" :class="['plans-tab', {on: tab === 'closed'}]" data-tab="closed" @click="choose('closed')">Closed {{ board.closed_total }}</Btn>
            </div>
            <template v-if="!shown.length">
                <p class="plans-note">{{ tab === "open" ? "No open plans" : "No closed plans" }}</p>
            </template>
            <div class="plans-grid">
                <template v-for="row in shown" :key="row.id">
                    <div class="plan" :data-row="row.id" role="button" tabindex="0" @click="peekRef(`plans:${row.id}`)" @keydown.enter="peekRef(`plans:${row.id}`)">
                        <span class="plan-head"><Icon name="plan" :size="12" /> Plan {{ row.id }}<span :class="['plan-state', row.state]" data-plan-state>{{ row.state }}</span></span>
                        <span class="plan-title">{{ row.title }}</span>
                        <span class="plan-bar"><span class="plan-bar-fill" :style="{width: `${share(row)}%`}" /></span>
                        <span class="plan-foot">{{ row.completed_count }} of {{ row.task_count }} tasks done<template v-if="row.current_phase"> · phase {{ row.current_phase }}</template></span>
                    </div>
                </template>
            </div>
            <template v-if="shown.length && shown.length < total">
                <Btn kind="text" data-plans-more @click="more">Show more</Btn>
            </template>
        </template>
    </div>
</template>

<style scoped>
.plans {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.plans-tabs {
    display: flex;
    gap: 14px;
}

.plans-tab {
    padding: 0 0 4px;
    border: 0;
    border-bottom: 1px solid transparent;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
}

.plans-tab.on {
    border-bottom-color: var(--accent);
    color: var(--text);
}

.plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
}

.plan {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
}

.plan-head {
    display: flex;
    gap: 6px;
    align-items: center;
    color: var(--text-3);
    font-size: 12px;
}

.plan-state {
    margin-left: auto;
    padding: 1px 7px;
    border: 1px solid var(--border-2);
    border-radius: 999px;
    color: var(--text-2);
    font-size: 11px;
}

.plan-state.started,
.plan-state.completed {
    border-color: var(--tone-good, var(--green));
    color: var(--tone-good, var(--green));
}

.plan-state.blocked {
    border-color: var(--tone-warn);
    color: var(--tone-warn);
}

.plan-title {
    font-weight: 500;
}

.plan-bar {
    height: 4px;
    border-radius: 2px;
    background: var(--raised);
}

.plan-bar-fill {
    display: block;
    height: 100%;
    border-radius: 2px;
    background: var(--accent);
}

.plan-foot,
.plans-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
