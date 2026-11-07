<script setup>
import {computed, onMounted, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import {layoutOf} from "../domain/flowchart.js";

const props = defineProps({title: {type: String, required: true}, edges: {type: Array, required: true}});
const emit = defineEmits(["close"]);
const chart = computed(() => layoutOf(props.edges));

// the view onto the drawing: how far it is zoomed and where its top left corner sits in the frame, fitted to the whole chart on opening
const ZOOM = {least: 0.2, most: 4, step: 1.2};
const frame = ref(null);
const view = ref({zoom: 1, x: 0, y: 0});
let dragging = null;

function fit() {
    const box = frame.value?.getBoundingClientRect();
    if (!box?.width) return;
    const zoom = Math.min(box.width / chart.value.width, box.height / chart.value.height, 1.5);
    view.value = {zoom, x: (box.width - chart.value.width * zoom) / 2, y: (box.height - chart.value.height * zoom) / 2};
}

function zoomAt(factor, cx, cy) {
    const {zoom, x, y} = view.value;
    const next = Math.min(ZOOM.most, Math.max(ZOOM.least, zoom * factor));
    view.value = {zoom: next, x: cx - ((cx - x) * next) / zoom, y: cy - ((cy - y) * next) / zoom};
}

function zoomCentre(factor) {
    const box = frame.value.getBoundingClientRect();
    zoomAt(factor, box.width / 2, box.height / 2);
}

function wheel(event) {
    const box = frame.value.getBoundingClientRect();
    if (event.ctrlKey || event.metaKey) zoomAt(event.deltaY < 0 ? ZOOM.step : 1 / ZOOM.step, event.clientX - box.left, event.clientY - box.top);
    else view.value = {...view.value, x: view.value.x - event.deltaX, y: view.value.y - event.deltaY};
}

function grab(event) {
    event.preventDefault();
    window.getSelection()?.removeAllRanges();
    dragging = {x: event.clientX - view.value.x, y: event.clientY - view.value.y};
    frame.value.setPointerCapture?.(event.pointerId);
}

function drag(event) {
    if (dragging) view.value = {...view.value, x: event.clientX - dragging.x, y: event.clientY - dragging.y};
}

onMounted(fit);
</script>

<template>
    <Dialog :title="title" large @close="emit('close')">
        <div class="flowchart-tools">
            <Btn small @click="zoomCentre(ZOOM.step)">Zoom in</Btn>
            <Btn small @click="zoomCentre(1 / ZOOM.step)">Zoom out</Btn>
            <Btn small @click="fit">Fit the whole chart</Btn>
        </div>
        <div ref="frame" class="flowchart-frame" @wheel.prevent="wheel" @pointerdown="grab" @pointermove="drag" @pointerup="dragging = null" @pointercancel="dragging = null">
            <svg class="flowchart" :width="chart.width" :height="chart.height" :viewBox="`0 0 ${chart.width} ${chart.height}`" role="img" :aria-label="title" :style="{transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`}">
                <defs>
                    <marker id="flowchart-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                        <path d="M0 0L10 5L0 10z" />
                    </marker>
                </defs>
                <template v-for="(arrow, index) in chart.arrows" :key="`arrow-${index}`">
                    <path class="flowchart-arrow" :d="arrow.path" marker-end="url(#flowchart-head)" />
                </template>
                <template v-for="node in chart.nodes" :key="node.name">
                    <g class="flowchart-node">
                        <rect :x="node.x" :y="node.y" :width="node.width" :height="node.height" rx="8" />
                        <text :x="node.x + node.width / 2" :y="node.y + node.padY + node.line / 2">
                            <template v-for="(line, index) in node.lines" :key="index">
                                <tspan :x="node.x + node.width / 2" :dy="index ? node.line : 0">{{ line }}</tspan>
                            </template>
                        </text>
                    </g>
                </template>
                <template v-for="(arrow, index) in chart.arrows" :key="`label-${index}`">
                    <template v-if="arrow.label">
                        <g class="flowchart-label">
                            <rect :x="arrow.label.x" :y="arrow.label.y" :width="arrow.label.width" :height="arrow.label.height" rx="4" />
                            <text :x="arrow.label.x + arrow.label.width / 2" :y="arrow.label.y + arrow.label.pad + arrow.label.line / 2">
                                <template v-for="(line, row) in arrow.label.lines" :key="row">
                                    <tspan :x="arrow.label.x + arrow.label.width / 2" :dy="row ? arrow.label.line : 0">{{ line }}</tspan>
                                </template>
                            </text>
                        </g>
                    </template>
                </template>
            </svg>
        </div>
    </Dialog>
</template>

<style scoped>
.flowchart-tools {
    display: flex;
    flex-shrink: 0;
    gap: 6px;
    margin-bottom: 8px;
}

.flowchart-frame {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg);
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
}

.flowchart-frame:active {
    cursor: grabbing;
}

.flowchart {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0;
}

.flowchart-arrow {
    fill: none;
    stroke: var(--text-3);
    stroke-width: 1.5;
}

#flowchart-head {
    fill: var(--text-3);
}

.flowchart-node rect {
    fill: var(--raised);
    stroke: var(--border-3);
}

.flowchart-node text {
    fill: var(--text);
    font-size: 13px;
    text-anchor: middle;
    dominant-baseline: middle;
}

.flowchart-label rect {
    fill: var(--bg);
    stroke: var(--border);
}

.flowchart-label text {
    fill: var(--text-2);
    font-size: 11px;
    text-anchor: middle;
    dominant-baseline: middle;
}
</style>
