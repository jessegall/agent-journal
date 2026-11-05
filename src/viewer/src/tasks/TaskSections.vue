<script setup>
import {computed, ref} from "vue";
import TaskWaitList from "./TaskWaitList.vue";

const LONG_BRIEF = 180;
const FINISHED_STATES = new Set(["completed", "cancelled"]);
const props = defineProps({task: {type: Object, required: true}});
const emit = defineEmits(["select"]);
const briefWhole = ref(false);
const waitingOn = computed(() => props.task.waits.filter((wait) => !FINISHED_STATES.has(wait.state)));
const waitedOn = computed(() => props.task.waits.filter((wait) => FINISHED_STATES.has(wait.state)));
</script>

<template>
    <template v-if="waitingOn.length">
        <TaskWaitList title="Waits on" :waits="waitingOn" @select="emit('select', $event)" />
    </template>
    <template v-if="task.state === 'completed' && task.outcome">
        <section class="part" data-task-outcome>
            <h4>How it was done</h4>
            <p class="text">{{ task.outcome }}</p>
        </section>
    </template>
    <template v-if="task.brief">
        <section class="part" data-task-brief>
            <h4>The brief</h4>
            <p :class="['text', {clamped: !briefWhole}]">{{ task.brief }}</p>
            <template v-if="task.brief.length > LONG_BRIEF && !briefWhole">
                <button type="button" class="more" @click="briefWhole = true">Show the whole brief</button>
            </template>
        </section>
    </template>
    <template v-if="waitedOn.length">
        <TaskWaitList title="Waited on" :waits="waitedOn" @select="emit('select', $event)" />
    </template>
</template>

<style scoped>
.text {
    margin: 0;
    color: var(--text-2);
    white-space: pre-wrap;
    text-wrap: pretty;
}

.part {
    margin-bottom: 18px;
}

.part h4 {
    margin: 0 0 6px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 500;
}

.text.clamped {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.more {
    margin-top: 4px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font: 12px var(--font);
    cursor: pointer;
}

.more:hover {
    color: var(--text);
}

</style>
