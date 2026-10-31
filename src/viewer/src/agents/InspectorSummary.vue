<script setup>
import {ref} from "vue";
import InspectorPop from "./InspectorPop.vue";
import TaskStatusIcon from "../tasks/TaskStatusIcon.vue";
import {render} from "../text/index.js";
import "../text/all.js";
import {route} from "../route.js";

defineProps({
    name: {type: String, required: true},
    state: {type: Object, required: true},
    moves: {type: Array, default: () => []},
    facts: {type: Array, default: () => []},
    parts: {type: Array, default: () => []},
    env: {type: String, default: ""},
});
const open = ref({key: "", anchor: null});
const toggle = (key, event) => (open.value = open.value.key === key ? {key: "", anchor: null} : {key, anchor: event.currentTarget});
const close = () => (open.value = {key: "", anchor: null});
</script>

<template>
    <div class="summary">
        <div class="stamp"><slot name="stamp" /></div>
        <h3 class="title">{{ name }}</h3>
        <div class="state-line">
            <span class="state">
                <TaskStatusIcon :status="state.icon" />
                {{ state.word }}
            </span>
            <template v-if="state.since">
                <span class="since">{{ state.since }}</span>
            </template>
            <template v-if="moves.length">
                <button type="button" :class="['link', {on: open.key === 'history'}]" data-open="history" @click="toggle('history', $event)">History</button>
            </template>
        </div>
        <div class="quiet">
            <template v-for="fact in facts" :key="fact">
                <span>{{ fact }}</span>
            </template>
            <template v-for="part in parts" :key="part.key">
                <span>
                    <template v-if="part.text">
                        <button type="button" :class="['link', {on: open.key === part.key}]" :data-open="part.key" @click="toggle(part.key, $event)">{{ part.title }}</button>
                    </template>
                    <template v-else>
                        <span class="dim">{{ part.none }}</span>
                    </template>
                </span>
            </template>
        </div>
        <template v-if="open.key === 'history'">
            <InspectorPop :anchor="open.anchor" title="History" :width="260" @close="close">
                <template v-for="(move, i) in moves" :key="i">
                    <div :class="['move', move.at]">
                        <span class="time">{{ move.time }}</span>
                        <span>{{ move.word }}</span>
                    </div>
                </template>
            </InspectorPop>
        </template>
        <template v-for="part in parts" :key="part.key">
            <template v-if="open.key === part.key">
                <InspectorPop :anchor="open.anchor" :title="part.title" :sub="part.sub" @close="close">
                    <div class="text" v-html="render(part.text, {types: [], env: env || route.env})" />
                </InspectorPop>
            </template>
        </template>
    </div>
</template>

<style scoped>
.summary {
    flex: none;
    padding: 4px 24px 22px;
}

.stamp {
    color: var(--text-3);
    font-size: 12px;
}

.title {
    margin: 4px 0 10px;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.3;
}

.state-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
}

.state {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--text);
    font-size: 12.5px;
}

.since {
    color: var(--text-3);
    font-size: 12px;
}

.state-line .link {
    margin-left: 4px;
}

.quiet {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 0;
    margin-top: 10px;
    color: var(--text-3);
    font-size: 12px;
}

.quiet > span + span::before {
    content: "·";
    margin: 0 9px;
    color: var(--text-4);
}

.link {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font: 12px var(--font);
    text-decoration: underline;
    text-decoration-color: var(--border-3);
    text-underline-offset: 3px;
    cursor: pointer;
}

.link:hover,
.link.on {
    color: var(--text);
    text-decoration-color: var(--text-3);
}

.dim {
    color: var(--text-4);
}

.move {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 8px;
    padding: 3px 0;
    color: var(--text-2);
    font-size: 12.5px;
}

.move .time {
    color: var(--text-4);
    font: 11.5px var(--mono);
    padding-top: 1px;
}

.move.now {
    color: var(--text);
}

.move.later {
    color: var(--text-4);
}

.text {
    max-width: 512px;
    color: var(--text-2);
    overflow-wrap: anywhere;
    text-wrap: pretty;
}

.text :deep(p) {
    margin: 0 0 8px;
}

.text :deep(p:last-child) {
    margin-bottom: 0;
}
</style>
