<script setup>
import {computed} from "vue";
import {stackOf, trailOf} from "../domain/agentState.js";

const props = defineProps({agent: {type: Object, required: true}});
const stack = computed(() => stackOf(props.agent));
const trail = computed(() => trailOf(props.agent));
</script>

<template>
    <p class="bar-none">States the agent is in, the one it is in now first.</p>
    <ol class="stack">
        <template v-for="(state, at) in stack" :key="at">
            <li class="stack-state">
                <span class="stack-title">{{ state.title }}</span>
                <template v-if="state.values">
                    <small class="stack-values">{{ state.values }}</small>
                </template>
                <template v-if="state.awaits">
                    <small class="stack-awaits">{{ state.awaits }}</small>
                </template>
            </li>
        </template>
    </ol>
    <template v-if="trail.length">
        <p class="bar-none">Latest changes, newest first.</p>
        <ul class="trail">
            <template v-for="(line, at) in trail" :key="at">
                <li class="trail-line">{{ line }}</li>
            </template>
        </ul>
    </template>
</template>

<style scoped>
.stack,
.trail {
    margin: 0;
    padding: 0 6px;
    list-style: none;
}

.stack-state {
    display: flex;
    flex-direction: column;
    padding: 3px 0;
}

.stack-title {
    color: var(--text);
}

.stack-values,
.stack-awaits,
.trail-line {
    color: var(--text-3);
    font-size: 10.5px;
}

.trail-line {
    padding: 2px 0;
}
</style>
