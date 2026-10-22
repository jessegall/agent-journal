<script setup>
import {computed, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import Comments from "../resource/Comments.vue";
import CommentWrite from "../resource/CommentWrite.vue";
import Links from "../resource/Links.vue";
import TaskLogs from "../resource/TaskLogs.vue";
import TaskWork from "../resource/TaskWork.vue";
import {planOf} from "../domain/records.js";
import {updatedAt} from "../domain/row.js";
import {nextAct, otherActs, statusOf} from "../domain/taskBoard.js";
import {ago} from "../format/time.js";
import TaskChain from "./TaskChain.vue";
import TaskFact from "./TaskFact.vue";
import TaskState from "./TaskState.vue";

const props = defineProps({
    task: {type: Object, required: true},
    tasks: {type: Array, required: true},
    single: Boolean,
    back: {type: String, default: "list"},
});
const emit = defineEmits(["close", "step", "act", "status", "more", "select", "answer"]);
const status = computed(() => statusOf(props.task));
const next = computed(() => nextAct(props.task));
const others = computed(() => otherActs(props.task));
const plan = computed(() => planOf(props.task));
const phases = computed(() => plan.value?.phases || []);
const phase = computed(() => phases.value.findIndex((p) => p.task_ids.includes(props.task.id)) + 1);
const crumb = computed(() => {
    if (!plan.value) return "Not in a plan";
    return phases.value.length > 1 && phase.value
        ? `Plan ${plan.value.id} › Phase ${phase.value}: ${phases.value[phase.value - 1].title}`
        : `Plan ${plan.value.id}: ${plan.value.title}`;
});
const briefWhole = ref(false);
const LONG_BRIEF = 180;
watch(
    () => props.task.id,
    () => (briefWhole.value = false)
);
</script>

<template>
    <aside :class="['task-inspector', {single}]">
        <div class="top">
            <template v-if="single">
                <Btn small @click="emit('close')">
                    <Icon name="back" :size="12" />
                    Back to the {{ back }}
                </Btn>
            </template>
            <template v-else>
                <span class="crumb">{{ crumb }}</span>
            </template>
            <span class="grow" />
            <Btn small title="Previous task (K)" @click="emit('step', -1)"><Icon name="up" :size="13" /></Btn>
            <Btn small title="Next task (J)" @click="emit('step', 1)"><Icon name="down" :size="13" /></Btn>
            <template v-if="!single">
                <Btn small title="Close the task (Esc)" @click="emit('close')"><Icon name="close" :size="13" /></Btn>
            </template>
        </div>
        <Transition name="swap" mode="out-in">
            <div :key="task.id" class="body">
                <div class="stamp">Task {{ task.id }} · updated {{ ago(updatedAt(task)) || "just now" }}</div>
                <h3 class="title">{{ task.title }}</h3>
                <TaskState
                    :task="task"
                    :tasks="tasks"
                    @status="emit('status', $event)"
                    @select="emit('select', $event)"
                    @answer="emit('answer', $event)"
                />
                <div class="facts">
                    <TaskFact class="wide" label="Plan">{{ plan ? `Plan ${plan.id}: ${plan.title}` : "Not in a plan" }}</TaskFact>
                    <template v-if="phases.length > 1 && phase">
                        <TaskFact label="Phase">{{ phase }} of {{ phases.length }}: {{ phases[phase - 1].title }}</TaskFact>
                    </template>
                    <template v-if="task.state === 'started' && task.held_by">
                        <TaskFact label="Held by">{{ task.held_by }}</TaskFact>
                    </template>
                </div>
                <template v-if="status !== 'blocked'">
                    <TaskChain :task="task" :tasks="tasks" @select="emit('select', $event)" @answer="emit('answer', $event)" />
                </template>
                <template v-if="status === 'done' && task.outcome">
                    <section class="part">
                        <h4>How it was done</h4>
                        <p class="text">{{ task.outcome }}</p>
                    </section>
                </template>
                <template v-if="task.brief">
                    <section class="part">
                        <h4>The brief</h4>
                        <p :class="['text', {clamped: !briefWhole}]">{{ task.brief }}</p>
                        <template v-if="task.brief.length > LONG_BRIEF && !briefWhole">
                            <button type="button" class="more" @click="briefWhole = true">Show the whole brief</button>
                        </template>
                    </section>
                </template>
                <TaskWork :task="task" />
                <TaskLogs :task="task" />
                <Links :resource="task" />
                <Comments :resource="task" :compose="false" />
            </div>
        </Transition>
        <div class="dock">
            <Btn kind="primary" @click="emit('act', next.name)">{{ next.label }}</Btn>
            <template v-for="o in others" :key="o.name">
                <Btn @click="emit('act', o.name)">{{ o.label }}</Btn>
            </template>
            <Btn title="More (.)" @click="emit('more', $event.currentTarget)">More</Btn>
        </div>
        <div class="write">
            <CommentWrite :key="task.id" :resource="task" />
        </div>
    </aside>
</template>

<style scoped>
.task-inspector {
    display: flex;
    flex: none;
    flex-direction: column;
    width: 440px;
    min-height: 0;
    border-left: 1px solid var(--border);
}

.write {
    flex: none;
    padding: 0 16px;
    border-top: 1px solid var(--border);
}

.write :deep(.comment-write) {
    margin-top: 0;
}

.task-inspector.single {
    width: 100%;
    border-left: 0;
}

.top {
    display: flex;
    flex: none;
    align-items: center;
    gap: 4px;
    height: 44px;
    padding: 0 8px 0 20px;
    border-bottom: 1px solid var(--border);
    color: var(--text-3);
    font-size: 12px;
}

.single .top {
    padding-left: 8px;
}

.crumb {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.grow {
    flex: 1;
}

.body {
    flex: 1;
    overflow: auto;
    padding: 18px 20px 28px;
    scrollbar-width: thin;
}

.stamp {
    color: var(--text-3);
    font-size: 12px;
}

.title {
    margin: 6px 0 14px;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.3;
    text-wrap: pretty;
}

.facts {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 12px 20px;
    margin-bottom: 18px;
}

.facts .wide {
    grid-column: 1 / -1;
}

.dock {
    display: flex;
    flex: none;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border-top: 1px solid var(--border);
    background: var(--raised);
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

.text {
    margin: 0;
    color: var(--text-2);
    white-space: pre-wrap;
    text-wrap: pretty;
}

.text.clamped {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.note {
    margin: 6px 0 0;
    color: var(--text-3);
    font-size: 12px;
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

.swap-enter-active {
    transition:
        opacity 0.16s var(--ease),
        transform 0.16s var(--ease);
}

.swap-enter-from {
    opacity: 0.35;
    transform: translateY(3px);
}

@media (prefers-reduced-motion: reduce) {
    .swap-enter-active {
        transition: none;
    }
}
</style>
