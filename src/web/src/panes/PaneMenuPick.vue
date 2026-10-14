<script setup>
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";

defineProps({icon: {type: String, required: true}, label: {type: String, required: true}, current: {default: undefined}});
</script>

<template>
    <MenuItem :aria-current="current">
        <Icon :name="icon" :size="14" />
        {{ label }}
        <template v-if="current">
            <span class="pane-menu-dot" />
        </template>
    </MenuItem>
</template>

<style scoped>
.pane-menu-dot {
    flex: none;
    width: 6px;
    height: 6px;
    margin-left: auto;
    border-radius: 50%;
    background: var(--text-2);
}
</style>
