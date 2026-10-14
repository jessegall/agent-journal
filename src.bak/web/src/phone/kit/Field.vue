<script setup>
import {computed, useAttrs, useId} from "vue";

defineOptions({inheritAttrs: false});
const props = defineProps({
    modelValue: {type: [String, Number], default: ""},
    label: {type: String, required: true},
    hint: {type: String, default: ""},
    unit: {type: String, default: ""},
    type: {type: String, default: "text"},
    area: Boolean,
    verbatim: Boolean,
    labelSize: {type: String, default: "small"},
});
const emit = defineEmits(["update:modelValue"]);
const id = useId();
const attrs = useAttrs();
const inputAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "class" && key !== "style")));
const typed = (event) => emit("update:modelValue", event.target.value);
</script>

<template>
    <div :class="['phone-field', attrs.class]" :style="attrs.style">
        <label :for="id" :class="['phone-field-label', labelSize]">{{ label }}</label>
        <div class="phone-field-box">
            <template v-if="area">
                <textarea :id="id" class="phone-field-input phone-field-area" rows="4" :value="modelValue" v-bind="inputAttrs" @input="typed" />
            </template>
            <template v-else>
                <input
                    :id="id"
                    class="phone-field-input"
                    :type="type"
                    :value="modelValue"
                    :autocapitalize="verbatim ? 'off' : null"
                    :autocorrect="verbatim ? 'off' : null"
                    :spellcheck="verbatim ? 'false' : null"
                    v-bind="inputAttrs"
                    @input="typed"
                />
            </template>
            <template v-if="unit">
                <span class="phone-field-hint">{{ unit }}</span>
            </template>
        </div>
        <template v-if="hint">
            <small class="phone-field-hint">{{ hint }}</small>
        </template>
    </div>
</template>

<style scoped>
.phone-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.phone-field-label {
    color: var(--text-3);
    font-size: 0.8125rem;
}

.phone-field-label.large {
    color: var(--text);
    font-size: 1.0625rem;
}

.phone-field-box {
    display: flex;
    align-items: center;
    gap: 8px;
}

.phone-field-input {
    flex: 1;
    width: 100%;
    min-width: 0;
    min-height: 44px;
    padding: 10px 12px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: max(16px, 1rem);
}

.phone-field-area {
    min-height: 110px;
    resize: none;
}

.phone-field-hint {
    color: var(--text-3);
    font-size: 0.875rem;
}
</style>
