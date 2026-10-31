<script setup>
import Icon from "./Icon.vue";

defineProps({tone: {type: String, default: ""}, removable: Boolean, label: {type: String, default: ""}});
const emit = defineEmits(["remove"]);
</script>

<template>
    <span :class="['chip', tone, {removable}]">
        <template v-if="removable">
            <span class="chip-text"><slot /></span>
            <button type="button" class="chip-remove" :aria-label="`Remove ${label}`" @click="emit('remove')">
                <Icon name="close" :size="10" />
            </button>
        </template>
        <template v-else>
            <slot />
        </template>
    </span>
</template>

<style scoped>
.chip {
    display: inline-flex;
    align-self: flex-start;
    align-items: center;
    gap: 5px;
    padding: 2px 8px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    color: var(--text-2);
    font-size: 11px;
    white-space: nowrap;
}

.chip.accent {
    color: var(--accent-text);
}

.chip.danger {
    border-color: var(--danger);
    color: var(--danger);
    font-weight: 700;
}

.chip.good {
    border-color: var(--tone-good);
    color: var(--tone-good);
}

.chip.removable {
    gap: 2px;
    max-width: 100%;
    height: 26px;
    padding: 0 2px 0 10px;
    font-size: 12px;
}

.chip-text {
    overflow: hidden;
    text-overflow: ellipsis;
}

.chip-remove {
    display: inline-grid;
    flex: none;
    place-items: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    border-radius: 99px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.chip-remove:hover {
    background: var(--hover);
    color: var(--text);
}
</style>
