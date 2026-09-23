<script setup>
import {onMounted, onUnmounted} from "vue";

const props = defineProps({open: Boolean, leave: {type: String, default: "Back"}});
const emit = defineEmits(["close"]);
const onKey = (e) => props.open && e.key === "Escape" && emit("close");
onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => window.removeEventListener("keydown", onKey));
</script>

<template>
    <Teleport to="body">
        <Transition name="focus-stage">
            <div v-show="open" class="focus-stage">
                <div class="veil" />
                <button type="button" class="leave" @click="emit('close')">
                    {{ leave }}
                    <kbd>Esc</kbd>
                </button>
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
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
}

.veil {
    position: absolute;
    inset: 0;
    background: color-mix(in srgb, var(--side) 70%, transparent);
    backdrop-filter: blur(10px);
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
}

.leave:hover {
    color: var(--text);
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
    gap: 16px;
    width: min(940px, 100%);
    height: min(680px, 100%);
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
</style>
