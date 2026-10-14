<script setup>
import {computed} from "vue";
import {reviewChoices} from "../domain/plans.js";
import {peek} from "../route.js";
import {rows} from "../sync/rows.js";
import ChoiceCard from "./ChoiceCard.vue";

const props = defineProps({plan: Object});
const waiting = computed(() => reviewChoices(props.plan, rows("report")));
</script>

<template>
    <template v-for="report in waiting" :key="report.n">
        <section class="plan-review-choice" :aria-label="`Choice from report ${report.n}`">
            <p class="plan-review-from">
                From
                <button type="button" class="plan-review-link" @click="peek('report', report.n)">report {{ report.n }}, {{ report.title }}</button>
            </p>
            <ChoiceCard :resource="report" />
        </section>
    </template>
</template>

<style scoped>
.plan-review-choice {
    display: grid;
    gap: 6px;
    margin: 10px 0;
}

.plan-review-from {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.plan-review-link {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    cursor: pointer;
}

.plan-review-link:hover {
    color: var(--text-1);
    text-decoration: underline;
}
</style>
