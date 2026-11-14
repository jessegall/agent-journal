<script setup>
import {computed, watch} from "vue";
import {InspectorPart, TextDisplay, useWindow} from "@journal/window-kit";

// the reviews of a plan, oldest first, each with who reviewed it and what they reported
const PLAN_SUBJECT = "plan";
const context = useWindow();
const row = context.option("row");
const key = computed(() => `reviews.${row.value.id}`);
const reviews = computed(() => context.props[key.value].rows.value);
const shown = computed(() => reviews.value.filter((review) => review.subject_model === PLAN_SUBJECT));
const reviewers = computed(() => new Map(context.props.reviewers.rows.value.map((assignment) => [assignment.subject_id, assignment.actor_id])));
const label = (state) => state.slice(0, 1).toUpperCase() + state.slice(1);

watch(key, (name) => context.reload(name), {immediate: true});
</script>

<template>
    <template v-if="shown.length">
        <InspectorPart title="Reviews" data-plan-reviews>
            <ol class="list">
                <template v-for="review in shown" :key="review.id">
                    <li data-plan-review>
                        <div class="head">
                            <span>Review {{ review.id }}<template v-if="reviewers.has(review.id)"> · reviewer {{ reviewers.get(review.id) }}</template></span>
                            <span class="state">{{ label(review.state) }}</span>
                        </div>
                        <template v-if="review.report">
                            <TextDisplay :text="review.report" />
                        </template>
                    </li>
                </template>
            </ol>
        </InspectorPart>
    </template>
</template>

<style scoped>
.list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.head {
    display: flex;
    gap: 8px;
    align-items: baseline;
}

.state {
    color: var(--text-3);
    font-size: 12px;
}
</style>
