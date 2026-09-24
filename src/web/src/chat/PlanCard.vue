<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import Icon from "../kit/Icon.vue";
import PlanList from "../layout/PlanList.vue";
import {approvePlan, startPlan} from "../actions/plans.js";
import {flyToBar} from "../composables/planFlight.js";
import {usePlanRows} from "../composables/planRows.js";
import {peek} from "../route.js";
import {rows} from "../sync/rows.js";
import {otherPlans, othersLine, PLAN_STATES, sizeOf, stoppedOf} from "../layout/statusline.js";

const SHOWN_PHASES = 5;
const props = defineProps({plan: Object, folded: Boolean});
const card = ref(null);
const listing = ref(false);
const lifted = ref(false);
const error = ref("");
const status = computed(() => props.plan.data.status);
const parked = computed(() => status.value === "parked");
const building = computed(() => status.value === "building" || status.value === "draft");
const others = computed(() => otherPlans(rows("plan")));
const phases = computed(() => props.plan.data.phases.map((ph, i) => ({n: i + 1, title: ph.title, rows: ph.todos.length})));
const hidden = computed(() => Math.max(0, phases.value.length - SHOWN_PHASES));
const adding = computed(() => (props.plan.data.stage === "todos" ? "Adding to-dos…" : "Adding phases…"));
usePlanRows(() => [props.plan]);

async function start() {
    error.value = "";
    lifted.value = true;
    try {
        await flyToBar(card.value, () => (parked.value ? startPlan : approvePlan)(props.plan));
    } catch (e) {
        lifted.value = false;
        error.value = e.message;
    }
}
</script>

<template>
    <div :class="['plan-dock', {lifted}]">
        <div class="plan-fold">
            <section ref="card" :class="['plan-card', status]" aria-label="Plan">
                <header class="plan-card-head">
                    <Icon name="plan" class="plan-card-icon" />
                    <button type="button" class="plan-card-title" title="Open plan" @click="peek('plan', plan.n)">
                        {{ plan.title }}
                    </button>
                    <Chip class="plan-card-chip" :tone="status === 'ready' ? 'accent' : ''">{{ PLAN_STATES[status] }}</Chip>
                    <span class="plan-card-size" data-fades>
                        {{ parked ? stoppedOf(plan, rows("todo")) : sizeOf(plan) }}
                    </span>
                    <span class="plan-card-acts" data-fades>
                        <template v-if="othersLine(others)">
                            <span class="plan-card-more">
                                <button type="button" :class="['plan-card-others', {on: listing}]" @click.stop="listing = !listing">
                                    {{ othersLine(others) }}
                                </button>
                                <template v-if="listing">
                                    <PlanList up :plans="others" @close="listing = false" />
                                </template>
                            </span>
                        </template>
                        <Btn small @click="peek('plan', plan.n)">Open plan</Btn>
                        <Btn
                            kind="primary"
                            small
                            class="plan-card-start"
                            :disabled="building"
                            :title="building ? 'Start waits until the plan is ready' : 'Approve the plan and start it'"
                            @click="start"
                        >
                            <Icon name="start" />
                            {{ parked ? "Resume" : "Start" }}
                        </Btn>
                    </span>
                </header>
                <div :class="['plan-card-body', {folded}]">
                    <div class="plan-card-inner">
                        <template v-if="!parked && (phases.length || building)">
                            <ol class="plan-card-phases" data-fades>
                                <template v-for="ph in phases.slice(0, SHOWN_PHASES)" :key="ph.n">
                                    <li class="plan-card-phase">
                                        <span class="plan-card-n">{{ ph.n }}</span>
                                        <span class="plan-card-name">{{ ph.title }}</span>
                                        <span class="plan-card-rows">
                                            {{ ph.rows ? `${ph.rows} to-do${ph.rows === 1 ? "" : "s"}` : "" }}
                                        </span>
                                    </li>
                                </template>
                                <template v-if="hidden">
                                    <li class="plan-card-phase quiet">
                                        <span />
                                        <span class="plan-card-name">and {{ hidden }} more phase{{ hidden === 1 ? "" : "s" }}</span>
                                        <span />
                                    </li>
                                </template>
                                <template v-if="building">
                                    <li class="plan-card-phase quiet">
                                        <span />
                                        <span class="plan-card-name">{{ adding }}</span>
                                        <span />
                                    </li>
                                </template>
                            </ol>
                        </template>
                        <template v-if="error">
                            <p class="plan-card-error">{{ error }}</p>
                        </template>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
.plan-dock {
    position: sticky;
    bottom: 0;
    z-index: 2;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: minmax(0, 1fr);
    flex: none;
    width: 100%;
    margin-top: auto;
}

.plan-card-body {
    display: grid;
    grid-template-rows: 1fr;
    transition:
        grid-template-rows var(--move),
        opacity var(--fade);
}

.plan-card-body.folded {
    grid-template-rows: 0fr;
    opacity: 0;
}

.plan-card-inner {
    min-height: 0;
    overflow: hidden;
}

.plan-fold {
    min-width: 0;
    min-height: 0;
}

.plan-dock.plancard-enter-active,
.plan-dock.plancard-leave-active {
    transition:
        grid-template-rows 0.32s var(--ease),
        opacity 0.24s ease;
}

.plan-dock.plancard-enter-active .plan-fold,
.plan-dock.plancard-leave-active .plan-fold {
    overflow: hidden;
}

.plan-dock.plancard-enter-from,
.plan-dock.plancard-leave-to {
    grid-template-rows: 0fr;
    opacity: 0;
}

.plan-dock.lifted .plan-card {
    visibility: hidden;
}

.plan-card {
    container-type: inline-size;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
}

.plan-card-head {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    height: 36px;
    padding: 0 6px 0 15px;
    white-space: nowrap;
}

.plan-card-icon {
    flex: none;
    color: var(--text-3);
}

.plan-card-title {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-weight: 500;
    text-overflow: ellipsis;
    cursor: pointer;
}

.plan-card-title:hover {
    text-decoration: underline;
    text-decoration-color: var(--text-4);
    text-underline-offset: 3px;
}

.plan-card-chip {
    flex: none;
    align-self: center;
}

.plan-card-size {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    color: var(--text-4);
    font-size: 12px;
    text-overflow: ellipsis;
}

.plan-card-acts {
    flex: none;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;
}

.plan-card-more {
    position: relative;
}

.plan-card-others {
    height: 24px;
    padding: 0 7px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s;
}

.plan-card-others:hover,
.plan-card-others.on {
    background: var(--hover);
    color: var(--text);
}

.plan-card-start:disabled {
    opacity: 0.4;
    cursor: default;
}

.plan-card-phases {
    margin: 0;
    padding: 0 12px 9px 16px;
    list-style: none;
}

.plan-card-phase {
    display: grid;
    grid-template-columns: 18px minmax(0, 1fr) auto;
    align-items: center;
    column-gap: 8px;
    height: 24px;
    font-size: 12.5px;
    animation: plan-row 0.32s var(--ease) both;
}

.plan-card-n {
    color: var(--text-4);
    font-family: var(--mono);
    font-size: 11px;
}

.plan-card-name {
    overflow: hidden;
    color: var(--text-2);
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color 0.3s;
}

.plan-card-phase.quiet .plan-card-name {
    color: var(--text-4);
}

.plan-card-rows {
    color: var(--text-4);
    font-size: 11.5px;
}

.plan-card-error {
    margin: 0;
    padding: 0 12px 10px 42px;
    color: var(--danger);
    font-size: 12px;
}

@container (max-width: 560px) {
    .plan-card-size {
        display: none;
    }
}

@keyframes plan-row {
    from {
        opacity: 0;
        transform: translateY(6px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .plan-dock.plancard-enter-active,
    .plan-dock.plancard-leave-active,
    .plan-card-phase {
        transition: none;
        animation: none;
    }
}
</style>
