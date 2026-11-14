<script setup>
import {computed, ref} from "vue";
import Icon from "../src/kit/Icon.vue";
import MenuPanel from "../src/kit/MenuPanel.vue";
import FilterChoices from "./FilterChoices.vue";
import {isDefault, isSet} from "./toggleFilter.js";

// one named filter: closed it reads its label, set it reads the choice (State: Started, Blocked) and has its own cross.
// The cross puts the filter back on its default, so it shows only while the filter differs from it.
const props = defineProps({field: {type: Object, required: true}, rows: {type: Array, required: true}, modelValue: {type: Object, default: null}});
const emit = defineEmits(["update:modelValue"]);
const anchor = ref(null);
const set = computed(() => isSet(props.modelValue));
const changed = computed(() => !isDefault(props.field, props.modelValue));
const names = computed(() => props.modelValue.values.map((value) => props.field.options.find(([option]) => option === value)?.[1] ?? value).join(", "));
const restore = () => emit("update:modelValue", props.field.default?.length ? {not: false, values: [...props.field.default]} : null);
const toggleMenu = (event) => (anchor.value = anchor.value ? null : event.currentTarget);
</script>

<template>
    <span :class="['filter-chip', {on: set}]" :data-filter-chip="field.key">
        <button type="button" class="filter-chip-main" aria-haspopup="menu" :aria-expanded="Boolean(anchor)" @click="toggleMenu">
            <span>{{ field.label }}</span>
            <template v-if="set"><b data-filter-value>{{ modelValue.not ? "is not " : ": " }}{{ names }}</b></template>
            <Icon name="caret" :size="10" />
        </button>
        <template v-if="set && changed">
            <button type="button" class="filter-chip-clear" data-filter-clear :aria-label="`Clear ${field.label}`" @click="restore"><Icon name="close" :size="9" /></button>
        </template>
        <template v-if="anchor">
            <MenuPanel :anchor="anchor" align="start" :min-width="240" :max-width="320" @click.stop @close="anchor = null">
                <FilterChoices :field="field" :rows="rows" :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />
            </MenuPanel>
        </template>
    </span>
</template>

<style scoped>
.filter-chip {
    display: inline-flex;
    flex: none;
    align-items: center;
    height: 26px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    color: var(--text-2);
    font-size: 12px;
}

.filter-chip.on {
    border-color: var(--accent);
    background: var(--accent-dim);
    color: var(--accent-text);
}

.filter-chip-main,
.filter-chip-clear {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 100%;
    padding: 0 8px;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
}

.filter-chip-main b {
    font-weight: 500;
}

.filter-chip-clear {
    padding: 0 7px 0 0;
}
</style>
