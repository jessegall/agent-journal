<script setup>
import Spinner from "./Spinner.vue";

defineProps({
    kind: {type: String, default: "ghost"},
    small: Boolean,
    large: Boolean,
    busy: Boolean,
    disabled: Boolean,
    fill: Boolean,
    href: {type: String, default: ""},
});
</script>

<template>
    <component
        :is="href ? 'a' : 'button'"
        :type="href ? undefined : 'button'"
        :href="href || undefined"
        :class="['btn', kind, {small, large, busy, fill}]"
        :aria-busy="busy"
        :disabled="busy || disabled"
    >
        <span :class="['btn-label', {hidden: busy}]"><slot /></span>
        <template v-if="busy">
            <Spinner class="btn-spinner" />
        </template>
    </component>
</template>

<style scoped>
.btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 28px;
    padding: 0 11px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: transparent;
    color: var(--text-2);
    font-size: 12.5px;
    text-decoration: none;
    cursor: pointer;
    white-space: nowrap;
}

.btn-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.btn-label.hidden {
    visibility: hidden;
}

.btn.fill .btn-label {
    flex: 1;
    min-width: 0;
}

.btn-spinner {
    position: absolute;
    inset: 0;
    margin: auto;
}

.btn :deep(.ico) {
    width: 12px;
    height: 12px;
}
.btn:hover {
    background: var(--hover);
    color: var(--text);
}
.btn.primary {
    border-color: var(--accent);
    background: var(--accent-dim);
    color: var(--accent-text);
}
.btn.primary:hover {
    background: var(--accent);
    color: #fff;
}
.btn.danger {
    border-color: color-mix(in oklab, var(--danger) 55%, var(--border-2));
    color: var(--danger);
}

.btn.danger:hover {
    border-color: var(--danger);
    background: color-mix(in oklab, var(--danger) 12%, transparent);
    color: var(--danger);
}
.btn.text {
    height: auto;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: none;
    font: inherit;
    text-align: left;
    white-space: normal;
}

.btn.text:hover {
    background: none;
    color: var(--text);
}

.btn.text .btn-label {
    display: block;
}

.btn.icon {
    height: auto;
    padding: 5px;
    border-color: transparent;
}
.btn.icon:hover {
    background: color-mix(in srgb, var(--border-3) 70%, transparent);
    color: var(--text);
}
.btn.small {
    height: 24px;
    padding: 0 9px;
    font-size: 12px;
}

.btn.large {
    height: 36px;
    padding: 0 14px;
    font-size: 13.5px;
}

.btn:disabled:not(.busy) {
    opacity: 0.45;
    cursor: default;
    pointer-events: none;
}
</style>
