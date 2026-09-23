<script setup>
import Icon from "../kit/Icon.vue";
import {clock} from "../format/time.js";

defineProps({
    task: {type: String, required: true},
    kind: {type: String, default: ""},
    model: {type: String, default: ""},
    finished: {type: Boolean, default: false},
    at: {type: Number, required: true},
});
</script>

<template>
    <span class="subagent">
        <Icon name="bot" :size="12" />
        {{ finished ? "Subagent finished" : "Dispatched" }}
        <strong>{{ kind || "subagent" }}</strong>
        <template v-if="model">
            <span class="model">{{ model }}</span>
        </template>
        <span class="task">{{ task }}</span>
        <span class="when">{{ clock(at) }}</span>
    </span>
</template>

<style scoped>
.subagent {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    max-width: 100%;
    padding: 4px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    color: var(--text-3);
    font-size: 12px;
}

.subagent strong {
    color: var(--text-2);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-weight: 500;
}

.model {
    padding: 0 6px;
    border-radius: 99px;
    background: var(--code-bg);
    font-size: 11px;
}

.task {
    overflow: hidden;
    color: var(--text-2);
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
