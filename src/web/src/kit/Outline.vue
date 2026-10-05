<script setup>
import {computed} from "vue";

const props = defineProps({rect: {type: Object, required: true}});

const ring = computed(() => ({
    left: `${props.rect.l - 4}px`,
    top: `${props.rect.t - 4}px`,
    width: `${props.rect.r - props.rect.l + 8}px`,
    height: `${props.rect.b - props.rect.t + 8}px`,
}));
</script>

<template>
    <Teleport to="body">
        <div class="outline" :style="ring" />
    </Teleport>
</template>

<style scoped>
.outline {
    position: fixed;
    z-index: 500;
    border: 1.5px solid var(--accent);
    border-radius: 8px;
    pointer-events: none;
    animation: outline-in 0.2s both;
    transition:
        left 0.3s var(--ease),
        top 0.3s var(--ease),
        width 0.3s var(--ease),
        height 0.3s var(--ease);
}

@keyframes outline-in {
    from {
        opacity: 0;
    }
}
</style>
