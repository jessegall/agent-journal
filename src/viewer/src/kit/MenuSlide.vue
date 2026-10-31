<script setup>
import {onMounted, onUnmounted, ref, watch} from "vue";

const props = defineProps({second: Boolean});
const firstPanel = ref(null);
const secondPanel = ref(null);
const height = ref(null);
const activePanel = () => (props.second ? secondPanel.value : firstPanel.value);
const measure = () => activePanel() && (height.value = activePanel().scrollHeight);
const watcher = new ResizeObserver(measure);

watch(() => props.second, measure);
onMounted(() => {
    [firstPanel.value, secondPanel.value].forEach((panel) => panel && watcher.observe(panel));
    measure();
});
onUnmounted(() => watcher.disconnect());
</script>

<template>
    <div :class="['menu-slide', {second}]" :style="height === null ? {} : {height: `${height}px`}">
        <div class="menu-slide-track">
            <div ref="firstPanel" class="menu-slide-panel" :inert="second"><slot name="first" /></div>
            <div ref="secondPanel" class="menu-slide-panel" :inert="!second"><slot name="second" /></div>
        </div>
    </div>
</template>

<style scoped>
.menu-slide {
    overflow: hidden;
    transition: height 0.22s var(--ease);
}

.menu-slide-track {
    display: grid;
    grid-template-columns: 100% 100%;
    align-items: start;
    transition: transform 0.22s var(--ease);
}

.menu-slide.second .menu-slide-track {
    transform: translateX(-100%);
}

.menu-slide-panel {
    display: flex;
    flex-direction: column;
    min-width: 0;
    transition: opacity 0.18s ease;
}

.menu-slide-panel[inert] {
    opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
    .menu-slide,
    .menu-slide-track,
    .menu-slide-panel {
        transition: none;
    }
}
</style>
