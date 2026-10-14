<script setup>
import Btn from "../kit/Btn.vue";
import Segmented from "../kit/Segmented.vue";
import ReadingLine from "./ReadingLine.vue";

defineProps({
    title: {type: String, required: true},
    tabbed: {type: Boolean, default: false},
    tabOptions: {type: Array, required: true},
    tab: {type: String, default: ""},
    summary: {type: Object, required: true},
});
const emit = defineEmits(["cancel", "tab"]);
</script>

<template>
    <div class="head">
        <span class="head-title">
            New work
            <span class="head-board">{{ title }}</span>
        </span>
        <Btn small @click="emit('cancel')">Cancel</Btn>
    </div>
    <div class="sub">
        <Transition name="layer">
            <template v-if="tabbed">
                <div key="tabs" class="sub-layer">
                    <Segmented fill :options="tabOptions" :value="tab" @pick="(key) => emit('tab', key)" />
                </div>
            </template>
            <template v-else>
                <div key="reading" class="sub-layer">
                    <ReadingLine :summary="summary" />
                </div>
            </template>
        </Transition>
    </div>
    <p class="announce" aria-live="polite">{{ summary.text }}</p>
</template>

<style scoped>
.head {
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
    height: 52px;
    padding: 0 8px 0 16px;
    border-bottom: 1px solid var(--border);
    box-sizing: border-box;
}

.head-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.head-board {
    margin-left: 6px;
    color: var(--text-4);
    font-weight: 400;
}

.sub {
    position: relative;
    flex: none;
    height: 49px;
    border-bottom: 1px solid var(--border);
    box-sizing: border-box;
}

.sub-layer {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    padding: 0 16px;
}

.tabs .sub-layer:has(.segmented) {
    padding: 0 6px;
}

.announce {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    overflow: hidden;
    clip-path: inset(50%);
}

/* The fixed rows swap by crossfade: out 120ms, in 180ms starting 60ms later, 3px of travel. */
.layer-enter-active {
    transition:
        opacity 0.18s ease-out 0.06s,
        transform 0.18s var(--ease) 0.06s;
}

.layer-leave-active {
    transition:
        opacity 0.12s ease-in,
        transform 0.12s ease-in;
}

.layer-enter-from {
    opacity: 0;
    transform: translateY(3px);
}

.layer-leave-to {
    opacity: 0;
    transform: translateY(-3px);
}

.phone .head > :deep(.btn) {
    min-height: 40px;
}

@media (prefers-reduced-motion: reduce) {
    .layer-enter-active,
    .layer-leave-active {
        transition-duration: 0.12s;
        transition-delay: 0s;
    }
}
</style>
