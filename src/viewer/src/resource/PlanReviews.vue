<script setup>
import {computed, ref, watch} from "vue";
import TextDisplay from "../kit/TextDisplay.vue";

// the reviews of a plan, oldest first, each with who reviewed it and what they reported
const PLAN_SUBJECT = "plan";
const props = defineProps({id: {type: Number, required: true}, read: {type: Function, required: true}});
const reviews = ref([]);
const shown = computed(() => reviews.value.filter((review) => review.subject_model === PLAN_SUBJECT));
const label = (state) => state.slice(0, 1).toUpperCase() + state.slice(1);

async function load() {
    const answer = await props.read(["review", "list", "--subject-id", String(props.id), "--oldest"]);
    reviews.value = answer.ok ? answer.value.rows ?? [] : [];
}

watch(() => props.id, load, {immediate: true});
</script>

<template>
    <template v-if="shown.length">
        <section class="rounds" data-plan-reviews>
            <h3 class="heading">Review rounds</h3>
            <ol class="list">
                <template v-for="(review, index) in shown" :key="review.id">
                    <li class="round" data-plan-review>
                        <div class="head">
                            <span class="title">Round {{ index + 1 }}</span>
                            <span class="state">{{ label(review.state) }}</span>
                        </div>
                        <template v-if="review.report">
                            <TextDisplay class="report" :text="review.report" />
                        </template>
                    </li>
                </template>
            </ol>
        </section>
    </template>
</template>

<style scoped>
.rounds {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 24px;
}

.heading {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
    font-weight: 600;
}

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
    font-size: 13px;
}

.state {
    color: var(--text-3);
    font-size: 12px;
}

.report {
    margin-top: 2px;
    color: var(--text-2);
    font-size: 13px;
}
</style>
