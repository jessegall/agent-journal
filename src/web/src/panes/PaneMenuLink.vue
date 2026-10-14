<script setup>
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";

defineProps({icon: {type: String, required: true}, label: {type: String, required: true}, note: {type: String, default: ""}});
</script>

<template>
    <MenuItem>
        <Icon :name="icon" :size="14" />
        {{ label }}
        <template v-if="note">
            <span class="pane-menu-note">{{ note }}</span>
        </template>
        <span :class="['pane-menu-more', {near: note}]">›</span>
    </MenuItem>
</template>

<style scoped>
.pane-menu-more {
    margin-left: auto;
    color: var(--text-4);
}

.pane-menu-more.near {
    margin-left: 6px;
}

.pane-menu-note {
    margin-left: auto;
    color: var(--text-4);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}
</style>
