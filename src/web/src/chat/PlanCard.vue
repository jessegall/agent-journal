<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import ChatDock from "../kit/ChatDock.vue";
import CloseButton from "../kit/CloseButton.vue";
import {api} from "../api/client.js";
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
const dock = ref(null);
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
        await flyToBar(dock.value.card, () => (parked.value ? startPlan : approvePlan)(props.plan));
    } catch (e) {
        lifted.value = false;
        error.value = e.message;
    }
}
</script>

<template>
    <ChatDock ref="dock" label="Plan" :kind="status" :folded="folded" :lifted="lifted">
        <template #head>
            <Icon name="plan" class="plan-card-icon" />
            <button type="button" class="plan-card-title" title="Open plan" @click="peek('plan', plan.n)">
                {{ plan.title }}
            </button>
            <Chip class="plan-card-chip" :tone="status === 'ready' ? 'accent' : ''">{{ PLAN_STATES[status] }}</Chip>
            <span class="plan-card-size" data-fades>
                {{ parked ? stoppedOf(plan, rows("todo")) : sizeOf(plan) }}
            </span>
            <span class="plan-card-acts chat-dock-acts" data-fades>
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
            <CloseButton title="Take this plan out of the chat; it stays on the Plans page" @click="api.act('plan', plan.n, 'dismiss')" />
        </template>
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
    </ChatDock>
</template>

<style scoped>
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
    .plan-card-phase {
        animation: none;
    }
}
</style>
