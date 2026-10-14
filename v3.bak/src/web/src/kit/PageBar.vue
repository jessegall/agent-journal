<script setup>
import {onMounted, onUnmounted, ref} from "vue";

const bar = ref(null);
const watcher = new ResizeObserver(([entry]) => {
    const parent = entry.target.parentElement;
    if (parent) parent.style.setProperty("--page-bar-height", `${entry.target.offsetHeight}px`);
});

onMounted(() => bar.value && watcher.observe(bar.value));
onUnmounted(() => watcher.disconnect());
</script>

<template>
    <div ref="bar" class="page-bar">
        <slot />
    </div>
</template>

<style scoped>
.page-bar {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 16px;
    min-height: 44px;
    padding: 6px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
    color: var(--text-2);
}
</style>
