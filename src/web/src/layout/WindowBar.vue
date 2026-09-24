<script setup>
import Icon from "../kit/Icon.vue";
import {pageTitle} from "../composables/pageTitle.js";
import {armed, drawnWide, switching} from "../platform/fullscreen.js";

const back = () => history.back();
const forward = () => history.forward();
</script>

<template>
    <nav :class="['window-bar', {open: drawnWide, fading: switching}]" :aria-hidden="!drawnWide">
        <button type="button" class="window-bar-btn" title="Back" :tabindex="drawnWide ? 0 : -1" @click="back">
            <Icon name="back" :size="13" />
        </button>
        <button type="button" class="window-bar-btn" title="Forward" :tabindex="drawnWide ? 0 : -1" @click="forward">
            <Icon name="arrow" :size="13" />
        </button>
        <span class="window-bar-title">{{ pageTitle }}</span>
        <template v-if="armed">
            <span class="window-bar-hint">Click anywhere to go full screen again</span>
        </template>
    </nav>
</template>

<style scoped>
.window-bar {
    flex: none;
    display: flex;
    align-items: center;
    gap: 2px;
    height: 0;
    padding: 0 8px;
    overflow: hidden;
    border-bottom: 0 solid var(--border);
    background: var(--side);
    transition: height 0.26s var(--ease);
}

.window-bar.open {
    height: 28px;
    border-bottom-width: 1px;
}

.window-bar-btn {
    display: grid;
    place-items: center;
    width: 24px;
    height: 20px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.window-bar-btn:hover {
    background: var(--hover);
    color: var(--text);
}

.window-bar-title {
    margin-left: 6px;
    color: var(--text-3);
    font-size: 11.5px;
}

.window-bar-hint {
    margin-left: auto;
    padding-right: 4px;
    color: var(--text-4);
    font-size: 11px;
}

@media (prefers-reduced-motion: no-preference) {
    .window-bar > * {
        transition: opacity 0.12s ease-out;
    }

    .window-bar.fading > * {
        opacity: 0;
        transition: opacity 0.08s ease-in;
    }
}
</style>
