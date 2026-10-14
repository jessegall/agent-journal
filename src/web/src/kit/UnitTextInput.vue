<script setup>
import {computed, useAttrs} from "vue";
import DropList from "./DropList.vue";

defineOptions({inheritAttrs: false});
const props = defineProps({unit: {type: String, default: ""}, units: {type: Array, default: () => []}});
const emit = defineEmits(["unit"]);
const attrs = useAttrs();
const inputAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "class" && key !== "style")));
const picked = computed(() => props.units.find((choice) => choice.key === props.unit));
</script>

<template>
    <label :class="['unit-field', attrs.class]" :style="attrs.style">
        <input class="unit-field-input" spellcheck="false" v-bind="inputAttrs" />
        <template v-if="units.length > 1">
            <span class="unit-field-unit picking">
                <DropList
                    bare
                    :label="picked ? picked.label : 'unit'"
                    :items="units"
                    :picked="unit"
                    :menu-width="160"
                    @pick="emit('unit', $event.key)"
                />
            </span>
        </template>
        <template v-else-if="unit">
            <span class="unit-field-unit">{{ unit }}</span>
        </template>
    </label>
</template>

<style scoped>
.unit-field {
    display: flex;
    align-items: stretch;
    min-width: 0;
    height: 32px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
    transition: border-color 0.15s;
}

.unit-field:focus-within {
    border-color: var(--accent);
}

.unit-field-input {
    flex: 1;
    min-width: 0;
    padding: 0 9px;
    border: 0;
    outline: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    font-variant-numeric: tabular-nums;
    appearance: textfield;
}

.unit-field-input::-webkit-inner-spin-button,
.unit-field-input::-webkit-outer-spin-button {
    margin: 0;
    appearance: none;
}

.unit-field-unit {
    flex: none;
    display: flex;
    align-items: center;
    padding: 0 10px;
    border-left: 1px solid var(--border-2);
    color: var(--text-3);
    font-size: 12px;
    white-space: nowrap;
}

.unit-field-unit.picking {
    padding: 0;
}
</style>
