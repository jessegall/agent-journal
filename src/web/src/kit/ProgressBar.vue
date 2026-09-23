<script setup>
import {computed} from "vue";

const props = defineProps({
    value: {type: Number, required: true},
    max: {type: Number, default: 100},
    tone: {type: String, default: ""},
    least: {type: Number, default: 0},
    thin: Boolean,
    busy: Boolean,
});
const width = computed(() => (props.busy ? "40%" : `${Math.max(props.least, (100 * props.value) / Math.max(1, props.max))}%`));
</script>

<template>
    <span :class="['track', tone, {thin, busy}]" role="progressbar" :aria-valuenow="busy ? undefined : value" :aria-valuemax="max">
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

.track.thin {
    height: 4px;
    border-radius: 2px;
}

.busy .fill {
    animation: sweep 1.6s ease-in-out infinite;
}

@keyframes sweep {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(250%);
    }
}

@media (prefers-reduced-motion: reduce) {
    .busy .fill {
        animation: none;
        transform: none;
    }
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
