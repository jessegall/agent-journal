<script setup>
import {useId} from "vue";
import PhoneSettingReset from "./PhoneSettingReset.vue";

const props = defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["change", "timing"]);
const id = useId();
const typed = (event) => emit("change", props.row.kind === "number" ? Number(event.target.value) : event.target.value);
</script>

<template>
    <div class="field">
        <label :for="id">{{ row.label }}</label>
        <span class="input">
            <input :id="id" :type="row.kind" min="0" :inputmode="row.kind === 'number' ? 'numeric' : undefined" :value="row.value" @change="typed" />
            <template v-if="row.unit">
                <span class="unit">{{ row.unit }}</span>
            </template>
        </span>
        <template v-if="row.hint">
            <p>{{ row.hint }}</p>
        </template>
        <PhoneSettingReset :row="row" @change="emit('change', $event)" @timing="emit('timing', $event)" />
    </div>
</template>

<style scoped>
.field {
    padding: 10px 14px 12px;
}

.field label {
    display: block;
    font-size: 1.0625rem;
}

.input {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
}

.input input {
    flex: 1;
    min-width: 0;
    min-height: 44px;
    padding: 0 12px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
}

.unit,
.field p {
    color: var(--text-3);
    font-size: 0.875rem;
}

.field p {
    margin: 6px 0 0;
}
</style>
