<script setup>
import Spinner from "../../kit/Spinner.vue";

defineProps({
    kind: {
        type: String,
        default: "primary",
        validator: (kind) => ["primary", "plain", "danger", "link", "icon", "chip", "block", "round"].includes(kind),
    },
    busy: Boolean,
    disabled: Boolean,
    fill: Boolean,
});
</script>

<template>
    <button type="button" :class="['phone-button', kind, {fill}]" :aria-busy="busy" :disabled="busy || disabled">
        <span :class="['phone-button-label', {hidden: busy}]"><slot /></span>
        <template v-if="busy">
            <Spinner class="phone-button-spinner" />
        </template>
    </button>
</template>

<style scoped>
.phone-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 0 18px;
    border: 0;
    border-radius: 12px;
    background: var(--sel);
    color: var(--text);
    font: inherit;
    font-weight: 600;
}

.phone-button.fill {
    width: 100%;
}

.phone-button.primary {
    background: var(--accent);
    color: #fff;
}

.phone-button.danger {
    background: var(--danger);
    color: #fff;
}

.phone-button.plain {
    color: var(--accent-text);
}

.phone-button.link {
    padding: 0;
    background: none;
    color: var(--accent-text);
    font-size: 0.875rem;
    font-weight: 400;
}

.phone-button.icon {
    min-width: 44px;
    padding: 0;
    background: none;
    color: var(--text-2);
}

.phone-button.block {
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    min-height: 48px;
    padding: 4px 10px;
    border-radius: 14px;
    font-weight: 400;
    text-align: left;
}

.phone-button.round {
    width: 44px;
    border: 1px solid var(--line);
    border-radius: 50%;
    padding: 0;
    background: var(--raised);
    box-shadow: var(--shadow-1);
}

.phone-button.chip {
    min-height: 32px;
    padding: 0 12px;
    border-radius: 16px;
    font-size: 0.8125rem;
    font-weight: 500;
}

.phone-button:active:not(:disabled) {
    opacity: 0.8;
}

.phone-button:disabled {
    opacity: 0.5;
}

.phone-button-label {
    display: contents;
}

.hidden {
    visibility: hidden;
}

.phone-button-spinner {
    position: absolute;
    inset: 0;
    margin: auto;
}
</style>
