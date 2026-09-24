<script setup>
import Icon from "./Icon.vue";
import MenuItem from "./MenuItem.vue";

defineProps({on: Boolean});
</script>

<template>
    <MenuItem class="toggle-item" role="menuitemcheckbox" :aria-checked="on">
        <span class="toggle-item-mark">
            <template v-if="on">
                <Icon name="tick" :size="13" />
            </template>
        </span>
        <slot />
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
</style>
