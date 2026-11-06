<script setup>
import {computed, ref, watch} from "vue";
import {chainAround} from "../domain/taskChain.js";
import {statusIcon} from "../domain/taskStatus.js";
import TaskChainLink from "./TaskChainLink.vue";

// the chain of tasks around one task, as version 4 drew it: the nearest task on each side, and the whole chain on request
const props = defineProps({task: {type: Object, required: true}, graph: {type: Object, required: true}});
const emit = defineEmits(["select"]);
const whole = ref(false);
watch(() => props.task.id, () => (whole.value = false));
const chain = computed(() => chainAround(props.task.id, props.graph));
const above = computed(() => (whole.value ? chain.value.above : chain.value.above.slice(-1)));
const below = computed(() => (whole.value ? chain.value.below : chain.value.below.slice(0, 1)));
const hidden = computed(() => chain.value.above.slice(0, -1).flat().length + chain.value.below.slice(1).length);
const word = (state) => state.slice(0, 1).toUpperCase() + state.slice(1);
const link = (task, current = false) => ({status: statusIcon(task.state), number: task.id, title: task.title, word: current ? "This task" : word(task.state), current});
</script>

<template>
    <template v-if="chain.above.length || chain.below.length">
        <section class="task-chain" data-task-chain>
            <h4>What waits on what</h4>
            <template v-for="level in above" :key="level.map((task) => task.id).join()">
                <div class="level">
                    <template v-for="waiting in level" :key="waiting.id">
                        <TaskChainLink v-bind="link(waiting)" @select="emit('select', $event)" />
                    </template>
                </div>
                <div class="waits">↓ waits on</div>
            </template>
            <TaskChainLink v-bind="link(task, true)" />
            <template v-for="blocker in below" :key="blocker.id">
                <div class="waits">↓ waits on</div>
                <TaskChainLink v-bind="link(blocker)" @select="emit('select', $event)" />
            </template>
            <template v-if="hidden">
                <button type="button" class="more" data-task-chain-more @click="whole = !whole">{{ whole ? "Show less" : `Show the whole chain (${hidden} more)` }}</button>
            </template>
        </section>
    </template>
</template>

<style scoped>
.task-chain {
    margin-bottom: 18px;
}
h4 {
    margin: 0 0 6px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 500;
}
.level {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.waits {
    display: flex;
    align-items: center;
    height: 24px;
    padding-left: 13px;
    color: var(--text-4);
    font-size: 11.5px;
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
