<script setup>
import Btn from "../kit/Btn.vue";
import MarkIcon from "../kit/MarkIcon.vue";

// the windows a pane can add: a click adds one here, a drag places it; one that is unavailable says justification
defineProps({windows: {type: Array, required: true}});
const emit = defineEmits(["grab", "add"]);
</script>

<template>
<div class="pane-add" role="menu" data-add-bar>
    <template v-for="window in windows" :key="window.name">
        <Btn
            small
            :data-reopen="window.name"
            :class="{unavailable: window.unavailable_reason}"
            :title="window.unavailable_reason ? `${window.title}: ${window.unavailable_reason}` : window.title"
            @pointerdown="!window.unavailable_reason && emit('grab', $event, window.name)"
            @click="!window.unavailable_reason && emit('add', window.name)"
        >
            <MarkIcon :name="window.icon || 'window'" />{{ window.title }}
        </Btn>
    </template>
    <template v-if="!windows.length">
        <span class="pane-add-none">Every window is open</span>
    </template>
</div>
</template>

<style scoped>
.pane-add {
    position: absolute;
    top: 34px;
    right: 5px;
    left: 5px;
    z-index: 6;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 6px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--raised);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.pane-add-none {
    padding: 4px 6px;
    color: var(--text-3);
    font-size: 12px;
}

.pane-add .unavailable {
    opacity: 0.45;
}
</style>
