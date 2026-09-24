<script setup>
defineProps({second: Boolean});
</script>

<template>
    <div :class="['menu-slide', {second}]">
        <div class="menu-slide-track">
            <div class="menu-slide-panel" :inert="second"><slot name="first" /></div>
            <div class="menu-slide-panel" :inert="!second"><slot name="second" /></div>
        </div>
    </div>
</template>

<style scoped>
.menu-slide {
    overflow: hidden;
}

.menu-slide-track {
    display: grid;
    grid-template-columns: 100% 100%;
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
    max-height: 0;
    opacity: 0;
    transition:
        opacity 0.18s ease,
        max-height 0s 0.22s;
    transition-behavior: allow-discrete;
}

@media (prefers-reduced-motion: reduce) {
    .menu-slide-track,
    .menu-slide-panel {
        transition: none;
    }
}
</style>
