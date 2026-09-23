<script setup>
import {computed} from "vue";

const props = defineProps({
    value: {type: Number, required: true},
    max: {type: Number, default: 100},
    tone: {type: String, default: ""},
    least: {type: Number, default: 0},
});
const width = computed(() => `${Math.max(props.least, (100 * props.value) / Math.max(1, props.max))}%`);
</script>

<template>
    <span :class="['track', tone]">
        <span class="fill" :style="{width}" />
    </span>
</template>

<style scoped>
.track {
    display: block;
    height: 8px;
    border-radius: 4px;
    background: var(--line);
    overflow: hidden;
}

.fill {
    display: block;
    height: 100%;
    border-radius: 4px;
    background: var(--accent);
    transition: width 0.4s cubic-bezier(0.2, 0.9, 0.25, 1);
}

.good .fill {
    background: var(--tone-good);
}

.warn .fill {
    background: var(--tone-warn);
}

.danger .fill {
    background: var(--tone-danger);
}

.muted .fill {
    background: var(--text-4);
}
</style>
