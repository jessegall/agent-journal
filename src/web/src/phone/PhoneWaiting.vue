<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {ordered} from "./waiting.js";

const props = defineProps({waiting: {type: Array, required: true}});
const emit = defineEmits(["open"]);
const sorted = computed(() => ordered(props.waiting));
const summary = computed(() => {
    const count = `${props.waiting.length} ${props.waiting.length === 1 ? "needs" : "need"} you`;
    return props.waiting.some((item) => item.type === "plan") ? `${count}, including a plan` : count;
});
</script>

<template>
    <template v-if="waiting.length">
        <button type="button" class="waiting" :aria-label="`${summary}. Review`" @click="emit('open', sorted[0].ref)">
            <span class="waiting-dot" />
            <span class="waiting-summary">{{ summary }}</span>
            <span class="waiting-go">Review</span>
            <Icon class="waiting-arrow" name="arrow" :size="14" />
        </button>
    </template>
</template>

<style scoped>
.waiting {
    display: flex;
    align-items: center;
    gap: 8px;
    width: calc(100% + 2 * var(--side));
    max-width: none;
    min-height: 44px;
    margin: 0 calc(-1 * var(--side));
    padding: 0 var(--side);
    border: 0;
    border-bottom: 1px solid var(--line);
    background: var(--accent-dim);
    color: var(--accent-text);
    font: inherit;
    text-align: left;
}

.waiting:active:not(:disabled) {
    opacity: 1;
    background: color-mix(in oklab, var(--accent-dim) 80%, var(--accent));
}

.waiting-dot {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
}

.waiting-summary {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.waiting-go {
    flex: none;
    font-size: 0.882rem;
    font-weight: 600;
}

.waiting-arrow {
    flex: none;
}
</style>
