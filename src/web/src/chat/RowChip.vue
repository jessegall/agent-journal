<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import DockLeave from "./DockLeave.vue";
import {dockedRef, isLeaving} from "../domain/docks.js";
import {meta} from "../domain/tables.js";

// One row docked above the chat, such as a report, in the compact line the docked rows fold into: its table's icon and its title
const props = defineProps({message: {type: Object, required: true}});
const card = computed(() => props.message.data);
const kind = computed(() => meta(dockedRef(props.message).table) || {});
</script>

<template>
    <button type="button" class="row-chip" :data-tip="message.text" :aria-label="`${message.text}; show its card`">
        <template v-if="isLeaving(message)">
            <DockLeave :ends-at="card.undock_at" />
        </template>
        <span class="row-chip-label">
            <Icon :name="kind.icon || 'doc'" class="row-chip-icon" />
            <span class="row-chip-name">{{ message.text }}</span>
        </span>
    </button>
</template>

<style scoped>
.row-chip {
    position: relative;
    flex: 1 1 0;
    min-width: 0;
    max-width: 220px;
    height: 24px;
    padding: 0 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    font: inherit;
    color: var(--text-2);
    cursor: pointer;
    transition: border-color 0.15s ease;
}

.row-chip:hover {
    border-color: var(--border-3);
}

.row-chip:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--accent-text) 70%, transparent);
    outline-offset: -2px;
}

.row-chip .dock-leave {
    right: 5px;
    left: 5px;
}

.row-chip-label {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    height: 100%;
}

.row-chip-icon {
    flex: none;
}

.row-chip-name {
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
