<script setup>
defineProps({state: {type: String, default: ""}});
</script>

<template>
    <span :class="['state-dot', state]" />
</template>

<style scoped>
.state-dot {
    flex: none;
    width: 7px;
    height: 7px;
    border: 1.5px solid var(--text-4);
    border-radius: 50%;
}

.state-dot.running {
    border-color: var(--progress);
    background: var(--progress);
    animation: state-dot-pulse 1.6s ease-in-out infinite;
}

.state-dot.done {
    border-color: var(--tone-good);
    background: var(--tone-good);
}

@keyframes state-dot-pulse {
    50% {
        opacity: 0.35;
    }
}

@media (prefers-reduced-motion: reduce) {
    .state-dot.running {
        animation: none;
    }
}

.state-dot.you {
    border-color: var(--tone-warn);
    background: var(--tone-warn);
}

.state-dot.blocked {
    border-color: var(--danger-soft);
    background: var(--danger-soft);
}

.state-dot.queued {
    background: var(--text-4);
}

.state-dot.draft {
    border-style: dashed;
}
</style>
