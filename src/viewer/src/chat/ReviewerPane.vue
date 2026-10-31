<script setup>
import {useReviewSteps} from "../composables/reviewer.js";
import EmptyState from "../kit/EmptyState.vue";
import Dot from "../kit/Dot.vue";
import {ago} from "../format/time.js";
import {seconds} from "../domain/row.js";

const {steps, loaded} = useReviewSteps();
const DOTS = {good: "done", bad: "blocked"};
</script>

<template>
    <div class="reviewer-pane">
        <template v-if="loaded && !steps.length">
            <EmptyState title="No review yet">The reviewer shows here what it does with each worker's work: the review it starts, the tests it runs, each point passed or short, and the report it hands the agent.</EmptyState>
        </template>
        <template v-else>
            <ol class="reviewer-steps">
                <template v-for="step in steps" :key="step.id">
                    <li :class="['reviewer-step', step.data.tone]">
                        <Dot :kind="DOTS[step.data.tone] || 'planned'" :size="8" />
                        <span class="reviewer-step-text">{{ step.text }}</span>
                        <time class="reviewer-step-time">{{ ago(seconds(step.created_at)) }}</time>
                    </li>
                </template>
            </ol>
        </template>
    </div>
</template>

<style scoped>
.reviewer-pane {
    height: 100%;
    overflow-y: auto;
    padding: 12px 14px;
}

.reviewer-steps {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.reviewer-step {
    display: flex;
    align-items: baseline;
    gap: 8px;
    color: var(--text-2);
    font-size: 12px;
    line-height: 1.5;
}

.reviewer-step.good {
    color: var(--text);
}

.reviewer-step-text {
    flex: 1;
    white-space: pre-wrap;
}

.reviewer-step-time {
    flex: none;
    color: var(--text-3);
    font-size: 11px;
}
</style>
