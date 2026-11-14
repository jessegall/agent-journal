<script setup>
import {computed} from "vue";

// the bar of an agent's plan: 72 by 4 pixels, from the left the completed tasks in full, those in testing at 60% and those started at 28%; open and blocked tasks leave the track bare.
// The count beside it is the completed tasks of all the plan's tasks, the first number a shade brighter. Hovering names each part, and a screen reader reads the same words
const props = defineProps({plan: {type: Number, required: true}, counts: {type: Object, required: true}});
const share = (count) => `${props.counts.total ? (count / props.counts.total) * 100 : 0}%`;
const words = computed(() => {
    const {completed, testing, started, total} = props.counts;
    return `Plan ${props.plan}: ${completed} completed, ${testing} testing, ${started} started, ${total - completed - testing - started} open`;
});
</script>

<template>
    <template v-if="counts.total">
      <span class="plan-bar" data-plan-bar :title="words">
          <span class="track" role="img" :aria-label="words" data-plan-track>
              <span class="part completed" data-plan-completed :style="{width: share(counts.completed)}" />
              <span class="part testing" data-plan-testing :style="{width: share(counts.testing)}" />
              <span class="part started" data-plan-started :style="{width: share(counts.started)}" />
          </span>
          <span class="count" data-plan-count><b>{{ counts.completed }}</b> of {{ counts.total }}</span>
      </span>
    </template>
</template>

<style scoped>
.plan-bar {
    display: inline-flex;
    flex: none;
    gap: 8px;
    align-items: center;
    margin-left: auto;
}

.track {
    display: flex;
    flex: none;
    width: 72px;
    height: 4px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--chip);
}

.part {
    display: block;
    height: 100%;
}

.completed {
    background: var(--accent);
}

.testing {
    background: color-mix(in srgb, var(--accent) 60%, transparent);
}

.started {
    background: color-mix(in srgb, var(--accent) 28%, transparent);
}

.count {
    color: var(--text-3);
    font-size: 12.5px;
    font-variant-numeric: tabular-nums;
}

.count b {
    color: var(--text-2);
    font-weight: 500;
}
</style>
