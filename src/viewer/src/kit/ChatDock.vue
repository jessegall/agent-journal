<script>
export const DOCK_ARRIVAL_MS = 700;
</script>

<script setup>
import {onBeforeUnmount, onMounted, ref} from "vue";
import {useMeasuredHeight} from "../composables/measuredHeight.js";

defineProps({label: {type: String, default: ""}, folded: Boolean, lifted: Boolean, kind: {type: String, default: ""}});
const card = ref(null);
const content = ref(null);
const height = useMeasuredHeight(content);
// a card that is still arriving takes its fold at once: its size only eases once it has come in, so an arrival never makes the chat jump
const settled = ref(false);
let settling = 0;
onMounted(() => (settling = setTimeout(() => (settled.value = true), DOCK_ARRIVAL_MS)));
onBeforeUnmount(() => clearTimeout(settling));
defineExpose({card});
</script>

<template>
    <div :class="['chat-dock', {lifted}]">
        <div class="chat-dock-fold">
            <section ref="card" :class="['chat-dock-card', kind]" :aria-label="label">
                <slot name="edge" />
                <header class="chat-dock-head">
                    <slot name="head" />
                </header>
                <div :class="['chat-dock-body', {folded, settled}]">
                    <div class="chat-dock-inner">
                        <div :class="['chat-dock-grow', {settled}]" :style="height === null ? null : {height: `${height}px`}">
                            <div ref="content">
                                <slot />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
.chat-dock {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: minmax(0, 1fr);
    flex: none;
    width: 100%;
}

/* the fold holds the card, whose inside top edge carries the closing line; pointing at it pauses a card's closing line (chat/DockLeave.vue) */
.chat-dock-fold {
    position: relative;
    min-width: 0;
    min-height: 0;
}

.chat-dock-fold:hover {
    --leave-play: paused;
}

.chat-dock-card {
    position: relative;
    container-type: inline-size;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    overflow: hidden;
}

.chat-dock-head {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
    height: 36px;
    padding: 0 6px 0 12px;
    white-space: nowrap;
}

.chat-dock-body {
    display: grid;
    grid-template-rows: 1fr;
}

.chat-dock-body.settled {
    transition:
        grid-template-rows var(--move),
        opacity var(--fade);
}

.chat-dock-body.folded {
    grid-template-rows: 0fr;
    opacity: 0;
}

.chat-dock-inner {
    min-height: 0;
    overflow: hidden;
}

.chat-dock-grow {
    overflow: hidden;
}

.chat-dock-grow.settled {
    transition: height var(--move);
}

/* a dock comes in two steps, the chat easing up to make room and then the card sliding in, and goes in the same two the other way, the
   card sliding out and then the chat easing down into its space; the whole of each lasts under DOCK_ARRIVAL_MS */
.chat-dock.dock-enter-active {
    transition: grid-template-rows 0.4s ease-in-out;
}

.chat-dock.dock-enter-active .chat-dock-card {
    transition:
        transform 0.32s var(--ease) 0.36s,
        opacity 0.28s ease 0.36s;
}

.chat-dock.dock-leave-active {
    transition: grid-template-rows 0.42s ease-in-out 0.26s;
}

.chat-dock.dock-leave-active .chat-dock-card {
    transition:
        transform 0.26s ease-in,
        opacity 0.22s ease-in;
}

.chat-dock.dock-enter-active .chat-dock-fold,
.chat-dock.dock-leave-active .chat-dock-fold {
    overflow: hidden;
}

.chat-dock.dock-enter-from,
.chat-dock.dock-leave-to {
    grid-template-rows: 0fr;
}

.chat-dock.dock-enter-from .chat-dock-card,
.chat-dock.dock-leave-to .chat-dock-card {
    transform: translateY(14px);
    opacity: 0;
}

/* a card the journal docked by itself closes when its line has run down: it fades and sinks a little */
.chat-dock.timed.dock-leave-active .chat-dock-card {
    transition:
        transform 0.3s var(--ease),
        opacity 0.3s ease;
}

.chat-dock.timed.dock-leave-to .chat-dock-card {
    transform: translateY(6px);
}

.chat-dock.lifted .chat-dock-card {
    visibility: hidden;
}

@container (max-width: 420px) {
    .chat-dock-head {
        flex-wrap: wrap;
        height: auto;
        min-height: 36px;
        padding-block: 6px;
    }

    .chat-dock-head :slotted(.dock-title) {
        flex: 1;
    }

    .chat-dock-head :slotted(.chat-dock-acts) {
        order: 1;
        flex-basis: 100%;
        margin-left: 0;
        justify-content: flex-end;
    }
}

@media (prefers-reduced-motion: reduce) {
    .chat-dock.dock-enter-active,
    .chat-dock.dock-leave-active,
    .chat-dock.dock-enter-active .chat-dock-card,
    .chat-dock.dock-leave-active .chat-dock-card,
    .chat-dock-body.settled,
    .chat-dock-grow.settled {
        transition: none;
    }
}
</style>
