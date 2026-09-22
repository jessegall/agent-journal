<script setup>
import {onMounted, onUnmounted} from "vue";
import Icon from "./Icon.vue";

defineProps({title: {type: String, default: ""}});
const emit = defineEmits(["close"]);

function keys(e) {
    if (e.key === "Escape") emit("close");
}

onMounted(() => window.addEventListener("keydown", keys));
onUnmounted(() => window.removeEventListener("keydown", keys));
</script>

<template>
    <div class="dialog" @click.self="emit('close')">
        <section class="dialog-panel">
            <header class="dialog-head">
                <h3>{{ title }}</h3>
                <button type="button" class="dialog-close" title="Close" @click="emit('close')"><Icon name="x" /></button>
            </header>
            <div class="dialog-body">
                <slot />
            </div>
            <template v-if="$slots.foot">
                <footer class="dialog-foot">
                    <slot name="foot" />
                </footer>
            </template>
        </section>
    </div>
</template>

<style scoped>
.dialog {
    position: fixed;
    inset: 0;
    z-index: 80;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    background: rgba(0, 0, 0, 0.62);
}

.dialog-panel {
    display: flex;
    flex-direction: column;
    width: min(720px, 100%);
    max-height: min(640px, 100%);
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    overflow: hidden;
}

.dialog-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-bottom: 1px solid var(--border);
}

.dialog-head h3 {
    flex: 1;
    margin: 0;
    font-size: 13.5px;
    font-weight: 600;
}

.dialog-close {
    display: inline-flex;
    padding: 4px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.dialog-close:hover {
    color: var(--text);
}

.dialog-body {
    min-height: 0;
    overflow: auto;
    padding: 14px;
}

.dialog-foot {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-top: 1px solid var(--border);
}
</style>
