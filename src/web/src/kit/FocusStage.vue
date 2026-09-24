<script setup>
import {onMounted, onUnmounted} from "vue";

const props = defineProps({
    open: Boolean,
    leave: {type: String, default: "Back"},
    glow: Boolean,
    spread: Boolean,
    docked: Boolean,
    page: Boolean,
    escapes: {type: Boolean, default: true},
});
const emit = defineEmits(["close"]);
const onKey = (e) => props.open && props.escapes && e.key === "Escape" && emit("close");
onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => window.removeEventListener("keydown", onKey));
</script>

<template>
    <Teleport to="body">
        <Transition name="focus-stage">
            <div v-show="open" :class="['focus-stage', {spread, docked, page}]">
                <div class="veil" />
                <template v-if="glow">
                    <div class="glow" />
                </template>
                <template v-if="escapes">
                    <button type="button" class="leave" @click="emit('close')">
                        {{ leave }}
                        <kbd>Esc</kbd>
                    </button>
                </template>
                <div class="body">
                    <slot />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.focus-stage {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 28px 16px 40px;
}

.veil {
    position: absolute;
    inset: 0;
    background: rgba(8, 9, 11, 0.45);
    backdrop-filter: blur(10px) saturate(0.7);
}

.glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1100px;
    height: 760px;
    margin: -380px 0 0 -550px;
    background: radial-gradient(ellipse at center, rgba(94, 100, 201, 0.14), transparent 60%);
    pointer-events: none;
    transition:
        opacity 0.45s cubic-bezier(0.2, 0.9, 0.25, 1),
        transform 0.45s cubic-bezier(0.2, 0.9, 0.25, 1);
}

.docked .glow {
    opacity: 0;
    transform: scale(0.92);
}

.leave {
    position: absolute;
    top: 14px;
    right: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
    transition:
        opacity 0.2s,
        color 0.2s;
}

.leave:hover {
    color: var(--text);
}

.docked .leave {
    opacity: 0;
    pointer-events: none;
}

kbd {
    padding: 1px 5px;
    border: 1px solid var(--border-2);
    border-radius: 4px;
    font: inherit;
    font-size: 10.5px;
}

.body {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 18px;
    width: min(940px, 100%);
    height: 100%;
}

.spread {
    padding: 0;
}

.page {
    align-items: flex-start;
    padding: 12vh 16px 48px;
    overflow-y: auto;
}

.page .veil {
    position: fixed;
    background: var(--bg);
    backdrop-filter: none;
}

.page .leave {
    position: fixed;
    z-index: 1;
}

.page .body {
    justify-content: flex-start;
    gap: 22px;
    width: min(1040px, 100%);
    height: auto;
}

.spread .body {
    width: 100%;
}

.focus-stage-enter-active,
.focus-stage-leave-active {
    transition: opacity 0.35s ease;
}

.focus-stage-enter-active .body,
.focus-stage-leave-active .body {
    transition: transform 0.45s cubic-bezier(0.2, 0.9, 0.25, 1);
}

.focus-stage-enter-from,
.focus-stage-leave-to {
    opacity: 0;
}

.focus-stage-enter-from .body,
.focus-stage-leave-to .body {
    transform: translateY(24px);
}

.focus-stage-enter-from.page .body,
.focus-stage-leave-to.page .body {
    transform: translateY(8px);
}

.focus-stage-enter-from.spread .body,
.focus-stage-leave-to.spread .body {
    transform: scale(0.97);
}

.focus-stage-enter-from .glow,
.focus-stage-leave-to .glow {
    transform: scale(0.92);
}

@media (prefers-reduced-motion: reduce) {
    .glow,
    .leave,
    .focus-stage-enter-active,
    .focus-stage-leave-active,
    .focus-stage-enter-active .body,
    .focus-stage-leave-active .body {
        transition-duration: 0.01ms;
    }
}
</style>
