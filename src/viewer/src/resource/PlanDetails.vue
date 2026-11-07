<script setup>
import Folded from "../kit/Folded.vue";
import ProgressBar from "../kit/ProgressBar.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {delegationWord} from "../domain/plans.js";
import {StateBadge, stateLook} from "@journal/window-kit";

defineProps({plan: {type: Object, required: true}, read: {type: Function, default: null}});
</script>

<template>
    <div class="plan-details" data-plan-details>
        <div class="state-line">
            <StateBadge type="plan" :state="plan.state" :row-id="plan.id" :read="read" :class="['status', stateLook('plan', plan.state)]" data-plan-status />
            <template v-if="plan.current_phase">
                <span class="phase-count">Phase {{ plan.current_phase }} of {{ plan.phases.length }}</span>
            </template>
        </div>
        <template v-if="plan.reason">
            <section class="reason" data-plan-reason>
                <h4>{{ plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on" }}</h4>
                <p class="text">{{ plan.reason }}</p>
            </section>
        </template>
        <template v-if="plan.total">
            <section class="part" data-plan-progress>
                <h4>Progress</h4>
                <div class="overall">
                    <ProgressBar :value="plan.finished" :max="plan.total" />
                    <span class="overall-figure">{{ plan.finished }} of {{ plan.total }} done</span>
                </div>
            </section>
        </template>
        <template v-if="plan.delegated">
            <p class="delegation" data-plan-delegated>{{ delegationWord(plan) }}</p>
        </template>
        <template v-if="plan.brief">
            <section class="part">
                <h4>The brief</h4>
                <Folded :name="`plans:${plan.id}:brief`" :at="220" :keep="160">
                    <TextDisplay class="text" data-resource-text :text="plan.brief" />
                </Folded>
            </section>
        </template>
    </div>
</template>

<style scoped>
.plan-details {
    flex: 1;
    overflow: auto;
    padding: 18px 20px 28px;
    scrollbar-width: thin;
}
.state-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    font-size: 12.5px;
}
.phase-count,
.overall-figure {
    color: var(--text-3);
    font-size: 12px;
}
.status.started {
    color: var(--progress);
}
.status.blocked {
    color: var(--blocking);
}
.status.approved {
    color: var(--created);
}
.reason {
    margin-bottom: 18px;
    padding-left: 12px;
    border-left: 2px solid var(--tone-warn);
}
.part {
    margin-bottom: 18px;
}
h4 {
    margin: 0 0 6px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 500;
}
.text {
    margin: 0;
    color: var(--text-2);
    overflow-wrap: anywhere;
    text-wrap: pretty;
}
.plan-details :deep(.button-slot) {
    display: flex;
    margin-bottom: 18px;
}
.plan-details :deep(.button-slot:empty) {
    display: none;
    margin: 0;
}
.overall {
    display: flex;
    align-items: center;
    gap: 10px;
}
.overall :deep(.track) {
    flex: 1;
}
.overall-figure {
    flex: none;
}
.delegation {
    margin: 0 0 18px;
    color: var(--text-2);
    font-size: 12.5px;
}
</style>
