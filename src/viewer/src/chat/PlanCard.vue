<script setup>
import {cardChoices, isWholePlan, PLAN_STATES, reviewersLine, sizeOf, statusOf, stoppedOf} from "../domain/plans.js";
import {planCardChoice} from "../state/planCardChoice.js";
import {computed, ref, watchEffect} from "vue";
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import ChatDock from "../kit/ChatDock.vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import SplitButton from "../kit/SplitButton.vue";
import {store} from "../state/store.js";
import PlanList from "../layout/PlanList.vue";
import PlanCritique from "../resource/PlanCritique.vue";
import {approvePlan, dismissPlan, startPlan} from "../actions/plans.js";
import {flyToBar} from "../composables/planFlight.js";
import {usePlanRows} from "../composables/planRows.js";
import {peek} from "../route.js";
import {rows} from "../sync/rows.js";

const PREVIEW_PHASES = 5;
const props = defineProps({plan: Object, folded: Boolean});
const dock = ref(null);
const lifted = ref(false);
const error = ref("");
const status = computed(() => statusOf(props.plan));
const critiquing = ref(false);
const paused = computed(() => status.value === "paused");
const reviewing = computed(() => status.value === "reviewing");
const reviewers = computed(() => (reviewing.value ? reviewersLine(props.plan.reviewers || 0) : ""));
const building = computed(() => status.value === "draft");
const choices = computed(() => cardChoices(rows("plans"), props.plan));
const picking = ref(false);
const nameButton = ref(null);
const choose = (picked) => (planCardChoice.value = picked.id);
const named = () => (choices.value.length ? (picking.value = !picking.value) : peek("plans", props.plan.id));
// the phases of the plan last held whole stay while a list refresh brings the plan as a summary alone, until it is read whole again, so no row is drawn away and back
const phases = ref([]);
watchEffect(() => {
    if (isWholePlan(props.plan)) phases.value = (props.plan.phases || []).map((ph, i) => ({n: i + 1, title: ph.title, rows: ph.task_ids.length}));
});
const hidden = computed(() => Math.max(0, phases.value.length - PREVIEW_PHASES));
const adding = "The agent is still writing the plan…";
usePlanRows(() => [props.plan]);

// a comment typed in the composer and sent approves the plan, the comment handed to the agent with the approval
const approveWithComment = () => (store.quoting = {text: props.plan.title, ref: "", on: `plans:${props.plan.id}`, label: "Approving with a comment", approves: props.plan.id});

function dismiss() {
    planCardChoice.value = 0;
    dismissPlan(props.plan);
}

async function start() {
    error.value = "";
    lifted.value = true;
    try {
        await flyToBar(dock.value.card, () => (paused.value ? startPlan : approvePlan)(props.plan));
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
            <span class="plan-card-more">
                <button
                    ref="nameButton"
                    type="button"
                    :class="['plan-card-title', {on: picking}]"
                    :title="choices.length ? 'Show another plan here' : 'Open plan'"
                    :aria-expanded="choices.length ? picking : undefined"
                    @click.stop="named"
                >
                    {{ plan.title }}
                    <template v-if="choices.length">
                        <Icon name="down" :size="12" />
                    </template>
                </button>
                <template v-if="picking">
                    <PlanList picks heading="Plans waiting for approval" :anchor="nameButton" :plans="choices" @pick="choose" @close="picking = false" />
                </template>
            </span>
            <Chip class="plan-card-chip" :tone="status === 'ready' ? 'accent' : ''">{{ PLAN_STATES[status] }}</Chip>
            <template v-if="reviewers">
                <span class="plan-card-reviewers">{{ reviewers }}</span>
            </template>
            <span class="plan-card-size" data-fades>
                {{ paused ? stoppedOf(plan, rows("tasks")) : sizeOf(plan) }}
            </span>
            <span class="plan-card-acts chat-dock-acts" data-fades>
                <Btn small @click="peek('plans', plan.id)">Open plan</Btn>
                <template v-if="plan.state === 'ready' && !reviewing">
                    <Btn small v-tip="'Reviewers read it before you approve'" @click="critiquing = true">Ask for a critique</Btn>
                </template>
                <template v-if="!reviewing && !paused">
                    <SplitButton
                        kind="primary"
                        small
                        class="plan-card-start"
                        :disabled="building"
                        menu-label="Other ways to approve"
                        v-tip="building ? 'You can approve it once the plan is ready' : 'Approve the plan; the agent starts it'"
                        @main="start"
                    >
                        <Icon name="start" />
                        Approve
                        <template #menu="{close}">
                            <MenuItem @click="close(), start()">Approve</MenuItem>
                            <MenuItem description="Type a comment; sending it approves the plan" @click="close(), approveWithComment()">Approve with a comment</MenuItem>
                        </template>
                    </SplitButton>
                </template>
                <template v-if="paused">
                    <Btn kind="primary" small class="plan-card-start" v-tip="'Resume the plan; the agent starts its next task'" @click="start">
                        <Icon name="start" />
                        Resume
                    </Btn>
                </template>
            </span>
            <CloseButton title="Close: the plan leaves the chat and stays in the plans list, to approve from its page" @click="dismiss" />
        </template>
        <template v-if="!paused && (phases.length || building)">
            <ol class="plan-card-phases" data-fades>
                <template v-for="ph in phases.slice(0, PREVIEW_PHASES)" :key="ph.n">
                    <li class="plan-card-phase">
                        <span class="plan-card-n">{{ ph.n }}</span>
                        <span class="plan-card-name">{{ ph.title }}</span>
                        <span class="plan-card-rows">
                            {{ ph.rows ? `${ph.rows} task${ph.rows === 1 ? "" : "s"}` : "" }}
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
    <template v-if="critiquing">
        <PlanCritique :plan="plan" @close="critiquing = false" />
    </template>
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

.plan-card-reviewers {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
    white-space: nowrap;
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

/* the plan's title keeps room for a few words however many buttons stand beside it */
.plan-card-more {
    position: relative;
    display: flex;
    flex: 0 1 auto;
    min-width: min(8em, 30%);
}

.plan-card-title .ico {
    margin-left: 4px;
    vertical-align: -1px;
    color: var(--text-3);
}

.plan-card-title.on {
    text-decoration: underline;
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
