<script setup>
import Icon from "./Icon.vue";

const BANDS = ["report", "wait", "danger", "info", "need"];

defineProps({
    tone: {type: String, default: "muted"},
    icon: {type: String, default: ""},
});
</script>

<template>
    <div class="notice" :class="[`notice-${tone}`, {'notice-band': BANDS.includes(tone)}]">
        <template v-if="icon">
            <Icon :name="icon" :size="18" />
        </template>
        <span class="notice-text"><slot /></span>
        <template v-if="$slots.actions">
            <span class="notice-actions"><slot name="actions" /></span>
        </template>
    </div>
</template>

<style scoped>
.notice {
    margin: 0;
}

.notice-muted {
    color: var(--text-2);
}

.notice-good {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 50px;
    padding: 0 16px;
    border-radius: 12px;
    background: color-mix(in oklab, var(--tone-good) 16%, transparent);
    color: var(--text);
    font-weight: 600;
}

.notice-good :deep(.ico) {
    color: var(--tone-good);
}

.notice-band {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    padding: 9px 14px;
    border-left: 3px solid var(--band, var(--border-3));
    border-radius: 8px;
    background: color-mix(in srgb, var(--band, var(--border-3)) 12%, var(--bg));
    color: var(--text);
    font-size: 12.5px;
}

.notice-band .notice-text {
    flex: 1 1 260px;
    min-width: 0;
}

.notice-actions {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-left: auto;
}

.notice-report {
    --band: var(--tone-good);
}

.notice-wait {
    --band: var(--tone-commit);
}

.notice-need {
    --band: var(--accent);
}

.notice-danger {
    --band: var(--danger);
}

.notice-info {
    --band: var(--border-3);
}
</style>
