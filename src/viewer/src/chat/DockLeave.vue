<script setup>
// The line along the inside top edge of a card, its full width, the journal docked by itself, running down over the seconds left before the card closes;
// pointing at the card pauses it (kit/ChatDock.vue)
const props = defineProps({endsAt: {type: Number, required: true}});
const LEAVE_SECONDS = 5;
const left = Math.min(LEAVE_SECONDS, Math.max(0, props.endsAt - Date.now() / 1000));
const run = {animationDuration: `${LEAVE_SECONDS}s`, animationDelay: `${(left - LEAVE_SECONDS).toFixed(2)}s`};
</script>

<template>
    <span class="dock-leave" aria-hidden="true"><i :style="run"></i></span>
</template>

<style scoped>
.dock-leave {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1;
    height: 1px;
    overflow: hidden;
    pointer-events: none;
}

.dock-leave i {
    display: block;
    height: 100%;
    background: color-mix(in srgb, var(--text-3) 55%, var(--border-2));
    transform-origin: left center;
    animation: run-down 5s linear forwards;
    animation-play-state: var(--leave-play, running);
}

@keyframes run-down {
    from {
        transform: scaleX(1);
    }

    to {
        transform: scaleX(0);
    }
}
</style>
