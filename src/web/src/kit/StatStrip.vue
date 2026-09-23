<template>
    <div class="stat-strip">
        <slot />
    </div>
</template>

<style scoped>
.stat-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 1px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--border);
    overflow: hidden;
}

.stat-strip > :deep(*) {
    flex: 1 1 150px;
}
</style>
