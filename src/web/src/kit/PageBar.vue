<template>
    <div class="page-bar">
        <slot />
    </div>
</template>

<style scoped>
.page-bar {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 16px;
    min-height: 44px;
    padding: 6px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
    color: var(--text-2);
}
</style>
