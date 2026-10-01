<script setup>
import ToggleItem from "../kit/ToggleItem.vue";

defineProps({on: {type: Boolean, default: false}, icon: {type: String, required: true}});
</script>

<template>
    <ToggleItem :class="{'pane-menu-off': !on}" :on="on" :icon="icon">
        <slot />
    </ToggleItem>
</template>

<style scoped>
.menu-item.pane-menu-off {
    color: var(--text-4);
}
</style>
