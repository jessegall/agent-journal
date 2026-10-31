<script setup>
import {computed, ref, watch} from "vue";
import ChatDockCard from "../kit/ChatDock.vue";
import FoldSign from "../kit/FoldSign.vue";
import MarkIcon from "../kit/MarkIcon.vue";
import {DOCK_MOTION_MS} from "../kit/dockMotion.js";
import ChatDock from "./ChatDock.vue";
import RunChip from "./RunChip.vue";
import {useMeasuredHeight} from "../composables/measuredHeight.js";

// The runs docked above the chat: each its own card, and once they are `grouped`, one compact row with a chip per run, the cards shrinking
// into it and growing back out of it with the dock's height easing along. A click on the row's title opens every run's card, and a click
// on a chip opens that run's card, folds the others and keeps it
const props = defineProps({runs: {type: Array, required: true}, grouped: Boolean, folded: Boolean});
const open = ref(false);
const chosen = ref(0);
// the row stands for runs that are docked: with none left, there is nothing to fold
const row = computed(() => props.grouped && !open.value && props.runs.length > 0);
const content = ref(null);
const height = useMeasuredHeight(content);
const folding = ref(false);

watch(
    () => props.grouped,
    (grouped) => grouped || ((open.value = false), (chosen.value = 0))
);

function toggle() {
    chosen.value = 0;
    open.value = !open.value;
}

function choose(message) {
    chosen.value = message.id;
    open.value = true;
}

const foldedRun = (message) => props.folded || Boolean(chosen.value && chosen.value !== message.id);
</script>

<template>
    <div :class="['dock-group', {folding}]" :style="height === null ? null : {height: `${height}px`}">
        <div ref="content">
            <Transition :name="row ? 'runs-fold' : 'runs-unfold'" mode="out-in" @before-leave="folding = true" @after-enter="folding = false">
                <ChatDockCard v-if="row" key="row" :label="`${runs.length} runs`" kind="dock-group-row">
                    <template #head>
                        <button type="button" class="dock-group-toggle" aria-expanded="false" title="Show each run as its own card" @click="toggle">
                            <MarkIcon name="runs" />
                            {{ runs.length }} runs
                            <FoldSign />
                        </button>
                        <span class="dock-group-chips">
                            <template v-for="run in runs" :key="run.id">
                                <RunChip :message="run" @click="choose(run)" />
                            </template>
                        </span>
                    </template>
                </ChatDockCard>
                <div v-else key="cards" class="dock-group-cards">
                    <template v-if="grouped">
                        <div class="dock-group-head">
                            <button type="button" class="dock-group-toggle" aria-expanded="true" title="Fold the runs into one line" @click="toggle">
                                {{ runs.length }} runs
                                <FoldSign open />
                            </button>
                        </div>
                    </template>
                    <TransitionGroup name="dock" :duration="DOCK_MOTION_MS" appear>
                        <template v-for="run in runs" :key="run.id">
                            <ChatDock :message="run" :folded="foldedRun(run)" />
                        </template>
                    </TransitionGroup>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
/* the dock eases to the height of what it holds, the cards or the row, as they fold one into the other; it clips only while they do */
.dock-group {
    transition: height 0.3s var(--ease);
}

.dock-group.folding {
    overflow: hidden;
}

/* with no run docked it takes no room in the docks, nor their gap */
.dock-group:not(:has(.chat-dock)) {
    display: none;
}

/* folding, the cards shrink toward their chips and the row comes in from their size; opening, the row grows out into the cards */
.runs-fold-enter-active,
.runs-fold-leave-active,
.runs-unfold-enter-active,
.runs-unfold-leave-active {
    transform-origin: center bottom;
    transition:
        transform 0.15s var(--ease),
        opacity 0.15s ease;
}

.runs-fold-leave-to,
.runs-unfold-enter-from {
    opacity: 0;
    transform: scale(0.97, 0.6);
}

.runs-fold-enter-from,
.runs-unfold-leave-to {
    opacity: 0;
    transform: scale(1.03, 1.6);
}

.dock-group-cards {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.dock-group-toggle {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    height: 100%;
    margin-left: -12px;
    padding: 0 0 0 12px;
    border: 0;
    border-radius: 9px 0 0 9px;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
}

.dock-group-toggle :deep(.mark-icon) {
    color: var(--text-3);
}

.dock-group-toggle:hover .fold,
.dock-group-toggle:focus-visible .fold {
    color: var(--text-2);
}

.dock-group-toggle:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--accent-text) 70%, transparent);
    outline-offset: -2px;
}

.dock-group-chips {
    display: flex;
    flex: 1;
    gap: 4px;
    min-width: 0;
}

/* once open, a line naming how many runs there are folds them back into the row */
.dock-group-head {
    display: flex;
    align-items: center;
    height: 20px;
    margin-bottom: -2px;
}

.dock-group-head .dock-group-toggle {
    margin: 0;
    padding: 0 4px;
    border-radius: 5px;
    color: var(--text-3);
    font-size: 11.5px;
}

.dock-group-head .dock-group-toggle:hover {
    color: var(--text);
}

:global(html.phone .dock-group .chat-dock-head) {
    height: 44px;
    gap: 8px;
}

:global(html.phone .dock-group .dock-group-head) {
    height: 30px;
}

@media (prefers-reduced-motion: reduce) {
    .dock-group,
    .runs-fold-enter-active,
    .runs-fold-leave-active,
    .runs-unfold-enter-active,
    .runs-unfold-leave-active {
        transition: none;
    }
}
</style>
