<script setup>
defineProps({
    label: {type: String, required: true},
    for: {type: String, default: ""},
    help: {type: String, default: ""},
});
</script>

<template>
    <div class="form-field">
        <div class="form-field-head">
            <label class="form-field-label" :for="$props.for">{{ label }}</label>
            <template v-if="$slots.aside">
                <span class="form-field-aside"><slot name="aside" /></span>
            </template>
        </div>
        <slot />
        <template v-if="help">
            <p class="form-field-help">{{ help }}</p>
        </template>
    </div>
</template>

<style scoped>
.form-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.form-field-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.form-field-label {
    color: var(--text-2);
    font-size: 12px;
    font-weight: 500;
}

.form-field-aside {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.form-field-help {
    margin: 0;
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 1.45;
}
</style>
