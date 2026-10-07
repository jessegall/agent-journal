<script setup>
import {computed} from "vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {loopRows, loopSet as set, loopWhen as when} from "../domain/loops.js";

const props = defineProps({loops: {type: Object, default: () => ({})}});
const listed = computed(() => loopRows(props.loops));
</script>

<template>
    <h4 class="loop-heading">Repeating prompts</h4>
    <p class="loop-none">Prompts the agent set to run again on a schedule.</p>
    <template v-for="loop in listed" :key="loop.id">
        <div class="loop-row">
            <span class="loop-when" :title="loop.schedule">
                {{ when(loop.schedule) }}
                <small>{{ set(loop.at) }}</small>
            </span>
            <TextDisplay class="loop-prompt" :text="loop.prompt || ''" />
        </div>
    </template>
</template>

<style scoped>
.loop-heading {
    margin: 0;
    padding: 6px 8px 0;
    color: var(--text);
    font-size: 12px;
    font-weight: 600;
}

.loop-none {
    margin: 0;
    padding: 4px 8px 6px;
    color: var(--text-3);
    font-size: 12px;
}

.loop-row {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 7px 8px;
    border-top: 1px solid var(--border);
    font-size: 12px;
}

.loop-when {
    display: flex;
    align-items: baseline;
    gap: 8px;
    color: var(--text);
    font-weight: 500;
}

.loop-when small {
    color: var(--text-3);
    font-weight: 400;
}

.loop-prompt {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    color: var(--text-2);
}
</style>
