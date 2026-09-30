<script setup>
defineProps({label: {type: String, required: true}, hint: {type: String, default: ""}});
</script>

<template>
    <label class="form-field">
        <span class="form-field-label">
            {{ label }}
            <template v-if="hint">
                <span class="form-field-hint">{{ hint }}</span>
            </template>
        </span>
        <slot />
    </label>
</template>

<style scoped>
.form-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.form-field-label {
    color: var(--text-2);
    font-size: 12px;
    font-weight: 500;
}

.form-field-hint {
    margin-left: 6px;
    color: var(--text-3);
    font-weight: 400;
}
</style>
