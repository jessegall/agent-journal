<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import {byRef} from "../domain/records.js";
import {chainOf, NODE, taskGraph} from "../domain/taskGraph.js";
import {STATUS_WORDS, statusOf, waitOf} from "../domain/taskBoard.js";
import {narrow} from "../platform/view.js";
import {taskBoard} from "../state/taskBoard.js";
import SwitchCase from "../kit/SwitchCase.vue";
import TaskGraphNode from "./TaskGraphNode.vue";
import TaskStatusIcon from "./TaskStatusIcon.vue";

const NARROW_WIDTH = 350;

const props = defineProps({tasks: {type: Array, required: true}});
const emit = defineEmits(["select", "answer", "list"]);
const graph = computed(() => taskGraph(props.tasks, {unfolded: taskBoard.unfolded, narrow: narrow.value ? NARROW_WIDTH : 0}));
const lit = ref(null);
const litKeys = computed(() => (lit.value ? chainOf(lit.value, graph.value.edges) : null));
const dim = (key) => litKeys.value && !litKeys.value.has(key);
const edgeDim = (e) => litKeys.value && !(litKeys.value.has(e.from) && litKeys.value.has(e.to));
const box = (p) => ({left: `${p.x}px`, top: `${p.y}px`, width: `${p.w}px`});
const foldBox = (p) => ({
    left: `${p.x + p.w / 2 - NODE.foldWidth / 2}px`,
    top: `${p.y + (NODE.height - NODE.foldHeight) / 2}px`,
    width: `${NODE.foldWidth}px`,
});
const reason = (t) => (waitOf(t)?.kind === "reason" ? t.block_reason : "");
const NODES = {
    task: ({task: t}) => ({
        status: statusOf(t),
        number: String(t.id),
        word: STATUS_WORDS[statusOf(t)],
        text: t.title,
        why: reason(t),
        selected: taskBoard.selected === t.id,
        open: () => emit("select", t.id),
    }),
    question: ({id}) => ({
        status: "asked",
        label: `Question ${id}`,
        word: "Not answered",
        text: byRef(`questions:${id}`)?.text || "",
        outside: true,
        open: () => emit("answer", id),
    }),
    command: ({id, owner}) => ({
        label: "Command",
        word: "Has not passed yet",
        text: byRef(`checks:${id}`)?.command || `Check ${id}`,
        mono: true,
        outside: true,
        open: () => emit("select", owner),
    }),
};
const nodeOf = (p) => ({...NODES[p.node.kind](p.node), place: box(p), dim: Boolean(dim(p.key))});
const foldWords = ({node}) => `${node.count} more tasks in between`;
const unfold = ({node}) => (taskBoard.unfolded[node.head] = true);
const others = computed(() => graph.value.others);
</script>

<template>
    <div class="task-graph">
        <template v-if="!graph.placed.length">
            <div class="empty">
                <TaskStatusIcon status="open" :size="24" />
                <h4>Nothing waits on anything</h4>
                <p>No task is blocked, and no question names a task.</p>
                <Btn @click="emit('list')">Back to the list</Btn>
            </div>
        </template>
        <template v-else>
            <p class="note">An arrow points from a task to what it waits on. Click a task to open it.</p>
            <div class="plane" :style="{width: `${graph.width}px`, height: `${graph.height}px`}" @mouseleave="lit = null">
                <svg class="edges" :width="graph.width" :height="graph.height">
                    <defs>
                        <marker
                            id="task-arrow"
                            viewBox="0 0 8 8"
                            refX="7"
                            refY="4"
                            markerWidth="7"
                            markerHeight="7"
                            orient="auto-start-reverse"
                        >
                            <path d="M0,0.8 L7.5,4 L0,7.2 z" />
                        </marker>
                    </defs>
                    <template v-for="e in graph.edges" :key="`${e.from}-${e.to}`">
                        <path :class="['edge', {dim: edgeDim(e), lit: litKeys && !edgeDim(e)}]" :d="e.d" marker-end="url(#task-arrow)" />
                    </template>
                </svg>
                <template v-for="p in graph.placed" :key="p.key">
                    <SwitchCase :value="p.node.kind">
                        <template #fold>
                            <button
                                type="button"
                                :class="['fold', {dim: dim(p.key)}]"
                                :style="foldBox(p)"
                                @mouseenter="lit = p.key"
                                @click="unfold(p)"
                            >
                                {{ foldWords(p) }}
                            </button>
                        </template>
                        <template #default>
                            <TaskGraphNode v-bind="nodeOf(p)" @mouseenter="lit = p.key" />
                        </template>
                    </SwitchCase>
                </template>
            </div>
            <template v-if="others > 0">
                <p class="foot">
                    {{ others }} other {{ others === 1 ? "task waits" : "tasks wait" }} on nothing, and nothing waits on
                    {{ others === 1 ? "it" : "them" }}. They are in the list.
                </p>
            </template>
        </template>
    </div>
</template>

<style scoped>
.task-graph {
    position: relative;
    flex: 1;
    min-width: 0;
    overflow: auto;
    scrollbar-width: thin;
}

.note {
    margin: 0;
    padding: 14px 20px 2px;
    color: var(--text-3);
    font-size: 12px;
}

.foot {
    margin: 0;
    padding: 4px 20px 18px;
    color: var(--text-4);
    font-size: 12px;
}

.plane {
    position: relative;
    margin: 10px 20px 14px;
}

.edges {
    position: absolute;
    top: 0;
    left: 0;
    overflow: visible;
    pointer-events: none;
}

.edges marker path {
    fill: var(--border-3);
}

.edge {
    fill: none;
    stroke: var(--border-3);
    stroke-width: 1.3;
    transition:
        opacity 0.15s ease,
        stroke 0.15s ease;
}

.edge.dim {
    opacity: 0.2;
}

.edge.lit {
    stroke: var(--text-3);
}

.fold {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    padding: 0 10px;
    border: 1px dashed var(--border-3);
    border-radius: 15px;
    background: var(--raised);
    color: var(--text-3);
    font: 12px var(--font);
    white-space: nowrap;
    cursor: pointer;
    transition:
        opacity 0.15s ease,
        border-color 0.12s ease,
        color 0.12s ease;
}

.fold:hover {
    border-color: var(--text-4);
    color: var(--text);
}

.dim {
    opacity: 0.35;
}

@media (prefers-reduced-motion: reduce) {
    .edge,
    .fold {
        transition: none;
    }
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
</style>
