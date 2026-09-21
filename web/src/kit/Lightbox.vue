<script setup>
import {computed, onMounted, onUnmounted} from "vue";
import Icon from "./Icon.vue";
import {lightbox} from "../platform/view.js";

const shown = computed(() => lightbox.pictures[lightbox.at] || null);
const close = () => (lightbox.at = -1);
const step = (by) => (lightbox.at = (lightbox.at + by + lightbox.pictures.length) % lightbox.pictures.length);

function keys(e) {
    if (lightbox.at < 0) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
}

onMounted(() => window.addEventListener("keydown", keys));
onUnmounted(() => window.removeEventListener("keydown", keys));
</script>

<template>
    <template v-if="shown">
        <div class="lightbox" @click.self="close">
            <template v-if="lightbox.pictures.length > 1">
                <button type="button" class="lightbox-step prev" title="Previous" @click="step(-1)"><Icon name="arrow" /></button>
                <button type="button" class="lightbox-step next" title="Next" @click="step(1)"><Icon name="arrow" /></button>
            </template>
            <img class="lightbox-image" :src="shown.url" :alt="shown.name" />
            <div class="lightbox-foot">
                <span class="lightbox-name">{{ shown.name }}</span>
                <template v-if="lightbox.pictures.length > 1">
                    <span class="lightbox-count">{{ lightbox.at + 1 }} of {{ lightbox.pictures.length }}</span>
                </template>
                <a class="lightbox-open" :href="shown.url" target="_blank">Open the file</a>
                <button type="button" class="lightbox-x" title="Close" @click="close"><Icon name="close" /></button>
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

.lightbox-image {
    max-width: 92vw;
    max-height: 84vh;
    border-radius: 8px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
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

.lightbox-open {
    color: var(--accent-text);
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
