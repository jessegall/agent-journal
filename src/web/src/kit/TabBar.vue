<script setup>
import {onMounted, onUnmounted, ref} from "vue";

defineProps({tabs: {type: Array, required: true}});
const chosen = defineModel({type: String, required: true});
const strip = ref(null);
const more = ref(false);
const measure = () => strip.value && (more.value = strip.value.scrollWidth - strip.value.scrollLeft - strip.value.clientWidth > 1);
const watcher = new ResizeObserver(measure);
onMounted(() => watcher.observe(strip.value));
onUnmounted(() => watcher.disconnect());
</script>

<template>
    <div ref="strip" :class="['tabs', {more}]" role="tablist" @scroll="measure">
        <template v-for="tab in tabs" :key="tab.key">
            <button
                type="button"
                role="tab"
                :aria-selected="chosen === tab.key"
                :class="['tab', {on: chosen === tab.key}]"
                :title="tab.title"
                @click="chosen = tab.key"
            >
                <span class="tab-name">{{ tab.title }}</span>
                <template v-if="tab.count !== undefined">
                    <span class="tab-n">{{ tab.count }}</span>
                </template>
            </button>
        </template>
        <slot />
    </div>
</template>

<style scoped>
.tabs {
    display: flex;
    align-items: stretch;
    gap: 14px;
    overflow-x: auto;
}

.tabs.more {
    -webkit-mask-image: linear-gradient(90deg, #000 85%, transparent);
    mask-image: linear-gradient(90deg, #000 85%, transparent);
}

.tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: none;
    padding: 0;
    border: 0;
    border-bottom: 2px solid transparent;
    background: none;
    color: var(--text-3);
    font-size: 11.5px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    cursor: pointer;
}

.tab-name {
    max-width: 22ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tab:hover {
    color: var(--text-2);
}

.tab.on {
    border-bottom-color: var(--accent);
    color: var(--text);
}

.tab-n {
    font-size: 11px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.tab.on .tab-n {
    color: var(--accent-text);
}
</style>
