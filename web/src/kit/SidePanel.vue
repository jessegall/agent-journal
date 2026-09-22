<script setup>
import Icon from "./Icon.vue";
import {closing} from "./closing.js";

defineProps({title: String, abstract: String});
const emit = defineEmits(["close"]);
const {shown, close, closed} = closing(emit);
</script>

<template>
    <Transition name="side" appear @after-leave="closed">
        <div v-if="shown" class="veil" @click.self="close">
            <aside class="panel" role="dialog" :aria-label="title">
                <header class="head">
                    <div class="names">
                        <h2>{{ title }}</h2>
                        <template v-if="abstract">
                            <p class="abstract">{{ abstract }}</p>
                        </template>
                    </div>
                    <slot name="actions" />
                    <button type="button" class="close" title="Close" @click="close"><Icon name="close" /></button>
                </header>
                <div class="body">
                    <slot />
                </div>
            </aside>
        </div>
    </Transition>
</template>

<style scoped>
.veil {
    position: fixed;
    inset: 0;
    z-index: 40;
    background: color-mix(in srgb, #000 35%, transparent);
}

.panel {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    width: min(520px, 100vw);
    border-left: 1px solid var(--border);
    background: var(--bg);
    box-shadow: -16px 0 40px color-mix(in srgb, #000 30%, transparent);
}

.side-enter-active,
.side-leave-active,
.side-enter-active .panel,
.side-leave-active .panel {
    transition:
        opacity 0.2s ease,
        transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.side-enter-from,
.side-leave-to {
    opacity: 0;
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
