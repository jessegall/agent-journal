<template>
    <div class="caution" role="alert">
        <div class="caution-text"><slot /></div>
        <div class="caution-actions"><slot name="actions" /></div>
    </div>
</template>

<style scoped>
.caution {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 12px;
    border: 1px solid var(--tone-warn);
    border-radius: 8px;
    background: color-mix(in srgb, var(--tone-warn) 10%, var(--bg));
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.5;
}

.caution-text :deep(b) {
    color: var(--text);
}

.caution-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}
</style>
