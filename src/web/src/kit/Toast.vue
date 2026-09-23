<script setup>
import {onUnmounted, ref, watch} from "vue";

const props = defineProps({toast: {type: Object, default: null}, lasts: {type: Number, default: 8000}});
const emit = defineEmits(["done"]);
const hovered = ref(false);
let timer = 0;

const wait = () => {
    clearTimeout(timer);
    timer = setTimeout(() => !hovered.value && emit("done"), props.lasts);
};

watch(
    () => props.toast,
    (toast) => toast && wait(),
    {immediate: true}
);
onUnmounted(() => clearTimeout(timer));

function act() {
    props.toast.action();
    emit("done");
}
</script>

<template>
    <Transition name="toast">
        <template v-if="toast">
            <div class="toast" role="status" @mouseenter="hovered = true" @mouseleave="((hovered = false), wait())">
                <span>{{ toast.text }}</span>
                <template v-if="toast.action">
                    <button type="button" class="action" @click="act">{{ toast.label }}</button>
                </template>
            </div>
        </template>
    </Transition>
</template>

<style scoped>
.toast {
    position: fixed;
    left: 50%;
    bottom: 20px;
    z-index: 70;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 12px 9px 14px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 13px;
    transform: translateX(-50%);
}

.action {
    padding: 3px 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--hover);
    color: var(--text);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.action:hover {
    background: var(--sel);
}

.toast-enter-active,
.toast-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translate(-50%, 8px);
}
</style>
