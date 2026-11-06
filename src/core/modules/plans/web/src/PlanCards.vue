<script setup>
import {computed, ref, watch} from "vue";
import {Btn, Icon, InnerTabs, Skeleton, TabBody, WindowRoom, afterSkeletonMinimum, peekRef, stateLabel, stateLook, useWindow} from "@journal/window-kit";
import PlanAgents from "./PlanAgents.vue";

// plans as version 4 drew them: a card for each, the task count with a bar, the phase it is in, and tabs for the open and the closed; one read brings a tab's cards and both counts
const window = useWindow();
const PAGE_ROWS = 25;
window.state.tab = window.shared ? "shared" : window.tabs[0].key;
const tab = computed(() => window.tabs.find((tab) => tab.key === window.state.tab) ?? window.tabs[0]);
const key = computed(() => window.shared ? `plan.${window.shared.id}` : window.state.tab);
const active = computed(() => window.props[key.value]);
const board = ref({open_total: 0, closed_total: 0, plans: []});
const pageFailure = ref("");
const failure = computed(() => pageFailure.value || active.value.failure.value);
const loaded = ref(false);
const startedAt = performance.now();
watch(() => active.value.loaded.value, (ready) => {
    if (ready) afterSkeletonMinimum(startedAt, () => (loaded.value = true));
}, {immediate: true});
watch(() => active.value.data.value, (value) => {
    if (!value) return;
    pageFailure.value = "";
    board.value = window.shared ? {open_total: 1, closed_total: 0, plans: [{task_count: 0, completed_count: 0, current_phase: 0, agents: [], ...value}]} : value;
}, {immediate: true});

async function more() {
    if (!board.value.plans.length) return;
    const asked = tab.value;
    const pageKey = `older-${asked.key}`;
    window.state[`${pageKey}.before-id`] = Math.min(...board.value.plans.map((plan) => plan.id));
    await window.reload(pageKey);
    if (asked !== tab.value) return;
    const page = window.props[pageKey];
    if (page.failure.value) return void (pageFailure.value = page.failure.value);
    const shown = new Set(board.value.plans.map((plan) => plan.id));
    board.value = {...page.data.value, plans: [...board.value.plans, ...page.data.value.plans.filter((plan) => !shown.has(plan.id))]};
    if (board.value.plans.length > PAGE_ROWS) window.state[`${asked.key}.limit`] = board.value.plans.length;
}

const choose = (chosen) => {
    if (chosen.key === window.state.tab) return;
    window.state.tab = chosen.key;
    board.value = {...board.value, plans: []};
    pageFailure.value = "";
};
const shown = computed(() => board.value.plans);
const total = computed(() => board.value[tab.value?.count_field]);
const share = (row, count) => (row.task_count ? Math.round((count / row.task_count) * 100) : 0);
if (window.shared) {
    window.reload(key.value);
    window.follow(["plan.*", "phase.*", "task.*"], () => window.reload(key.value));
}
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
