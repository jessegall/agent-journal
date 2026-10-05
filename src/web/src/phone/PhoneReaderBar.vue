<script setup>
import Icon from "../kit/Icon.vue";
import {SIZE_NAMES, SIZES} from "./readerChoices.js";

defineProps({
    back: {type: String, required: true},
    title: {type: String, default: ""},
    titled: {type: Boolean, default: false},
    under: {type: Boolean, default: false},
    progress: {type: Number, default: 0},
    shareable: {type: Boolean, default: false},
});
const size = defineModel("size", {type: Number, default: 0});
const emit = defineEmits(["close", "share"]);
</script>

<template>
    <header :class="['reader-bar', {under}]">
        <button type="button" class="reader-back" :aria-label="`Back to ${back}`" @click="emit('close')">
            <Icon name="chevronRight" bold facing="left" :size="18" />
            {{ back }}
        </button>
        <span :class="['reader-name', {visible: titled}]" aria-hidden="true">{{ title }}</span>
        <template v-if="shareable">
            <button type="button" class="reader-share" aria-label="Share" @click="emit('share')"><Icon name="share" :size="20" /></button>
        </template>
        <button type="button" class="reader-size" :aria-label="`Text size, ${SIZE_NAMES[size]}`" @click="size = (size + 1) % SIZES.length">
            Aa
            <span class="reader-steps">
                <template v-for="(step, i) in SIZES" :key="step">
                    <span :class="['reader-step', {on: i === size}]" />
                </template>
            </span>
        </button>
        <span class="reader-progress" :style="{width: `${progress * 100}%`}" />
    </header>
</template>

<style scoped>
.reader-bar {
    position: relative;
    display: flex;
    flex: none;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 44px;
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 0 8px;
    border-bottom: 1px solid transparent;
    transition: border-color 200ms linear;
}

.reader-bar.under {
    border-bottom-color: var(--line);
}

.reader-back,
.reader-size {
    display: flex;
    flex: none;
    align-items: center;
    gap: 2px;
    min-height: 44px;
    min-width: 44px;
    padding: 0 6px;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 1rem;
}

.reader-size {
    justify-content: flex-end;
}

.reader-share {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
}

.reader-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text);
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 200ms linear;
}

.reader-name.visible {
    opacity: 1;
}

.reader-progress {
    position: absolute;
    left: 0;
    bottom: -1px;
    height: 2px;
    background: var(--accent);
}

.reader-steps {
    display: inline-flex;
    gap: 3px;
    margin-left: 6px;
    vertical-align: middle;
}

.reader-step {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--text-4);
}

.reader-step.on {
    background: var(--accent);
}
</style>
