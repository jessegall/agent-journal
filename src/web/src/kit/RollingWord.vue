<script setup>
// A short text that rolls when it changes: the new words come up from below as the old go up and out, in the same place, so
// nothing around them moves.
defineProps({text: {type: String, required: true}});
</script>

<template>
    <span class="rolling">
        <Transition name="rolling">
            <span :key="text" class="rolling-text">{{ text }}</span>
        </Transition>
    </span>
</template>

<style scoped>
.rolling {
    --rolling-in: 180ms;
    --rolling-out: 150ms;
    display: inline-grid;
    min-width: 0;
    overflow: hidden;
    vertical-align: bottom;
}

.rolling-text {
    grid-area: 1 / 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.rolling-enter-active {
    transition:
        opacity var(--rolling-in) ease,
        transform var(--rolling-in) cubic-bezier(0.22, 0.7, 0.3, 1);
}

.rolling-leave-active {
    transition:
        opacity var(--rolling-out) ease,
        transform var(--rolling-out) cubic-bezier(0.22, 0.7, 0.3, 1);
}

.rolling-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.rolling-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
