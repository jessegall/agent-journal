<script>
export const DOCK_ARRIVAL_MS = 700;
</script>

<script setup>
import {onBeforeUnmount, onMounted, ref} from "vue";
import {useMeasuredHeight} from "../composables/measuredHeight.js";

defineProps({label: {type: String, default: ""}, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: {type: String, default: ""}});
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
    <div :class="['chat-dock', {lifted, collapsed}]">
        <div class="chat-dock-fold">
            <section ref="card" :class="['chat-dock-card', type]" :aria-label="label">
                <slot name="edge" />
                <header class="chat-dock-head">
                    <slot name="head" />
                </header>
                <div :class="['chat-dock-body', {folded, settled, body}]">
                    <div class="chat-dock-inner">
                        <div :class="['chat-dock-grow', {settled}]" :style="height === null ? null : {height: `${height}px`}">
                            <div ref="content">
                                <slot />
                            </div>
                        </div>
                    </div>
                </div>
                <slot name="still" />
                <footer class="chat-dock-foot"><slot name="foot" /></footer>
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
    border-top: 1px solid var(--border);
    background: var(--raised);
}

.chat-dock-head {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    height: 28px;
    margin-top: 5px;
    padding: 0 14px;
    white-space: nowrap;
}

.chat-dock-body {
    display: grid;
    grid-template-rows: 1fr;
}

.chat-dock-body.settled {
    transition:
        grid-template-rows 320ms var(--ease),
        opacity 220ms var(--ease);
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
    transition: height 320ms var(--ease);
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

.chat-dock-card.waiting {
    position: relative;
    overflow: hidden;
}

.chat-dock-card.waiting::before {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    left: 0;
    height: 2px;
    background: var(--tone-warn);
    content: "";
}
.chat-dock-card.waiting :deep(.dock-facts) {
    color: var(--text-2);
}
.chat-dock-body.body:not(.folded) {
    margin: 3px 0 6px;
    border-block: 1px solid var(--border-inner);
}
.chat-dock.collapsed { cursor: pointer; }
.chat-dock.collapsed .chat-dock-body {
    grid-template-rows: 0fr;
    margin: 0;
    border-block: 0;
    opacity: 0;
}
.chat-dock.collapsed .chat-dock-foot {
    max-height: 0;
    min-height: 0;
    margin-bottom: 0;
    overflow: hidden;
    opacity: 0;
}
.chat-dock.collapsed :deep(.dock-failure) { display: none; }
.chat-dock.collapsed .chat-dock-head { margin-top: 0; }
.chat-dock.collapsed .chat-dock-card.waiting::before {
    display: none;
}

.chat-dock-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 4px 6px;
    min-height: 24px;
    max-height: 72px;
    margin-bottom: 7px;
    padding: 0 14px 0 36px;
    transition:
        max-height 320ms var(--ease),
        min-height 320ms var(--ease),
        margin-bottom 320ms var(--ease),
        opacity 220ms var(--ease);
}
@container (max-width: 480px) {
    .chat-dock-foot :deep(.btn) {
        padding: 0 7px;
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
