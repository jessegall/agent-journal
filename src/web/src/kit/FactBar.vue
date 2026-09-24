<template>
    <div class="fact-bar">
        <slot />
    </div>
</template>

<style scoped>
.fact-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 0;
    min-height: 34px;
    padding: 6px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-2);
    color: var(--text-3);
    font-size: 11.5px;
}

.fact-bar > :deep(*) {
    flex: none;
    padding: 0 12px;
}

.fact-bar > :deep(*:first-child) {
    padding-left: 0;
}

.fact-bar > :deep(* + *) {
    border-left: 1px solid var(--border-2);
}
</style>
