<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import {STATUS_WORDS, statusOf} from "../domain/taskBoard.js";
import {counted} from "../format/number.js";
import {taskBoard} from "../state/taskBoard.js";
import TaskDraft from "./TaskDraft.vue";
import TaskRow from "./TaskRow.vue";
import TaskStatusIcon from "./TaskStatusIcon.vue";

const props = defineProps({lines: {type: Array, required: true}, tasks: {type: Array, required: true}});
const emit = defineEmits(["select", "act", "status", "more", "file", "new", "clear"]);
const hiddenDone = computed(() =>
    taskBoard.statuses.length || taskBoard.display.showDone || taskBoard.words
        ? 0
        : props.tasks.filter((t) => statusOf(t) === "done").length
);
const missing = computed(() => {
    const kinds = taskBoard.statuses.map((s) => STATUS_WORDS[s].toLowerCase()).join(" or ");
    return `No ${kinds ? `${kinds} ` : ""}tasks${taskBoard.words ? ` match “${taskBoard.words}”` : ""}`;
});
const fold = (key) => (taskBoard.folded[key] = !taskBoard.folded[key]);
</script>

<template>
    <div class="task-list">
        <Transition name="draft">
            <template v-if="taskBoard.draft">
                <TaskDraft @file="emit('file', $event)" @cancel="taskBoard.draft = null" />
            </template>
        </Transition>
        <template v-if="!tasks.length && !taskBoard.draft">
            <div class="empty">
                <TaskStatusIcon status="open" :size="24" />
                <h4>No tasks yet</h4>
                <p>The agent files a task when it takes on a piece of work. You can file one here too.</p>
                <Btn kind="primary" @click="emit('new')">New task</Btn>
            </div>
        </template>
        <template v-else-if="tasks.length && !lines.length">
            <div class="empty">
                <TaskStatusIcon :status="taskBoard.statuses[0] || 'open'" :size="24" />
                <h4>{{ missing }}</h4>
                <p>Nothing in the list fits the filter right now.</p>
                <Btn @click="emit('clear')">Clear the filter</Btn>
            </div>
        </template>
        <TransitionGroup name="line" tag="div" class="lines">
            <template v-for="line in lines" :key="line.key">
                <template v-if="line.type === 'head'">
                    <div :class="['head', `depth-${line.depth}`, {folded: taskBoard.folded[line.key]}]" @click="fold(line.key)">
                        <span class="caret">▼</span>
                        <template v-if="line.status">
                            <TaskStatusIcon :status="line.status" />
                        </template>
                        <template v-if="line.number">
                            <span class="number">{{ line.number }}</span>
                        </template>
                        <span class="label">{{ line.label }}</span>
                        <span class="note">{{ line.note }}</span>
                    </div>
                </template>
                <template v-else>
                    <TaskRow
                        :task="line.task"
                        :depth="line.depth"
                        :selected="taskBoard.selected === line.task.id"
                        @select="emit('select', line.task.id)"
                        @act="emit('act', line.task, $event)"
                        @status="emit('status', line.task, $event)"
                        @more="emit('more', line.task, $event)"
                    />
                </template>
            </template>
        </TransitionGroup>
        <template v-if="hiddenDone && lines.length">
            <p class="hidden-done">
                {{ counted(hiddenDone, "done task") }} {{ hiddenDone === 1 ? "is" : "are" }} hidden.
                <button type="button" @click="taskBoard.display.showDone = true">Show them</button>
            </p>
        </template>
    </div>
</template>

<style scoped>
.task-list {
    flex: 1;
    min-width: 0;
    overflow: auto;
    padding: 4px 0 14px;
    scrollbar-width: thin;
}

.lines {
    position: relative;
}

.head {
    position: sticky;
    top: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 34px;
    margin-top: 6px;
    padding: 0 16px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    user-select: none;
}

.head:first-child {
    margin-top: 0;
}

.head.depth-1 {
    position: static;
    height: 28px;
    margin-top: 0;
    padding-left: 34px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 400;
}

.head:hover {
    color: var(--text);
}

.caret {
    display: inline-block;
    width: 10px;
    color: var(--text-4);
    font-size: 8px;
    transition: transform 0.12s ease;
}

.folded .caret {
    transform: rotate(-90deg);
}

.number {
    color: var(--text-4);
    font-weight: 400;
}

.note {
    margin-left: auto;
    color: var(--text-4);
    font-size: 12px;
    font-weight: 400;
    white-space: nowrap;
}

.hidden-done {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 10px 16px 0;
    color: var(--text-4);
    font-size: 12px;
}

.hidden-done button {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    cursor: pointer;
}

.hidden-done button:hover {
    color: var(--text);
}

.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 100%;
    padding: 40px;
    text-align: center;
}

.empty h4 {
    margin: 8px 0 0;
    font-size: 14px;
    font-weight: 600;
}

.empty p {
    max-width: 300px;
    margin: 0 0 10px;
    color: var(--text-3);
    font-size: 12.5px;
}

.line-move {
    transition: transform 0.24s var(--ease);
}

.line-enter-active {
    transition:
        opacity 0.26s var(--ease) 0.06s,
        transform 0.26s var(--ease) 0.06s;
}

.line-enter-from {
    opacity: 0;
    transform: translateY(-6px);
}

.draft-enter-active,
.draft-leave-active {
    transition:
        opacity 0.2s var(--ease),
        transform 0.2s var(--ease);
}

.draft-enter-from,
.draft-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
    .line-move,
    .line-enter-active,
    .draft-enter-active,
    .draft-leave-active {
        transition: none;
    }
}
</style>
