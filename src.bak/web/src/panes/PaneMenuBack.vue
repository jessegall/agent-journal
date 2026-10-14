<script setup>
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
</script>

<template>
    <MenuItem class="pane-menu-back">
        <Icon name="back" :size="14" />
        <slot />
    </MenuItem>
</template>

<style scoped>
.pane-menu-back {
    color: var(--text-3);
}
</style>
