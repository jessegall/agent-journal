<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {CONTROLS, useDrag} from "./drag.js";
import {useTrap} from "../composables/trap.js";

const CLOSE_AT = 0.33;
const FLICK = 0.5;
const GROW_AT = 60;
const DAMPED = 0.2;
const OUT = 250;
const NUDGE_MS = 400;
const props = defineProps({
    label: {type: String, required: true},
    bodyDrag: {type: Boolean, default: true},
    tall: {type: Boolean, default: false},
    held: Boolean,
});
const emit = defineEmits(["close"]);
const sheet = ref(null);
const body = ref(null);
const pulled = ref(0);
const dragging = ref(false);
const leaving = ref(false);
const large = ref(false);
const room = ref(null);
const nudged = ref(false);

function fitted() {
    const view = window.visualViewport;
    if (!view) return;
    room.value = view.height < window.innerHeight - 1 ? {top: `${view.offsetTop}px`, height: `${view.height}px`, bottom: "auto"} : null;
}

onMounted(() => {
    window.visualViewport?.addEventListener("resize", fitted);
    window.visualViewport?.addEventListener("scroll", fitted);
    fitted();
});

onUnmounted(() => {
    window.visualViewport?.removeEventListener("resize", fitted);
    window.visualViewport?.removeEventListener("scroll", fitted);
});

const overflowing = () => body.value && body.value.scrollHeight > body.value.clientHeight + 1;
const shade = computed(() => (leaving.value ? 0 : Math.max(0, 1 - pulled.value / (sheet.value?.offsetHeight || 1))));

function close() {
    if (leaving.value) return;
    leaving.value = true;
    dragging.value = false;
    setTimeout(() => emit("close"), OUT);
}

useTrap(sheet, close);

function tapped() {
    if (!props.held) return close();
    nudged.value = true;
    setTimeout(() => (nudged.value = false), NUDGE_MS);
}

useDrag(sheet, {
    axis: "y",
    begin: (event) => {
        if (leaving.value) return null;
        const grabbed = Boolean(event.target.closest(".sheet-grab, .sheet-head")) && !event.target.closest(CONTROLS);
        if (!grabbed && event.target.closest(CONTROLS)) return null;
        return {grabbed};
    },
    accepts: (d, context) => {
        if (context.grabbed) return true;
        if (!props.bodyDrag) return false;
        const top = body.value.scrollTop <= 0;
        if (d > 0) return top;
        return top && !large.value && overflowing();
    },
    move: (d) => {
        dragging.value = true;
        pulled.value = d > 0 ? d : d * DAMPED;
    },
    end: (d, v) => {
        dragging.value = false;
        pulled.value = 0;
        if (d > 0 && (d > CLOSE_AT * sheet.value.offsetHeight || v > FLICK)) return close();
        if (d < 0 && (-d > GROW_AT || v < -FLICK) && overflowing()) large.value = true;
    },
});

defineExpose({close});
</script>

<template>
    <Teleport to="main.phone">
        <div :class="['sheet-root', {lifted: room}]" :style="room || undefined">
            <button type="button" class="sheet-backdrop" aria-hidden="true" tabindex="-1" :style="{opacity: shade}" @click="tapped" />
            <div
                ref="sheet"
                :class="['sheet', {large: large || tall, dragging, leaving, nudged}]"
                role="dialog"
                aria-modal="true"
                :aria-label="label"
                tabindex="-1"
                :style="{'--pulled': `${pulled}px`}"
            >
                <div class="sheet-grab"><span /></div>
                <template v-if="$slots.head">
                    <div class="sheet-head"><slot name="head" /></div>
                </template>
                <div ref="body" class="sheet-body">
                    <slot :close="close" />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.sheet-root {
    position: absolute;
    inset: 0;
    z-index: 20;
    display: flex;
    align-items: flex-end;
    max-width: none;
}

.sheet-backdrop {
    position: absolute;
    inset: 0;
    max-width: none;
    padding: 0;
    border: 0;
    background: var(--scrim);
    animation: sheet-fade 250ms linear;
    transition: opacity var(--sheet-out) linear;
}

.sheet {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: none;
    max-height: calc(100dvh * 0.5);
    padding-bottom: var(--safe-bottom);
    border-radius: 12px 12px 0 0;
    outline: none;
    background: var(--raised);
    transform: translateY(var(--pulled));
    transition: transform 300ms var(--push);
    animation: sheet-in var(--sheet-in) var(--push);
}

.sheet.nudged {
    animation: sheet-nudge 0.28s ease;
}

@keyframes sheet-nudge {
    40% {
        transform: translateY(-8px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .sheet.nudged {
        animation: none;
        outline: 2px solid var(--accent);
    }
}

.sheet-root.lifted .sheet {
    max-height: calc(100% - 12px);
}

.sheet.large {
    max-height: calc(100dvh * 0.92);
}

.sheet.dragging {
    transition: none;
    will-change: transform;
}

.sheet.leaving {
    transform: translateY(100%);
    transition: transform var(--sheet-out) var(--out);
}

.sheet-body > :slotted(*) {
    flex-shrink: 0;
}

.sheet-grab {
    display: flex;
    flex: none;
    justify-content: center;
    height: 20px;
    padding-top: 6px;
    touch-action: none;
}

.sheet-head {
    flex: none;
    padding: 0 var(--side) 8px;
    touch-action: none;
}

.sheet-grab span {
    width: 36px;
    height: 5px;
    border-radius: 2.5px;
    background: var(--text-4);
}

.sheet-body {
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 4px var(--side) 14px;
    overflow-y: auto;
    overscroll-behavior: contain;
}

@keyframes sheet-in {
    from {
        transform: translateY(100%);
    }
}

@keyframes sheet-fade {
    from {
        opacity: 0;
    }
}
</style>
