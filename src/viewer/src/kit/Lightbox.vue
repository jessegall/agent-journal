<script setup>
import {useWindowEvent} from "../composables/windowEvent.js";
import {computed} from "vue";
import FileView from "./FileView.vue";
import Icon from "./Icon.vue";
import {ui} from "../state/ui.js";

const file = computed(() => ui.lightbox.files[ui.lightbox.at] || null);
const close = () => (ui.lightbox.at = -1);
const step = (by) => (ui.lightbox.at = (ui.lightbox.at + by + ui.lightbox.files.length) % ui.lightbox.files.length);

function keys(e) {
    if (ui.lightbox.at < 0) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
}

useWindowEvent("keydown", keys);
</script>

<template>
    <template v-if="file">
        <div class="lightbox" @click.self="close">
            <template v-if="ui.lightbox.files.length > 1">
                <button type="button" class="lightbox-step prev" title="Previous" @click="step(-1)"><Icon name="arrow" /></button>
                <button type="button" class="lightbox-step next" title="Next" @click="step(1)"><Icon name="arrow" /></button>
            </template>
            <div class="lightbox-file">
                <FileView :key="file.url" :name="file.name" :url="file.url" />
            </div>
            <div class="lightbox-foot">
                <span class="lightbox-name">{{ file.name }}</span>
                <template v-if="ui.lightbox.files.length > 1">
                    <span class="lightbox-count">{{ ui.lightbox.at + 1 }} of {{ ui.lightbox.files.length }}</span>
                </template>
                <button type="button" class="lightbox-x" aria-label="Close" @click="close"><Icon name="close" /></button>
            </div>
        </div>
    </template>
</template>

<style scoped>
.lightbox {
    position: fixed;
    inset: 0;
    z-index: 80;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: rgba(0, 0, 0, 0.82);
}

.lightbox-file {
    display: flex;
    justify-content: center;
    width: min(92vw, 1100px);
    height: 84vh;
}

.lightbox-file .file-view {
    width: 100%;
    height: 100%;
}

.lightbox-foot {
    display: flex;
    align-items: center;
    gap: 14px;
    color: var(--text-2);
    font-size: 12px;
}

.lightbox-count {
    color: var(--text-3);
}

.lightbox-name {
    overflow: hidden;
    color: var(--text-2);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.lightbox-x {
    display: inline-flex;
    padding: 4px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.lightbox-x:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text);
}

.lightbox-step {
    position: absolute;
    top: 50%;
    display: inline-flex;
    padding: 10px;
    border: 1px solid var(--border-2);
    border-radius: 50%;
    background: var(--raised);
    color: var(--text-2);
    cursor: pointer;
    transform: translateY(-50%);
}

.lightbox-step.prev {
    left: 24px;
    transform: translateY(-50%) rotate(180deg);
}

.lightbox-step.next {
    right: 24px;
}

.lightbox-step:hover {
    color: var(--text);
}
</style>
