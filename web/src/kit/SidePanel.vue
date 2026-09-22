<script setup>
import TextDisplay from "./TextDisplay.vue";
import Icon from "./Icon.vue";
import {closing} from "./closing.js";

const props = defineProps({
    title: {type: String, default: ""},
    abstract: {type: String, default: ""},
    width: {type: String, default: "normal"},
    open: {type: Boolean, default: null},
    depth: {type: Number, default: 0},
    over: {type: Boolean, default: false},
});
const emit = defineEmits(["close", "dismiss"]);
const {shown, close, closed} = closing(emit, props);
</script>

<template>
    <Transition name="side" appear @after-leave="closed">
        <div v-if="shown" :class="['veil', {over, under: depth}]" :style="{'--depth': depth, zIndex: 40 - depth}" @click.self="close">
            <aside :class="['panel', width]" role="dialog" :aria-label="title">
                <template v-if="title">
                    <header class="head">
                        <div class="names">
                            <h2>{{ title }}</h2>
                            <template v-if="abstract">
                                <TextDisplay class="abstract" :text="abstract" />
                            </template>
                        </div>
                        <slot name="actions" />
                        <button type="button" class="close" title="Close" @click="close"><Icon name="close" /></button>
                    </header>
                    <div class="body">
                        <slot />
                    </div>
                </template>
                <template v-else>
                    <slot />
                </template>
            </aside>
        </div>
    </Transition>
</template>

<style scoped>
.veil {
    position: fixed;
    inset: 0;
    z-index: 40;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(3px);
}

.veil.over {
    background: transparent;
    backdrop-filter: none;
}

.veil.under {
    pointer-events: none;
}

.veil.under .panel {
    filter: brightness(0.8);
    transform: translateX(calc(var(--depth) * -28px));
}

.panel {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    width: min(480px, 100vw);
    border-left: 1px solid var(--border);
    background: var(--bg);
    box-shadow: -20px 0 50px rgba(0, 0, 0, 0.4);
    transition:
        width 0.26s cubic-bezier(0.2, 0.8, 0.2, 1),
        transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
        filter 0.28s ease;
}

.panel.wide {
    width: min(760px, 100vw);
}

.panel.page {
    width: min(1180px, 68%);
    overflow: auto;
}

.side-enter-active,
.side-leave-active {
    transition:
        background 0.24s ease,
        backdrop-filter 0.24s ease;
}

.side-enter-active .panel,
.side-leave-active .panel {
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.side-enter-from,
.side-leave-to {
    background: transparent;
    backdrop-filter: blur(0);
}

.side-enter-from .panel,
.side-leave-to .panel {
    transform: translateX(100%);
}

.head {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 18px 18px 14px 22px;
    border-bottom: 1px solid var(--border);
}

.names {
    flex: 1;
    min-width: 0;
}

h2 {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
}

.abstract {
    margin: 0;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.45;
}

.close {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.close:hover {
    background: var(--hover);
    color: var(--text);
}

.body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 22px 28px;
}
</style>
