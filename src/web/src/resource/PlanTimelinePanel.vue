<script setup>
import {ref} from "vue";
import {useScope} from "../composables/scope.js";
import {usePoll} from "../composables/poll.js";
import {peek} from "../route.js";
import PlanTimeline from "./PlanTimeline.vue";

const REFRESH_MS = 15000;
const props = defineProps({plan: {type: Object, required: true}});
const items = ref([]);
const loaded = ref(false);
const scope = useScope();

usePoll(
    `timeline:${scope.env}:${props.plan.id}`,
    () => scope.api.planTimeline(props.plan.id),
    REFRESH_MS,
    (got) => {
        items.value = got;
        loaded.value = true;
    }
);
</script>

<template>
    <section class="timeline-panel">
        <h3 class="heading">Timeline</h3>
        <PlanTimeline :items="items" :loading="!loaded" @open="(n) => peek('tasks', n)" />
    </section>
</template>

<style scoped>
.timeline-panel {
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
</style>
