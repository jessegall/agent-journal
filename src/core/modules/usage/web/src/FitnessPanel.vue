<script setup>
import {ref} from "vue";
import {useWindow} from "@journal/window-kit";

// the measures behind an agent's fitness score, each with its value and the level it should stay under, and its load
const context = useWindow();
const fitness = ref(null);
const failure = ref("");

async function load() {
    const answer = await context.read(`usage fitness --agent ${context.agent}`);
    failure.value = answer.ok ? "" : answer.error;
    fitness.value = answer.ok ? answer.value : null;
}

load();
</script>

<template>
    <div class="fitness" data-fitness>
        <template v-if="failure">
            <p class="fitness-note">{{ failure }}</p>
        </template>
        <template v-if="fitness">
            <p class="fitness-head" data-fitness-head>{{ fitness.is_measured ? `Fitness ${fitness.score} of 100` : "Fitness not measured yet: an agent is measured after its first half hour" }}</p>
            <template v-for="measure in fitness.measures" :key="measure.key">
                <p class="fitness-measure" :data-measure="measure.key">
                    <span>{{ measure.label }}</span>
                    <span>{{ measure.value }}<template v-if="measure.pass_level !== null"> of {{ measure.pass_level }}</template></span>
                </p>
            </template>
            <p class="fitness-measure" data-measure="load"><span>Load: messages arriving against those answered</span><span>{{ fitness.load }}</span></p>
            <p class="fitness-note">Counts messages, waits and tasks. Version 4 also measured workers, merges and lines of code, which this version does not record.</p>
        </template>
    </div>
</template>

<style scoped>
.fitness {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 300px;
}

.fitness-head {
    margin: 0;
    font-weight: 600;
}

.fitness-measure {
    display: flex;
    gap: 12px;
    justify-content: space-between;
    margin: 0;
    font-size: 13px;
}

.fitness-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
