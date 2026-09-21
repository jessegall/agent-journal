<script setup lang="ts">
import {api} from "../api/client.js";
import Icon from "../kit/Icon.vue";
import {go, peek, route} from "../route.js";
import {rows} from "../store.js";
import {currentWork, doneOf, lineOf, phaseOf, planButton, queued, rowsOf, shownPlans, stateOf, wordOf} from "./statusline.js";

defineProps<{plans: unknown; error: string; data: unknown; p: unknown}>();
defineEmits<{runBar: [unknown]}>();
</script>

<template>
    <div :class="['planbar', `planbar-${data.status}`]">
        <button type="button" class="planbar-link" :title="`Plan ${p.n}: ${p.title}`" @click="peek('plan', p.n)">
            <span class="planbar-n">Plan</span>
            <span class="planbar-dot">·</span>
            <span class="planbar-title">{{ p.title }}</span>
            <template v-if="phaseOf(p)">
                <span class="planbar-dot">·</span>
                <span class="planbar-phase">{{ phaseOf(p) }}</span>
            </template>
            <template v-if="data.status === 'building'">
                <span class="planbar-step">being written</span>
                <span class="planbar-track building" role="progressbar"><span /></span>
            </template>
            <template v-else>
                <span class="planbar-step" :title="`Phase ${data.current || 1} of ${data.phases.length}`">
                    {{ doneOf(p, rows("todo")) }}/{{ rowsOf(p).length }}
                </span>
                <span class="planbar-track" role="progressbar">
                    <span :style="{width: `${(100 * doneOf(p, rows('todo'))) / Math.max(1, rowsOf(p).length)}%`}" />
                </span>
            </template>
        </button>
        <template v-if="planButton(p)">
            <button type="button" :class="['planbar-act', {ack: data.status === 'done'}]" @click="$emit('runBar', p)">
                {{ planButton(p)[1] }}
                <Icon name="arrow" />
            </button>
        </template>
        <template v-if="error">
            <span class="planbar-error">{{ error }}</span>
        </template>
    </div>
</template>

<style scoped>
.planbar {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 30px;
    padding: 0 8px 0 0;
    border-bottom: 1px solid var(--line);
    background: var(--bg-2);
    color: var(--text-2);
    font-size: 11.5px;
}

.planbar-link {
    border: 0;
    background: none;
    font: inherit;
    text-align: left;
    cursor: pointer;
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 100%;
    padding: 0 14px 0 20px;
    color: inherit;
}

.planbar-link:hover {
    background: rgba(255, 255, 255, 0.03);
    color: var(--text);
}

.planbar-n {
    flex: none;
    font-weight: 600;
    color: var(--text);
}

.planbar-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.planbar-dot {
    flex: none;
    color: var(--text-3);
}

.planbar-phase {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-3);
    font-size: 11px;
}

.planbar-step {
    flex: none;
    margin-left: auto;
    color: var(--text-3);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}

.planbar-track {
    flex: none;
    width: 120px;
    height: 4px;
    border-radius: 3px;
    overflow: hidden;
    background: var(--line);
}

.planbar-track.building > span {
    width: 40%;
    animation: writing 1.6s ease-in-out infinite;
}

@keyframes writing {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(250%);
    }
}

.planbar-track > span {
    display: block;
    height: 100%;
    border-radius: 3px;
    background: var(--accent);
    transition: width 0.3s ease;
}

.planbar-act {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 22px;
    padding: 0 10px;
    border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
    border-radius: 6px;
    background: color-mix(in srgb, var(--accent) 22%, transparent);
    color: var(--text);
    font-size: 11px;
    cursor: pointer;
}

.planbar-act:hover {
    background: color-mix(in srgb, var(--accent) 34%, transparent);
}

.planbar-act .ico {
    width: 11px;
    height: 11px;
    color: inherit;
}

.planbar-act.ack {
    border-color: var(--border-2);
    background: var(--raised);
}

.planbar-error {
    flex: none;
    color: var(--danger);
    font-size: 11px;
}

.planbar-enter-active,
.planbar-leave-active {
    overflow: hidden;
    transition:
        height 0.22s ease,
        opacity 0.18s ease;
}

.planbar-enter-from,
.planbar-leave-to {
    height: 0;
    opacity: 0;
    border-bottom-width: 0;
}
</style>
