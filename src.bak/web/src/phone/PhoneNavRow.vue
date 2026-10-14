<script setup>
import Icon from "../kit/Icon.vue";
</script>

<template>
    <button type="button" class="nav-row">
        <slot />
        <Icon name="chevronRight" bold class="nav-row-chevron" :size="14" />
    </button>
</template>

<style scoped>
.nav-row {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
}

.nav-row-chevron {
    flex: none;
    color: var(--text-3);
}
</style>
