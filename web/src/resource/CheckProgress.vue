<script setup>
import {seconds} from "../domain/checks.js";

defineProps({state: Object});
</script>

<template>
    <div class="progress">
        <div :class="['track', {unknown: state.percent === null}]">
            <span class="fill" :style="{width: state.percent === null ? '35%' : `${state.percent}%`}" />
        </div>
        <div class="numbers">
            <span class="percent">{{ state.percent === null ? "Running" : `${Math.round(state.percent)}%` }}</span>
            <span class="note">
                {{
                    state.total
                        ? `${state.done} of ${state.total} done`
                        : state.measured
                          ? "as the command reports it"
                          : state.percent === null
                            ? "no earlier run to go by"
                            : "going by the last run"
                }}
            </span>
            <span class="grow" />
            <span class="time">
                {{ seconds(state.elapsed) }}
                <template v-if="state.remaining !== null">· about {{ seconds(state.remaining) }} left</template>
            </span>
        </div>
    </div>
</template>

<style scoped>
.progress {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.track {
    position: relative;
    height: 6px;
    overflow: hidden;
    border-radius: 3px;
    background: var(--border-2);
}

.fill {
    position: absolute;
    inset: 0 auto 0 0;
    border-radius: 3px;
    background: linear-gradient(90deg, var(--accent), var(--progress));
    transition: width 0.8s ease;
}

.unknown .fill {
    animation: sweep 1.4s ease-in-out infinite;
}

@keyframes sweep {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(300%);
    }
}

.numbers {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 11.5px;
    color: var(--text-3);
}

.percent {
    color: var(--text);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
}

.time {
    font-variant-numeric: tabular-nums;
}

.grow {
    flex: 1;
}
</style>
