<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import GraphNode from "../kit/GraphNode.vue";
import Spinner from "../kit/Spinner.vue";
import {api} from "../api/client.js";
import {usePoll} from "../poll.js";
import {follow} from "../composables/pointer.js";
import {peek, peekIn, route} from "../route.js";
import {SIZES, edgeLabel, edgePath, familyCounts, familyTree, live, nodeLook} from "../domain/family.js";

const EVERY = 5000;
const family = ref(null);
usePoll(
    "family",
    () => api.family(),
    EVERY,
    (got) => (family.value = got || {members: [], links: []})
);

const unfolded = ref(new Set());
const COMPACT = 520;
const room = ref(0);
const tree = computed(() =>
    family.value ? familyTree(family.value, unfolded.value, room.value && room.value < COMPACT ? SIZES.compact : SIZES.wide) : null
);
const counts = computed(() => (family.value ? familyCounts(family.value) : null));
const folds = computed(() => (tree.value ? tree.value.nodes.filter((n) => n.fold) : []));
const allOpen = computed(() => folds.value.length > 0 && folds.value.every((n) => n.fold.open));
const hovered = ref("");
const canvas = ref(null);
const root = ref(null);
const sizing = new ResizeObserver(([entry]) => (room.value = entry.contentRect.width));
onMounted(() => sizing.observe(root.value));
onUnmounted(() => sizing.disconnect());

const looks = computed(() => new Map((tree.value ? tree.value.nodes : []).map((n) => [n.id, nodeLook(n)])));
const touches = (edge) => hovered.value && (edge.from.id === hovered.value || edge.to.id === hovered.value);

function toggle(key) {
    const next = new Set(unfolded.value);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    unfolded.value = next;
}

function toggleAll() {
    unfolded.value = allOpen.value ? new Set() : new Set(folds.value.map((n) => n.fold.fold));
}

function openNode(node) {
    if (node.fold) return toggle(node.fold.fold);
    const m = node.member;
    if (!m.n) return;
    const sub = m.kind === "subagent" ? m.session : "";
    if (m.kind === "subagent" && !sub) return;
    if (m.environment === route.value.env) return peek("agent", m.n, 0, sub);
    peekIn(m.environment, "agent", m.n, sub);
}

function hint(node) {
    if (node.fold) return node.fold.open ? "Fold these back into one" : `Show ${node.fold.count} more: finished ones and quieter sessions`;
    const m = node.member;
    const said = [m.label, m.detail, m.status, m.loops ? `${m.loops} scheduled loop${m.loops === 1 ? "" : "s"}` : ""].filter(Boolean);
    return said.join(" · ");
}

const TREE_EDGES = ["started", "dispatched"];
const counted = (edge) => edge.said > 1 || (edge.said > 0 && TREE_EDGES.includes(edge.kind));
const labels = computed(() => (tree.value ? tree.value.edges.filter(counted).map((edge) => ({edge, at: edgeLabel(edge)})) : []));

const openable = (node) => !!node.fold || (!!node.member.n && (node.member.kind !== "subagent" || !!node.member.session));

function pan(e) {
    if (e.button || e.target.closest("button")) return;
    const el = canvas.value;
    const from = {x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop};
    follow(e, (ev) => {
        el.scrollLeft = from.left - (ev.clientX - from.x);
        el.scrollTop = from.top - (ev.clientY - from.y);
    });
}

const seen = ref(false);
watch(tree, async (drawn) => {
    if (seen.value || !drawn || !canvas.value) return;
    seen.value = true;
    const first = drawn.nodes.find((n) => n.member && live(n.member));
    if (!first) return;
    const above = drawn.edges.find((e) => e.to === first && e.kind !== "talk");
    const from = above ? above.from : first;
    await nextTick();
    const el = canvas.value;
    el.scrollTo({left: Math.max(0, from.x - 16), top: Math.max(0, first.y - el.clientHeight / 3)});
});
</script>

<template>
    <div ref="root" class="family">
        <template v-if="!tree">
            <div class="family-wait"><Spinner /></div>
        </template>
        <template v-else-if="!tree.nodes.length">
            <EmptyState title="No agents yet">
                Agents appear here once one runs, with the agents they start and the subagents they dispatch.
            </EmptyState>
        </template>
        <template v-else>
            <div class="family-head">
                <span class="family-count">
                    <template v-if="counts.live">
                        <b class="family-live">{{ counts.live }} running</b>
                        ·
                    </template>
                    {{ counts.agents }} agents · {{ counts.subagents }} subagents · {{ counts.messages }} messages
                </span>
                <span class="family-key">
                    <span class="key key-started">started</span>
                    <span class="key key-dispatched">dispatched</span>
                    <span class="key key-talk">messaged</span>
                </span>
                <template v-if="folds.length">
                    <Btn small @click="toggleAll">{{ allOpen ? "Fold them" : "Show all" }}</Btn>
                </template>
            </div>
            <div ref="canvas" class="family-canvas" @pointerdown="pan">
                <div class="family-stage" :style="{width: `${tree.width + 72}px`, height: `${tree.height}px`}">
                    <svg class="family-edges" :width="tree.width + 72" :height="tree.height" aria-hidden="true">
                        <template v-for="edge in tree.edges" :key="edge.id">
                            <path
                                :class="['edge', `edge-${edge.kind}`, {lit: touches(edge), dim: hovered && !touches(edge)}]"
                                :d="edgePath(edge)"
                            />
                        </template>
                        <template v-for="label in labels" :key="`n${label.edge.id}`">
                            <text :class="['edge-count', {lit: touches(label.edge), end: label.at.end}]" :x="label.at.x" :y="label.at.y">
                                {{ label.edge.said }}
                            </text>
                        </template>
                    </svg>
                    <template v-for="node in tree.nodes" :key="node.id">
                        <GraphNode
                            class="family-node"
                            :style="{left: `${node.x}px`, top: `${node.y}px`, width: `${node.w}px`, height: `${node.h}px`}"
                            :label="looks.get(node.id).label"
                            :note="looks.get(node.id).note"
                            :icon="looks.get(node.id).icon"
                            :state="looks.get(node.id).state"
                            :badge="node.member && node.member.loops ? String(node.member.loops) : ''"
                            badge-icon="loop"
                            :hint="hint(node)"
                            :live="!!node.member && live(node.member)"
                            :faded="!!node.member && ['stopped', 'done'].includes(node.member.status)"
                            :outside="!!node.member && node.member.kind === 'peer'"
                            :fold="!!node.fold"
                            :still="!openable(node)"
                            :lit="hovered === node.id"
                            @pointerenter="hovered = node.id"
                            @pointerleave="hovered = ''"
                            @click="openNode(node)"
                        />
                    </template>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.family {
    container-type: inline-size;
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.family-wait {
    flex: 1;
    display: grid;
    place-items: center;
}

.family-head {
    flex: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 14px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
    font-size: 11.5px;
    color: var(--text-3);
}

.family-count {
    flex: 1;
    min-width: 0;
}

.family-live {
    font-weight: 500;
    color: var(--progress);
}

.family-key {
    display: flex;
    align-items: center;
    gap: 12px;
}

.key {
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.key::before {
    content: "";
    width: 16px;
    border-top: 1.5px solid var(--text-3);
}

.key-started::before {
    border-top-width: 2px;
    border-top-color: var(--accent);
}

.key-dispatched::before {
    border-top-color: var(--text-4);
}

.key-talk::before {
    border-top-style: dashed;
    border-top-color: var(--tone-warn);
}

.family-canvas {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: auto;
    cursor: grab;
    touch-action: pan-x pan-y;
}

.family-canvas:active {
    cursor: grabbing;
}

.family-stage {
    position: relative;
}

.family-edges {
    position: absolute;
    inset: 0;
    overflow: visible;
}

.family-node {
    position: absolute;
}

.edge {
    fill: none;
    stroke: var(--border-3);
    stroke-width: 1.25;
    transition:
        opacity 0.15s,
        stroke 0.15s;
}

.edge-started {
    stroke: var(--accent);
    stroke-width: 2;
}

.edge-fold {
    stroke-dasharray: 2 3;
}

.edge-messaged,
.edge-talk {
    stroke: var(--tone-warn);
    stroke-dasharray: 4 4;
    opacity: 0.45;
}

.edge.lit {
    opacity: 0.9;
    stroke-width: 1.5;
}

.edge.dim {
    opacity: 0.12;
}

.edge-count {
    font-size: 10px;
    fill: color-mix(in srgb, var(--tone-warn) 70%, var(--text-3));
    text-anchor: middle;
}

.edge-count.end {
    text-anchor: end;
}

.edge-count.lit {
    fill: var(--text);
}

@container (max-width: 560px) {
    .family-key {
        display: none;
    }

    .family-head {
        flex-wrap: nowrap;
    }

    .family-count {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

@media (prefers-reduced-motion: reduce) {
    .edge {
        transition: none;
    }
}
</style>
