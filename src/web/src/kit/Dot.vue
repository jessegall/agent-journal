<script setup>
import {computed} from "vue";

const COLOR = {
    started: "var(--progress)",
    blocked: "var(--blocking)",
    parked: "var(--parked)",
    planned: "var(--text-3)",
    done: "var(--progress)",
    asked: "var(--blocking)",
    open: "var(--open)",
    struck: "var(--text-3)",
};
const props = defineProps({
    kind: {type: String, default: "open"},
    glow: {type: Boolean, default: false},
    size: {type: Number, default: 10},
    pulsing: {type: Boolean, default: false},
    solid: {type: Boolean, default: false},
});
const color = computed(() => COLOR[props.kind] || COLOR.open);
</script>

<template>
    <template v-if="solid">
        <span class="solid" :style="{'--size': `${size}px`}" role="img" :aria-label="kind" />
    </template>
    <template v-else-if="glow">
        <span :class="['glow', {pulsing}]" :style="{'--size': `${size}px`}" role="img" :aria-label="kind" />
    </template>
    <template v-else>
        <span
            class="dot"
            :style="{borderColor: color, background: kind === 'done' ? color : 'transparent'}"
            role="img"
            :aria-label="kind"
        />
    </template>
</template>

<style scoped>
.dot {
    flex: none;
    display: inline-block;
    box-sizing: border-box;
    width: 10px;
    height: 10px;
    margin: 0 3px;
    border: 2px solid;
    border-radius: 50%;
}

.solid {
    flex: none;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background: var(--tone);
}

.glow {
    flex: none;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background: var(--tone);
    box-shadow: 0 0 0 calc(var(--size) / 3) color-mix(in srgb, var(--tone) 22%, transparent);
}

.glow.pulsing {
    animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
    50% {
        box-shadow: 0 0 0 calc(var(--size) * 2 / 3) color-mix(in srgb, var(--tone) 9%, transparent);
    }
}

@media (prefers-reduced-motion: reduce) {
    .glow.pulsing {
        animation: none;
    }
}
</style>
