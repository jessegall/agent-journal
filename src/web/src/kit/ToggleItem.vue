<script setup>
import Icon from "./Icon.vue";
import MenuItem from "./MenuItem.vue";

defineProps({on: Boolean, icon: {type: String, default: ""}});
</script>

<template>
    <MenuItem class="toggle-item" role="menuitemcheckbox" :aria-checked="on">
        <span class="toggle-item-mark">
            <template v-if="icon">
                <Icon :name="icon" :size="14" />
            </template>
            <template v-else-if="on">
                <Icon name="tick" :size="13" />
            </template>
        </span>
        <slot />
        <template v-if="icon && on">
            <Icon class="toggle-item-end" name="tick" :size="13" />
        </template>
    </MenuItem>
</template>

<style scoped>
.toggle-item-mark {
    display: grid;
    place-items: center;
    flex: none;
    width: 14px;
    color: var(--text);
}

.toggle-item-end {
    margin-left: auto;
    color: var(--accent-text);
}
</style>
