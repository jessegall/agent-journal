<script setup>
import {owed} from "../domain/owed.js";

defineProps({turn: {type: Object, required: true}});
</script>

<template>
    <template v-if="owed(turn)">
        <span class="owed" role="status">
            <span class="owed-dot" aria-hidden="true" />
            Answer on its way
        </span>
    </template>
</template>

<style scoped>
.owed {
    display: inline-flex;
    align-items: center;
    align-self: flex-end;
    gap: 6px;
    margin-top: 3px;
    color: var(--text-3);
    font-size: 11px;
}

.owed-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    animation: owed-pulse 1.6s ease-in-out infinite;
}

@keyframes owed-pulse {
    50% {
        opacity: 0.3;
    }
}

@media (prefers-reduced-motion: reduce) {
    .owed-dot {
        animation: none;
    }
}
</style>
