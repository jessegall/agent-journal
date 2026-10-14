<script setup>
import {dismissToast, pauseToast, resumeToast, toasted, undoToast} from "./toast.js";
import {onUnmounted} from "vue";

onUnmounted(dismissToast);
</script>

<template>
    <Transition name="toast">
        <template v-if="toasted">
            <div
                :key="toasted.id"
                class="toast"
                role="status"
                @pointerdown="pauseToast"
                @pointerup="resumeToast"
                @pointercancel="resumeToast"
                @pointerleave="resumeToast"
            >
                <span class="toast-words">{{ toasted.text }}</span>
                <template v-if="toasted.undo">
                    <button type="button" class="toast-undo" @click="undoToast">Undo</button>
                </template>
            </div>
        </template>
    </Transition>
</template>

<style scoped>
.toast {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: calc(62px + var(--safe-bottom, 0px));
    z-index: 60;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: none;
    min-height: 48px;
    padding: 6px 8px 6px 16px;
    border-radius: 14px;
    background: #2c2e34;
    box-shadow: 0 8px 24px rgb(0 0 0 / 35%);
    color: #f2f3f5;
}

.toast-words {
    flex: 1;
}

.toast-undo {
    min-height: 44px;
    padding: 0 10px;
    border: 0;
    background: none;
    color: #9db8ff;
    font: inherit;
    font-weight: 600;
}

.toast-enter-active,
.toast-leave-active {
    transition:
        opacity 200ms linear,
        transform 260ms var(--push);
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(12px);
}
</style>
