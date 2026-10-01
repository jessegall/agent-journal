<script setup>
import {computed, ref, useAttrs} from "vue";
import Icon from "./Icon.vue";

defineOptions({inheritAttrs: false});
defineProps({label: {type: String, default: ""}, icon: {type: String, default: ""}, large: Boolean});
const attrs = useAttrs();
const inputAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "class" && key !== "style")));
const input = ref(null);
defineExpose({focus: () => input.value && input.value.focus()});
</script>

<template>
    <template v-if="label || icon || $slots.end">
        <label :class="['text-field', {large, ended: $slots.end}, attrs.class]" :style="attrs.style">
            <template v-if="icon">
                <Icon :name="icon" :size="13" class="text-field-icon" />
            </template>
            <template v-if="label">
                <span class="text-field-label">{{ label }}</span>
            </template>
            <input ref="input" class="text-field-input" spellcheck="false" v-bind="inputAttrs" />
            <template v-if="$slots.end">
                <span class="text-field-end"><slot name="end" /></span>
            </template>
        </label>
    </template>
    <template v-else>
        <input ref="input" class="text-input" spellcheck="false" v-bind="$attrs" />
    </template>
</template>

<style scoped>
.text-input {
    min-width: 0;
    padding: 6px 9px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
}

.text-input:focus {
    outline: none;
    border-color: var(--accent);
}

.text-field {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    height: 32px;
    padding: 0 9px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
    transition: border-color 0.15s;
}

.text-field:focus-within {
    border-color: var(--accent);
}

.text-field.large {
    height: 44px;
    padding: 0 14px;
    border-radius: 10px;
    background: var(--side);
}

.text-field.ended {
    flex-wrap: wrap;
    row-gap: 4px;
    height: auto;
    min-height: 36px;
    padding: 4px 4px 4px 9px;
}

.text-field.ended .text-field-input {
    flex: 1 1 140px;
    height: 26px;
}

.text-field-end {
    flex: 0 1 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    max-width: 100%;
    margin-left: auto;
}

.text-field-end :deep(.btn) {
    height: 26px;
}

.text-field-icon {
    flex: none;
    color: var(--text-3);
}

.text-field-label {
    flex: none;
    color: var(--text-3);
    font-size: 12.5px;
    white-space: nowrap;
}

.text-field-input {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0;
    border: 0;
    outline: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
}

.text-field.large .text-field-input {
    font-size: 14px;
}

.text-field-input::placeholder {
    color: var(--text-4);
}
</style>
