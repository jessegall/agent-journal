<script setup>
import {CARD, KIND, PORT_AT, placeholderOf, portWord, STOPS_WHY, stopsTheWalk, WORD} from "../domain/chartCard.js";
import {messageShown} from "../domain/cardTitle.js";
import {LOCK_WHY} from "../domain/workflowLocks.js";
import Icon from "../kit/Icon.vue";

defineProps({
    node: {type: Object, required: true},
    entry: {type: Object, required: true},
    title: {type: String, required: true},
    height: {type: Number, required: true},
    ports: {type: Array, required: true},
    selected: {type: Boolean, default: false},
    target: {type: Boolean, default: false},
    lit: {type: Boolean, default: false},
    drawing: {type: Boolean, default: false},
    note: {type: String, default: ""},
    waiting: {type: String, default: ""},
    counted: {type: String, default: ""},
    read: {type: String, default: ""},
});
const emit = defineEmits(["drag", "remove", "open-message", "select", "text", "port-down", "port-enter", "port-leave"]);
</script>

<template>
    <div
        :data-node="node.id"
        :class="[
            'chart-node',
            node.kind,
            {
                selected,
                target,
                lit,
                end: node.key === 'stop_here',
                locked: node.locked,
            },
        ]"
        :style="{
            left: `${node.x}px`,
            top: `${node.y}px`,
            width: `${CARD.width}px`,
            height: `${height}px`,
        }"
        @pointerdown="emit('drag', $event)"
    >
        <div class="chart-node-kind">
            <span :class="['chart-glyph', node.kind]" />
            <span>{{ KIND[node.kind] }}</span>
            <template v-if="node.locked">
                <Icon name="lock" :size="11" class="chart-node-lock" :title="LOCK_WHY" />
            </template>
            <template v-if="stopsTheWalk(node)">
                <span class="chart-node-stops" :title="STOPS_WHY">stops the later ones</span>
            </template>
            <template v-if="waiting">
                <span class="chart-node-waiting" title="An agent's last walk of this workflow stopped here">
                    {{ waiting }}
                </span>
            </template>
            <template v-if="node.kind === 'check' && counted">
                <span class="chart-node-count">
                    {{ counted }}
                </span>
            </template>
            <template v-if="lit && read">
                <span class="chart-node-read">
                    {{ read }}
                </span>
            </template>
            <template v-if="selected && !node.locked">
                <button type="button" class="chart-node-x" title="Delete node" @pointerdown.stop @click.stop="emit('remove')">
                    <Icon name="close" :size="12" />
                </button>
            </template>
        </div>
        <div class="chart-node-title" :title="entry.about">
            {{ title }}
        </div>
        <template v-if="note">
            <div class="chart-node-note">
                {{ note }}
            </div>
        </template>
        <template v-if="entry.takes_text">
            <template v-if="node.kind === 'action'">
                <button
                    type="button"
                    :class="['chart-node-text', {empty: !node.text}]"
                    :disabled="node.locked"
                    :title="node.locked ? LOCK_WHY : 'Click to write the message'"
                    @pointerdown.stop
                    @click.stop="emit('open-message')"
                >
                    {{ node.text ? messageShown(node.text) : placeholderOf(node) }}
                </button>
            </template>
            <template v-else>
                <input
                    class="chart-node-text"
                    :value="node.text"
                    :placeholder="placeholderOf(node)"
                    :disabled="node.locked"
                    :title="node.locked ? LOCK_WHY : null"
                    @pointerdown.stop
                    @focus="emit('select')"
                    @input="emit('text', $event.target.value)"
                />
            </template>
        </template>
        <template v-if="node.kind !== 'trigger'">
            <span :class="['chart-in', {ready: target}]" />
        </template>
        <template v-for="p in ports" :key="p.port">
            <span
                :class="[
                    'chart-port',
                    p.port,
                    {
                        on: p.on,
                        hover: p.hover && !drawing,
                        dragging: p.dragging,
                    },
                ]"
                :style="{left: `${PORT_AT[p.port]}%`}"
                :title="`Drag to connect the ${WORD[p.port]} output${p.on ? '' : '. Not connected: the workflow ends here'}`"
                @pointerdown="emit('port-down', p.port, $event)"
                @pointerenter="emit('port-enter', p.port)"
                @pointerleave="emit('port-leave')"
            >
                <template v-if="p.hover && !drawing && !p.on">
                    <Icon name="plus" :size="11" />
                </template>
            </span>
            <template v-if="p.port !== 'then'">
                <span :class="['chart-port-word', p.port, {on: p.on || p.dragging}]" :style="{left: `${PORT_AT[p.port]}%`}">
                    {{ portWord(node, p.port) }}
                </span>
            </template>
        </template>
    </div>
</template>

<style scoped>
.chart-node-count {
    min-width: 0;
    overflow: hidden;
    color: var(--text-2);
    font-size: 10.5px;
    letter-spacing: 0;
    text-transform: none;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.chart-node-lock {
    flex: none;
    color: var(--text-3);
}

.chart-node-stops {
    margin-left: 6px;
    padding: 0 5px;
    border-radius: 4px;
    background: color-mix(in srgb, var(--tone-warn) 16%, transparent);
    color: var(--tone-warn);
    font-size: 10px;
    line-height: 15px;
    text-transform: none;
    white-space: nowrap;
}

.chart-node-read {
    margin-left: auto;
    color: var(--accent);
    font-size: 10.5px;
    white-space: nowrap;
}

.chart-node.locked .chart-node-text:disabled {
    opacity: 0.8;
    cursor: not-allowed;
}

.chart-node.end {
    border-bottom-width: 3px;
    border-bottom-color: var(--text-3);
}

.chart-node.lit {
    border-color: var(--tone-good);
    box-shadow: 0 0 0 1px var(--tone-good);
}

.chart-node {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 7px 12px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    cursor: grab;
}

.chart-node.selected,
.chart-node.target {
    border-color: var(--border-3);
    background: var(--hover);
}

.chart-node-kind {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 14px;
    color: var(--text-3);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.chart-node-x {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin: -3px -6px 0 auto;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.chart-node-x:hover {
    background: var(--hover);
    color: var(--text);
}

.chart-node-title {
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
    line-height: 18px;
    overflow-wrap: anywhere;
}

.chart-node-note {
    color: var(--text-3);
    font-size: 11px;
    line-height: 16px;
}

.chart-node-text {
    width: 100%;
    margin-top: 5px;
    padding: 5px 8px;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg-2);
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    line-height: 16px;
    outline: none;
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: text;
}

button.chart-node-text {
    white-space: normal;
}

.chart-node-text.empty {
    color: var(--text-4);
}

button.chart-node-text:hover {
    border-color: var(--border-3);
    color: var(--text);
}

.chart-node-text::placeholder {
    color: var(--text-4);
}

.chart-node-text:focus {
    border-color: var(--accent);
    color: var(--text);
}

.chart-glyph {
    display: inline-block;
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--text-3);
}

.chart-glyph.check {
    width: 6px;
    height: 6px;
    margin: 0 0.5px;
    border-radius: 1px;
    transform: rotate(45deg);
}

.chart-glyph.action {
    width: 6px;
    height: 6px;
    margin: 0 0.5px;
    border-radius: 1.5px;
}

.chart-in,
.chart-port {
    position: absolute;
    width: 12px;
    height: 12px;
    margin-left: -6px;
    border: 1.5px solid var(--border-3);
    border-radius: 50%;
    background: var(--bg-2);
}

.chart-in {
    top: -6.5px;
    left: 50%;
}

.chart-in.ready {
    top: -8.5px;
    width: 16px;
    height: 16px;
    margin-left: -8px;
    border-color: var(--accent-text);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent);
}

.chart-port {
    bottom: -6.5px;
    cursor: crosshair;
    --c: var(--text-3);
}

.chart-port.no {
    --c: var(--danger-soft);
}

.chart-port.on {
    border-color: var(--c);
    background: var(--c);
}

.chart-port.hover {
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: -9.5px;
    width: 18px;
    height: 18px;
    margin-left: -9px;
    border-color: var(--accent-text);
    background: var(--raised);
    color: var(--accent-text);
}

.chart-port.hover.on {
    background: var(--c);
    border-color: var(--c);
}

.chart-port.dragging {
    border-color: var(--accent-text);
    background: var(--accent-text);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent);
}

.chart-port-word {
    position: absolute;
    top: calc(100% + 6px);
    color: var(--text-4);
    font-size: 10.5px;
    line-height: 1;
    pointer-events: none;
}

.chart-port-word.no {
    transform: translateX(10px);
}

.chart-port-word.on.no {
    color: var(--danger-soft);
}
</style>
