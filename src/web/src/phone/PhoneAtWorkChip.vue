<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {agentCounts, counted} from "../domain/helpers.js";

const props = defineProps({live: {type: Object, default: () => ({})}});
const emit = defineEmits(["open"]);
const counts = computed(() => agentCounts(props.live.helpers || [], props.live.subagents || []));
const chip = computed(() => {
    if (counts.value.needs) return {tone: "needs", text: counted(counts.value.needs, "needs you", "need you")};
    if (counts.value.working) return {tone: "working", text: `${counts.value.working} at work`};
    if (counts.value.reported) return {tone: "reported", text: counted(counts.value.reported, "reported", "reported")};
    if (counts.value.finished) return {tone: "finished", text: counted(counts.value.finished, "finished", "finished")};
    return null;
});
const part = (n, one, many) => (n ? counted(n, one, many) : "");
const label = computed(() => {
    const lines = [
        part(counts.value.needs, "helper needs you", "helpers need you"),
        part(counts.value.working, "at work", "at work"),
        part(counts.value.reported, "reported", "reported"),
        part(counts.value.finished, "finished", "finished"),
    ].filter(Boolean);
    return `${lines.join(", ")}. Open the list`;
});
</script>

<template>
    <template v-if="chip">
        <button type="button" :class="['at-work-chip', chip.tone]" :aria-label="label" @click="emit('open')">
            <Icon name="bot" :size="16" />
            <span>{{ chip.text }}</span>
        </button>
    </template>
</template>

<style scoped>
.at-work-chip {
    display: flex;
    flex: none;
    align-items: center;
    gap: 7px;
    min-height: 36px;
    padding: 0 11px;
    border: 1px solid var(--line-strong, var(--line));
    border-radius: 18px;
    background: transparent;
    color: var(--text-2);
    font: inherit;
    font-size: 0.824rem;
    white-space: nowrap;
}

.at-work-chip.needs {
    border-color: var(--tone-warn);
    background: color-mix(in oklab, var(--tone-warn) 10%, transparent);
    color: var(--tone-warn);
}

.at-work-chip.reported {
    color: var(--tone-good);
}

.at-work-chip.finished {
    opacity: 0.55;
}
</style>
