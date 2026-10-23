<script setup>
import SwitchCase from "../kit/SwitchCase.vue";
import {STATUS_WORDS} from "../domain/taskBoard.js";

defineProps({status: {type: String, required: true}, size: {type: Number, default: 14}});
</script>

<template>
    <span class="task-status-icon">
        <Transition name="turn" mode="out-in">
            <svg
                :key="status"
                :class="['ring', status]"
                :width="size"
                :height="size"
                viewBox="0 0 16 16"
                role="img"
                :aria-label="STATUS_WORDS[status]"
            >
                <SwitchCase :value="status">
                    <template #blocked>
                        <circle cx="6.3" cy="8" r="4.7" class="stroke" />
                        <rect x="10.8" y="7.3" width="3.2" height="1.4" rx="0.7" class="fill" />
                        <circle cx="14.5" cy="8" r="1.25" class="fill" />
                    </template>
                    <template #done>
                        <circle cx="8" cy="8" r="6.3" class="fill" />
                        <polyline points="5.3,8.2 7.2,10 10.7,6.2" class="tick" />
                    </template>
                    <template #started>
                        <circle cx="8" cy="8" r="5.6" class="stroke" />
                        <path d="M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z" class="fill" />
                    </template>
                    <template #asked>
                        <circle cx="8" cy="8" r="5.6" class="stroke" />
                        <rect x="7.3" y="4.8" width="1.4" height="3.6" rx="0.7" class="fill" />
                        <circle cx="8" cy="10.5" r="0.9" class="fill" />
                    </template>
                    <template #parked>
                        <circle cx="8" cy="8" r="5.6" class="stroke" />
                        <rect x="6" y="5.6" width="1.3" height="4.8" rx="0.6" class="fill" />
                        <rect x="8.7" y="5.6" width="1.3" height="4.8" rx="0.6" class="fill" />
                    </template>
                    <template #delegated>
                        <circle cx="8" cy="8" r="5.6" class="stroke" />
                        <path d="M5.4 8 H10.2 M8.4 6 L10.4 8 L8.4 10" class="stroke" />
                    </template>
                    <template #planned>
                        <circle cx="8" cy="8" r="5.6" class="stroke dashed" />
                    </template>
                    <template #default>
                        <circle cx="8" cy="8" r="5.6" class="stroke" />
                    </template>
                </SwitchCase>
            </svg>
        </Transition>
    </span>
</template>

<style scoped>
.task-status-icon {
    display: inline-flex;
    flex: none;
}

.ring {
    --tone: var(--open);
    display: block;
}

.ring.planned {
    --tone: var(--text-4);
}

.ring.started,
.ring.done {
    --tone: var(--progress);
}

.ring.asked,
.ring.blocked {
    --tone: var(--blocking);
}

.ring.parked {
    --tone: var(--parked);
}

.ring.delegated {
    --tone: var(--delegated);
}

.stroke {
    fill: none;
    stroke: var(--tone);
    stroke-width: 1.5;
}

.stroke.dashed {
    stroke-dasharray: 2.2 1.9;
}

.fill {
    fill: var(--tone);
}

.tick {
    fill: none;
    stroke: var(--raised);
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.turn-enter-active {
    transition:
        transform 0.24s var(--ease),
        opacity 0.24s var(--ease);
}

.turn-enter-from {
    opacity: 0;
    transform: scale(0.4) rotate(-90deg);
}

@media (prefers-reduced-motion: reduce) {
    .turn-enter-active {
        transition: none;
    }
}
</style>
