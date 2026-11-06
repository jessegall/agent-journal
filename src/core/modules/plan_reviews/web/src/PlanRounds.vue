<script setup>
import {computed, watch} from "vue";
import {InspectorPart, TimeAgo, peekRef, useWindow} from "@journal/window-kit";

// how many review rounds a plan had, and for each when it ran, who read it and its reports, newest first
const window = useWindow();
const row = window.option("row");
const key = computed(() => `rounds.${row.value.id}`);
const rounds = computed(() => window.props[key.value].rows.value);
const failure = computed(() => window.props[key.value].failure.value);
const newest = computed(() => [...rounds.value].reverse());
const reviewerCount = (round) => (round.reviewers.length === 1 ? "1 reviewer" : `${round.reviewers.length} reviewers`);
const reviewerNames = (round) => round.reviewers.map((reviewer) => reviewer.name).join(", ");
const openReport = (report) => peekRef(`reports:${report.id}`);
watch(key, (name) => window.reload(name), {immediate: true});
window.follow(["plan.*"], () => window.reload(key.value));
</script>

<template>
    <template v-if="failure">
        <InspectorPart title="Review rounds"><p class="failure" role="alert">{{ failure }}</p></InspectorPart>
    </template>
    <template v-else-if="rounds.length">
        <InspectorPart :title="`Review rounds: ${rounds.length}`">
            <ol class="rounds" data-plan-rounds>
                <template v-for="round in newest" :key="round.number">
                    <li class="round" data-plan-round>
                        <span class="number">Round {{ round.number }}</span>
                        <TimeAgo class="when" :at="round.started_at" />
                        <template v-if="!round.ended_at">
                            <span class="running">Running</span>
                        </template>
                        <template v-if="round.reviewers.length">
                            <span class="reviewers" :title="reviewerNames(round)" data-plan-round-reviewers>{{ reviewerCount(round) }}</span>
                        </template>
                        <template v-for="report in round.reports" :key="report.id">
                            <button type="button" class="report" :title="`Filed by ${report.filed_by}`" @click="openReport(report)">Report {{ report.id }}</button>
                        </template>
                    </li>
                </template>
            </ol>
        </InspectorPart>
    </template>
</template>

<style scoped>
.rounds {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.round {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    align-items: baseline;
}

.when,
.reviewers {
    color: var(--text-3);
    font-size: 12px;
}

.running {
    color: var(--progress);
    font-size: 12px;
}

.report {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
}

.failure {
    margin: 0;
    color: var(--tone-warn);
}
</style>
