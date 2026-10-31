<template>
    <span class="integrations-pending">
        <span class="integrations-spinner" />
        <slot />
    </span>
</template>

<style scoped>
.integrations-pending {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-dim, #9aa0a6);
}

.integrations-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid var(--line, #2a2d33);
    border-top-color: var(--accent, #7b86f5);
    border-radius: 50%;
    animation: integrations-spin 0.9s linear infinite;
}

@keyframes integrations-spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
