<script setup>
import {computed} from "vue";
import {EmptyState, ListTools, TimeAgo, WindowRoom, useListTools, useWindow} from "@journal/window-kit";

const context = useWindow();
const {data: board} = context.props.board;
const reviews = computed(() => board.value?.reviews ?? []);
const queued = computed(() => board.value?.queued ?? 0);
const tools = useListTools(reviews, {title: (review) => review.title});

</script>

<template>
    <WindowRoom>
        <div class="reviewer">
            <template v-if="!reviews.length">
                <EmptyState title="No review yet">Reviews appear here with test results, requirement checks and the reviewer’s report.</EmptyState>
            </template>
            <ListTools :tools="tools" />
            <template v-for="review in tools.shown.value" :key="review.id">
                <section class="review">
                    <h3 class="review-title">{{ review.title }}</h3>
                    <ol class="steps">
                        <template v-for="step in review.steps" :key="step.id">
                            <li class="step">
                                <span class="dot" :data-outcome="step.outcome"></span>
                                <span class="text">{{ step.text }}</span>
                                <TimeAgo :at="step.created_at" />
                            </li>
                        </template>
                    </ol>
                </section>
            </template>
            <template v-if="queued">
                <p class="queue">{{ queued }} {{ queued === 1 ? "review" : "reviews" }} waiting</p>
            </template>
        </div>
    </WindowRoom>
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
