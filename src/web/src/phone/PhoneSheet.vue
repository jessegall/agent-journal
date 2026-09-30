<script setup>
import {computed, ref} from "vue";
import {CONTROLS, useDrag} from "./drag.js";
import {useTrap} from "./trap.js";

const CLOSE_AT = 0.33;
const FLICK = 0.5;
const GROW_AT = 60;
const DAMPED = 0.2;
const OUT = 250;
defineProps({label: {type: String, required: true}});
const emit = defineEmits(["close"]);
const sheet = ref(null);
const body = ref(null);
const pulled = ref(0);
const dragging = ref(false);
const leaving = ref(false);
const large = ref(false);

const overflowing = () => body.value && body.value.scrollHeight > body.value.clientHeight + 1;
const shade = computed(() => (leaving.value ? 0 : Math.max(0, 1 - pulled.value / (sheet.value?.offsetHeight || 1))));

function close() {
    if (leaving.value) return;
    leaving.value = true;
    dragging.value = false;
    setTimeout(() => emit("close"), OUT);
}

useTrap(sheet, close);

useDrag(sheet, {
    axis: "y",
    begin: (event) => {
        if (leaving.value) return null;
        const grabbed = Boolean(event.target.closest(".sheet-grab"));
        if (!grabbed && event.target.closest(CONTROLS)) return null;
        return {grabbed};
    },
    accepts: (d, context) => {
        if (context.grabbed) return true;
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
    <div class="sheet-root">
        <button type="button" class="sheet-backdrop" aria-hidden="true" tabindex="-1" :style="{opacity: shade}" @click="close" />
        <div
            ref="sheet"
            :class="['sheet', {large, dragging, leaving}]"
            role="dialog"
            aria-modal="true"
            :aria-label="label"
            tabindex="-1"
            :style="{'--pulled': `${pulled}px`}"
        >
            <div class="sheet-grab"><span /></div>
            <div ref="body" class="sheet-body">
                <slot :close="close" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.sheet-root {
    position: fixed;
    inset: 0;
    height: var(--app-height, auto);
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
    max-height: calc(var(--app-height, 100dvh) * 0.5);
    padding-bottom: env(safe-area-inset-bottom);
    border-radius: 12px 12px 0 0;
    outline: none;
    background: var(--raised);
    transform: translateY(var(--pulled));
    transition: transform 300ms var(--push);
    animation: sheet-in var(--sheet-in) var(--push);
}

.sheet.large {
    max-height: calc(var(--app-height, 100dvh) * 0.92);
}

.sheet.dragging {
    transition: none;
    will-change: transform;
}

.sheet.leaving {
    transform: translateY(100%);
    transition: transform var(--sheet-out) var(--out);
}

.sheet-grab {
    display: flex;
    flex: none;
    justify-content: center;
    height: 20px;
    padding-top: 6px;
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
