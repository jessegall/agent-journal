<script setup>
import {computed, ref, watch} from "vue";
import {byRef} from "../domain/records.js";
import {chainAround} from "../domain/taskGraph.js";
import {STATUS_PREFIXES, statusOf, waitOf} from "../domain/taskBoard.js";
import {counted} from "../format/number.js";
import TaskChainLink from "./TaskChainLink.vue";

const props = defineProps({task: {type: Object, required: true}, tasks: {type: Array, required: true}});
const emit = defineEmits(["select", "answer"]);
const whole = ref(false);
watch(
    () => props.task.id,
    () => (whole.value = false)
);
const chain = computed(() => chainAround(props.task, props.tasks));
const above = computed(() => (whole.value ? chain.value.above : chain.value.above.slice(-1)));
const below = computed(() => (whole.value ? chain.value.below : chain.value.below.slice(0, 1)));
const hidden = computed(() => chain.value.above.slice(0, -1).flat().length + chain.value.below.slice(1).length);
const wait = computed(() => waitOf(props.task));
const NOTES = {
    task: (w) => `Opens again by itself once task ${w.id} is done.`,
    question: () => "Opens again by itself once you answer it.",
    command: (w) => {
        const check = byRef(`checks:${w.id}`);
        return check
            ? `The journal runs the command every ${counted(check.interval, "minute")} and opens the task the first time it passes.`
            : "";
    },
};
const note = computed(() => (wait.value && NOTES[wait.value.kind] ? NOTES[wait.value.kind](wait.value) : ""));
const why = computed(() => (wait.value && wait.value.kind !== "reason" ? wait.value.why : ""));
const taskLink = (t) => ({
    status: statusOf(t),
    number: String(t.id),
    title: t.title,
    word: STATUS_PREFIXES[statusOf(t)],
    open: () => emit("select", t.id),
});
const LINKS = {
    task: (target) => taskLink(target.task),
    question: (target) => ({
        status: "asked",
        number: `Q${target.id}`,
        title: byRef(`questions:${target.id}`)?.text || "",
        word: "Not answered",
        outside: true,
        open: () => emit("answer", target.id),
    }),
    command: (target) => ({
        title: byRef(`checks:${target.id}`)?.command || `Check ${target.id}`,
        word: "Has not passed yet",
        outside: true,
        still: true,
    }),
};
const linkOf = (target) => LINKS[target.kind](target);
const here = computed(() => ({...taskLink(props.task), word: "This task", current: true}));
</script>

<template>
    <template v-if="chain.above.length || chain.below.length">
        <section class="task-chain">
            <h4>What waits on what</h4>
            <template v-for="level in above" :key="level.map((t) => t.id).join()">
                <div class="level">
                    <template v-for="t in level" :key="t.id">
                        <TaskChainLink v-bind="taskLink(t)" />
                    </template>
                </div>
                <div class="waits">↓ waits on</div>
            </template>
            <TaskChainLink v-bind="here" />
            <template v-for="target in below" :key="target.key">
                <div class="waits">↓ waits on</div>
                <TaskChainLink v-bind="linkOf(target)" />
            </template>
            <template v-if="hidden">
                <button type="button" class="more" @click="whole = !whole">
                    {{ whole ? "Show less" : `Show the whole chain (${hidden} more)` }}
                </button>
            </template>
            <template v-if="why">
                <p class="note">Why: {{ why }}</p>
            </template>
            <template v-if="note">
                <p class="note">{{ note }}</p>
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

.note {
    margin: 6px 0 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
