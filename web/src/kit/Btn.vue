<script setup>
import Spinner from "./Spinner.vue";

defineProps({kind: {type: String, default: "ghost"}, small: Boolean, busy: Boolean});
</script>

<template>
    <button type="button" :class="['btn', kind, {small, busy}]" :aria-busy="busy">
        <span :class="['btn-label', {hidden: busy}]"><slot /></span>
        <template v-if="busy">
            <Spinner class="btn-spinner" />
        </template>
    </button>
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
.btn.danger:hover {
    border-color: var(--danger);
    color: var(--danger);
}
.btn.icon {
    height: auto;
    padding: 5px;
    border-color: transparent;
}
.btn.small {
    height: 24px;
    padding: 0 9px;
    font-size: 12px;
}
</style>
