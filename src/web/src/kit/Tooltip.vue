<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import TipBubble from "./TipBubble.vue";
import {TIP_ID, listen, setLayer, shown} from "./tip.js";

const layer = ref(null);
const place = computed(() => ({transform: `translate(${Math.round(shown.x)}px, ${Math.round(shown.y)}px)`}));
let stop = () => {};

onMounted(() => {
    setLayer(layer.value.$el);
    stop = listen();
});
onUnmounted(() => {
    stop();
    setLayer(null);
});
</script>

<template>
    <TipBubble
        :id="TIP_ID"
        ref="layer"
        role="tooltip"
        :hidden="shown.key === null"
        :class="['tooltip', {entering: shown.entering, sliding: shown.sliding, leaving: shown.leaving}]"
        :style="place"
        :title="shown.words.title"
        :line="shown.words.line"
        :keys="shown.words.keys"
        :side="shown.side"
        :arrow="`${shown.arrow}px`"
    />
</template>

<style scoped>
.tooltip {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
}

.tooltip[hidden] {
    display: none;
}

.tooltip.entering.below {
    animation: tip-in-below 90ms var(--ease) both;
}

.tooltip.entering.above {
    animation: tip-in-above 90ms var(--ease) both;
}

.tooltip.sliding {
    transition: transform 120ms var(--ease);
}

.tooltip.leaving {
    opacity: 0;
    transition: opacity 80ms ease-in;
}

@keyframes tip-in-below {
    from {
        opacity: 0;
        translate: 0 -3px;
    }
}

@keyframes tip-in-above {
    from {
        opacity: 0;
        translate: 0 3px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .tooltip {
        animation: none !important;
        transition: none !important;
    }
}
</style>
