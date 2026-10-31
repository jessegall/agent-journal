<script setup>
import {computed} from "vue";
import {elapsed} from "../format/time.js";
import {useSharedNow} from "../composables/now.js";

const props = defineProps({since: {type: Number, required: true}});
const now = useSharedNow();
const duration = computed(() => elapsed(now.value - props.since));
</script>

<template>
    <span class="job-timer" title="How long the agent has been on its current job">{{ duration }}</span>
</template>

<style scoped>
.job-timer {
    color: var(--text-3);
    font-family: var(--mono);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}
</style>
