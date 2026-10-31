<script setup>
import {useRows} from "@journal/window-kit";
import {ago} from "./ago.js";

const props = defineProps({review: {type: Object, required: true}});
const {rows: steps} = useRows(`review-step list --review ${props.review.id} --oldest`, ["review_step.*"]);
</script>

<template>
    <section class="review">
        <h3 class="review-title">{{ review.subject_model ? `${review.subject_model} ${review.subject_id}` : `Review ${review.id}` }}</h3>
        <ol class="steps">
            <template v-for="step in steps" :key="step.id">
                <li class="step">
                    <span class="dot" :data-outcome="step.outcome"></span>
                    <span class="text">{{ step.text }}</span>
                    <time>{{ ago(step.created_at) }}</time>
                </li>
            </template>
        </ol>
    </section>
</template>

<style scoped>
.review {
    padding: 12px 14px;
}

.review-title {
    margin: 0 0 8px;
    color: var(--text);
    font-size: 12px;
    font-weight: 600;
}

.steps {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.step {
    display: flex;
    align-items: baseline;
    gap: 8px;
    color: var(--text-2);
    font-size: 12px;
    line-height: 1.5;
}

.dot {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-3);
}

.dot[data-outcome="passed"] {
    background: var(--green, #3aa676);
}

.dot[data-outcome="failed"] {
    background: var(--red, #d4574b);
}

.text {
    flex: 1;
    white-space: pre-wrap;
}

time {
    flex: none;
    color: var(--text-3);
    font-size: 11px;
}
</style>
