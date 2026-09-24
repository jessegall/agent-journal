<script setup>
import Icon from "./Icon.vue";
import {follow} from "../composables/pointer.js";

const props = defineProps({
    x: {type: Number, required: true},
    y: {type: Number, required: true},
    w: {type: Number, required: true},
    h: {type: Number, required: true},
    title: {type: String, required: true},
    icon: {type: String, required: true},
    landing: Boolean,
    minimized: Boolean,
    colors: {type: Object, default: () => ({})},
});
const emit = defineEmits(["move", "size", "front", "dock", "menu", "minimize"]);

function drag(e) {
    if (e.button || e.target.closest("button")) return;
    e.preventDefault();
    const from = {px: e.clientX, py: e.clientY, x: props.x, y: props.y};
    follow(e, (ev) => emit("move", {x: from.x + ev.clientX - from.px, y: from.y + ev.clientY - from.py}));
}

function grow(e) {
    e.preventDefault();
    const from = {px: e.clientX, py: e.clientY, w: props.w, h: props.h};
    follow(e, (ev) => emit("size", {w: from.w + ev.clientX - from.px, h: from.h + ev.clientY - from.py}));
}
</script>

<template>
    <div
        :class="['float-window', {landing, minimized}]"
        :style="{left: `${x}px`, top: `${y}px`, width: `${w}px`, height: minimized ? 'auto' : `${h}px`, ...colors}"
        role="dialog"
        :aria-label="title"
        @pointerdown="emit('front')"
    >
        <div class="float-bar" @pointerdown="drag">
            <Icon :name="icon" :size="13" />
            <span class="float-title">{{ title }}</span>
            <span class="float-space" />
            <slot name="head" />
            <button
                type="button"
                class="float-btn"
                :title="minimized ? 'Show the whole window' : 'Show only this bar'"
                @click="emit('minimize', !minimized)"
            >
                <Icon :name="minimized ? 'window' : 'minimize'" />
            </button>
            <button type="button" class="float-btn float-menu-btn" title="Window menu" @click.stop="emit('menu', $event)">
                <Icon name="dots" />
            </button>
            <button type="button" class="float-btn" title="Dock it back into the layout" @click="emit('dock')">
                <Icon name="dock" />
            </button>
        </div>
        <div v-show="!minimized" class="float-body"><slot /></div>
        <template v-if="!minimized">
            <span class="float-grip" title="Resize" @pointerdown="grow" />
        </template>
    </div>
</template>

<style scoped>
.float-window {
    position: absolute;
    z-index: 20;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border-3);
    border-radius: 10px;
    background: var(--bg);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.5);
}

.float-window.landing {
    border-radius: 0;
    opacity: 0;
    pointer-events: none;
    transition:
        left 0.28s var(--ease),
        top 0.28s var(--ease),
        width 0.28s var(--ease),
        height 0.28s var(--ease),
        border-radius 0.28s,
        opacity 0.16s ease 0.14s;
}

.float-bar {
    flex: none;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 34px;
    padding: 0 5px 0 12px;
    border-bottom: 1px solid var(--border);
    background: #111215;
    font-size: 12px;
    color: var(--text);
    cursor: grab;
    touch-action: none;
}

.float-window.minimized .float-bar {
    border-bottom: none;
}

.float-space {
    flex: 1;
}

.float-btn {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s;
}

.float-btn :deep(.ico) {
    color: inherit;
}

.float-btn:hover {
    background: var(--hover);
    color: var(--text);
}

.float-body {
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.float-grip {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 3;
    width: 14px;
    height: 14px;
    cursor: nwse-resize;
    touch-action: none;
    background: linear-gradient(
        135deg,
        transparent 55%,
        var(--border-3) 55%,
        var(--border-3) 61%,
        transparent 61%,
        transparent 72%,
        var(--border-3) 72%,
        var(--border-3) 78%,
        transparent 78%
    );
}

@media (prefers-reduced-motion: reduce) {
    .float-window.landing {
        transition: none;
    }
}
</style>
