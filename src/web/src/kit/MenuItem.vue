<script setup>
defineProps({on: Boolean, description: {type: String, default: ""}});
</script>

<template>
    <button type="button" :class="['menu-item', {on, described: description}]">
        <template v-if="description">
            <span class="menu-item-text">
                <span><slot /></span>
                <small>{{ description }}</small>
            </span>
        </template>
        <template v-else>
            <slot />
        </template>
    </button>
</template>

<style scoped>
.menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
}

.menu-item:disabled {
    opacity: 0.45;
    cursor: default;
}

.menu-item:hover:enabled {
    background: var(--hover);
    color: var(--text);
}

.menu-item.on {
    background: color-mix(in srgb, var(--accent) 16%, transparent);
    color: var(--text);
}

.menu-item.described {
    align-items: flex-start;
}

.menu-item-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.menu-item-text small {
    color: var(--text-3);
    font-size: 11px;
}
</style>
