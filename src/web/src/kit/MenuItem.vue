<script setup>
defineProps({on: Boolean, danger: Boolean, description: {type: String, default: ""}});
</script>

<template>
    <button type="button" :class="['menu-item', {on, danger, described: description}]">
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

.menu-item.danger,
.menu-item.danger:hover:enabled {
    color: var(--danger);
}
.menu-item.danger {
    margin-top: 6px;
    border-top: 1px solid var(--border);
    border-radius: 0 0 6px 6px;
}
.menu-item:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: -2px;
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
