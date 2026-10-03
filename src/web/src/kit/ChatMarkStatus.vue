<script setup>
import {computed} from "vue";
import {useNow} from "../composables/now.js";
import StateDot from "./StateDot.vue";
import {span} from "../format/time.js";

const props = defineProps({mark: {type: Object, required: true}});
const STATE_WORDS = {done: "Ended", failed: "Failed"};
const running = computed(() => Boolean(props.mark.started) && !props.mark.ended);
const now = useNow(1000, running);
const took = computed(() => {
    const {started, ended} = props.mark;
    if (!started) return "";
    return ended ? `ran ${span(ended - started, true)}` : span(now.value - started, true);
});
</script>

<template>
    <span class="status">
        <template v-if="took">
            <span class="took">{{ took }}</span>
        </template>
        <template v-if="mark.state">
            <StateDot class="mark-dot" :state="mark.state" :title="STATE_WORDS[mark.state] || 'Still running'" />
        </template>
    </span>
</template>

<style scoped>
.status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-left: auto;
    padding-left: 6px;
    color: var(--text-4);
    font-variant-numeric: tabular-nums;
}

.took {
    font-size: 10px;
}

.mark-dot {
    width: 5px;
    height: 5px;
    border-width: 1px;
}
</style>
