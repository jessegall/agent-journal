<script setup>
import {owed} from "../domain/owed.js";

defineProps({item: {type: Object, required: true}});
</script>

<template>
    <template v-if="owed(item)">
        <span class="owed">
            <span class="owed-dot" aria-hidden="true" />
            Answer on its way
        </span>
    </template>
</template>

<style scoped>
.owed {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    margin-top: 4px;
    padding-right: 26px;
    color: var(--text-4);
    font-size: 0.706rem;
}

.owed-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
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
