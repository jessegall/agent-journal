<script setup>
import {EmptyState, useRows} from "@journal/window-kit";
import ReviewSteps from "./ReviewSteps.vue";

const EVENTS = ["review.*", "reviewer.*"];
const {rows: reviewing} = useRows("review list --state reviewing --oldest", EVENTS);
const {rows: queued} = useRows("review list --state queued --oldest", EVENTS);
</script>

<template>
    <div class="reviewer">
        <template v-if="!reviewing.length">
            <EmptyState title="No review yet">The reviewer shows here what it does with each worker's work: the review it starts, the tests it runs, each point passed or short, and the report it hands the agent.</EmptyState>
        </template>
        <template v-for="review in reviewing" :key="review.id">
            <ReviewSteps :review="review" />
        </template>
        <template v-if="queued.length">
            <p class="queue">{{ queued.length }} {{ queued.length === 1 ? "review" : "reviews" }} waiting</p>
        </template>
    </div>
</template>

<style scoped>
.reviewer {
    height: 100%;
    overflow-y: auto;
}

.queue {
    margin: 0;
    padding: 8px 14px;
    color: var(--text-3);
    font-size: 12px;
}
</style>
