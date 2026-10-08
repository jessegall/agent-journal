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
    `timeline:${scope.env}:${props.plan.n}`,
    () => scope.api.planTimeline(props.plan.n),
    REFRESH_MS,
    (got) => {
        items.value = got;
        loaded.value = true;
    }
);
</script>

<template>
    <div class="timeline-panel">
        <h2 class="heading">Timeline</h2>
        <PlanTimeline :items="items" :loading="!loaded" @open="(n) => peek('todo', n)" />
    </div>
</template>

<style scoped>
.timeline-panel {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px 18px;
    overflow-y: auto;
}

.heading {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
}
</style>
