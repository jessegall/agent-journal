<template>
    <div class="fact-bar">
        <div class="fact-bar-clip">
            <div class="fact-bar-row">
                <slot />
            </div>
        </div>
    </div>
</template>

<style scoped>
.fact-bar {
    padding: 6px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-2);
    color: var(--text-3);
    font-size: 11.5px;
}

.fact-bar-clip {
    overflow: hidden;
}

.fact-bar-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 0;
    min-height: 22px;
    margin-left: -13px;
}

.fact-bar-row > :deep(*) {
    flex: none;
    padding: 0 12px;
    border-left: 1px solid var(--border-2);
}
</style>
