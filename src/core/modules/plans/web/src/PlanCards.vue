<script setup>
import {computed, ref} from "vue";
import {Btn, Icon, InnerTabs, Skeleton, TabBody, WindowRoom, afterSkeletonMinimum, peekRef, stateLabel, stateLook, useWindow} from "@journal/window-kit";
import PlanAgents from "./PlanAgents.vue";

// plans as version 4 drew them: a card for each, the task count with a bar, the phase it is in, and tabs for the open and the closed; one read brings a tab's cards and both counts
const context = useWindow();
const PAGE_ROWS = 25;
const tab = ref(context.tabs?.[0]);
const board = ref({open_total: 0, closed_total: 0, plans: []});
const failure = ref("");
const loaded = ref(false);
const startedAt = performance.now();
const tabLine = () => tab.value.read;

async function load() {
    const asked = tab.value;
    const held = board.value.plans.length;
    const answer = await context.read(context.shared ? `${context.shared.model} show ${context.shared.id}` : `${tabLine()}${held > PAGE_ROWS ? ` --limit ${held}` : ""}`);
    if (asked !== tab.value) return;
    failure.value = answer.ok ? "" : answer.error;
    afterSkeletonMinimum(startedAt, () => (loaded.value = true));
    if (answer.ok) board.value = context.shared ? {open_total: 1, closed_total: 0, plans: [{task_count: 0, completed_count: 0, current_phase: 0, agents: [], ...answer.value}]} : answer.value;
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

const choose = (chosen) => {
    tab.value = chosen;
    board.value = {...board.value, plans: []};
    load();
};
const shown = computed(() => board.value.plans);
const total = computed(() => board.value[tab.value?.count_field]);
const share = (row, count) => (row.task_count ? Math.round((count / row.task_count) * 100) : 0);
context.follow(["plan.*", "phase.*", "task.*"], load);
load();
</script>

<template>
    <WindowRoom padding="0">
        <div class="plans">
            <template v-if="!loaded">
                <Skeleton shape="cards" />
            </template>
            <template v-else-if="failure">
                <p class="plans-note">{{ failure }}</p>
            </template>
            <template v-else>
                <InnerTabs :active="tab" :answer="board" @choose="choose" />
                <TabBody :tab="tab" shape="cards">
                <template v-if="!shown.length">
                    <p class="plans-note">No {{ tab?.label.toLowerCase() }} plans</p>
                </template>
                <div class="plans-grid">
                    <template v-for="row in shown" :key="row.id">
                        <div class="plan" :data-row="row.id" role="button" tabindex="0" @click="peekRef(`plans:${row.id}`)" @keydown.enter="peekRef(`plans:${row.id}`)">
                            <span class="plan-head"><Icon name="plan" :size="12" /> Plan {{ row.id }}<span :class="['plan-state', stateLook('plan', row.state)]" data-plan-state>{{ stateLabel('plan', row.state) }}</span></span>
                            <span class="plan-title" :title="row.title">{{ row.title }}</span>
                            <span class="plan-bar"><span class="plan-bar-fill" :style="{width: `${share(row, row.completed_count)}%`}" /><span class="plan-bar-testing" data-plan-testing :style="{width: `${share(row, row.testing_count)}%`}" /></span>
                            <span class="plan-foot">{{ row.completed_count }} of {{ row.task_count }} tasks done<template v-if="row.current_phase"> · phase {{ row.current_phase }}</template></span>
                            <PlanAgents :plan-id="row.id" :agents="row.agents" />
                        </div>
                    </template>
                </div>
                <template v-if="shown.length && shown.length < total">
                    <Btn variant="text" data-plans-more @click="more">Show more</Btn>
                </template>
                </TabBody>
            </template>
        </div>
    </WindowRoom>
</template>

<style scoped>
.plans {
    display: flex;
    flex-direction: column;
}

.plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    margin-right: -1px;
}

.plan {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    padding: 12px 14px 0;
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: var(--bg);
}

.plan:hover {
    background: var(--raised);
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
    overflow: hidden;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.plan-bar {
    display: flex;
    height: 4px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--chip);
}

.plan-bar-fill {
    display: block;
    height: 100%;
    background: var(--accent);
}

.plan-bar-testing {
    display: block;
    height: 100%;
    background: color-mix(in srgb, var(--accent) 40%, transparent);
}

.plan-foot,
.plans-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.plans-note,
[data-plans-more] {
    padding: 8px 14px;
}
</style>
