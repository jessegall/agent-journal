<script setup>
import {onUnmounted} from "vue";
import WindowPane from "./WindowPane.vue";

// a window registered as a dropdown: it opens under the bars, over the page, and closes on a click outside or on escape
defineProps({
    name: {type: String, required: true},
    catalogue: {type: Object, required: true},
    subscriptions: {type: Object, required: true},
    environment: {type: String, required: true},
    agent: {type: Number, default: null},
    prompts: {type: Object, default: null},
    shellRead: {type: Function, default: null},
});
const emit = defineEmits(["close"]);
const closeOnEscape = (event) => event.key === "Escape" && emit("close");
window.addEventListener("keydown", closeOnEscape);
onUnmounted(() => window.removeEventListener("keydown", closeOnEscape));
</script>

<template>
    <div class="dropdown-veil" data-dropdown-veil @click.self="emit('close')">
        <div class="dropdown" :data-dropdown="name" role="dialog">
            <WindowPane dropdown :name="name" :catalogue="catalogue" :subscriptions="subscriptions" :environment="environment" :agent="agent" :prompts="prompts" :shell-read="shellRead" />
        </div>
    </div>
</template>

<style scoped>
.dropdown-veil {
    position: fixed;
    z-index: 40;
    inset: 0;
}

.dropdown {
    position: absolute;
    top: 84px;
    left: 240px;
    overflow: auto;
    box-sizing: border-box;
    width: 300px;
    padding: 14px 16px;
    max-width: calc(100vw - 32px);
    max-height: calc(100vh - 110px);
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
}
</style>
