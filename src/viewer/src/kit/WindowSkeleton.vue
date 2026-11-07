<script setup>
import SkeletonParts from "./SkeletonParts.vue";

// the skeleton a window declares of itself in its module, drawn at the window's full size while it loads
defineProps({parts: {type: Array, default: () => []}});
</script>

<template>
    <div class="window-skeleton" aria-busy="true" aria-label="Loading" data-window-skeleton>
        <SkeletonParts :parts="parts" />
    </div>
</template>

<style scoped>
.window-skeleton {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--bg);
}
</style>
