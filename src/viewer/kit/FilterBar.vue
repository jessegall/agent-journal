<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import MenuLabel from "../src/kit/MenuLabel.vue";
import MenuPanel from "../src/kit/MenuPanel.vue";
import FilterChip from "./FilterChip.vue";
import FilterChoices from "./FilterChoices.vue";
import SearchBar from "./SearchBar.vue";
import {defaultFilter, isDefault} from "./toggleFilter.js";

// one bar for a list with more than one thing to filter on: the search words, then one chip per declared field on a single line;
// the chips that do not fit are in the More chip. Once a filter or words are on, the bar says how many rows show and has Clear,
// which puts every field back on its default.
const props = defineProps({
    fields: {type: Array, required: true},
    rows: {type: Array, required: true},
    modelValue: {type: Object, required: true},
    words: {type: String, default: ""},
    shown: {type: Number, default: null},
    placeholder: {type: String, default: "Search"},
});
const emit = defineEmits(["update:modelValue", "update:words"]);
const MORE_WIDTH = 72;
const chips = ref(null);
const moreAnchor = ref(null);
const hidden = ref([]);
const hiddenFields = computed(() => props.fields.filter((field) => hidden.value.includes(field.key)));
const active = computed(() => props.fields.some((field) => !isDefault(field, props.modelValue[field.key])) || Boolean(props.words.trim()));
const change = (key, entry) => emit("update:modelValue", {...props.modelValue, [key]: entry});
const clear = () => {
    emit("update:modelValue", defaultFilter(props.fields));
    emit("update:words", "");
};

// every chip is drawn once to be measured, then the ones that run past the bar's right edge move to More
async function fit() {
    if (!chips.value) return;
    hidden.value = [];
    await nextTick();
    const room = chips.value.clientWidth;
    if (!room) return;
    hidden.value = [...chips.value.querySelectorAll("[data-filter-chip]")].filter((chip) => chip.offsetLeft + chip.offsetWidth > room - MORE_WIDTH).map((chip) => chip.dataset.filterChip);
}
let watching = null;
onMounted(() => {
    fit();
    watching = new ResizeObserver(fit);
    watching.observe(chips.value);
});
onUnmounted(() => watching?.disconnect());
watch(() => [props.fields.length, props.modelValue], () => fit(), {flush: "post"});
</script>

<template>
    <SearchBar :model-value="words" class="filter-bar" :placeholder="placeholder" data-filter-bar @update:model-value="emit('update:words', $event)">
        <div ref="chips" class="filter-chips">
            <template v-for="field in fields" :key="field.key">
                <FilterChip v-show="!hidden.includes(field.key)" :field="field" :rows="rows" :model-value="modelValue[field.key] ?? null" @update:model-value="change(field.key, $event)" />
            </template>
        </div>
        <template v-if="hiddenFields.length">
            <button type="button" class="filter-more" data-filter-more aria-haspopup="menu" :aria-expanded="Boolean(moreAnchor)" @click="moreAnchor = moreAnchor ? null : $event.currentTarget">More</button>
            <template v-if="moreAnchor">
                <MenuPanel :anchor="moreAnchor" align="end" :min-width="240" :max-width="320" @click.stop @close="moreAnchor = null">
                    <template v-for="field in hiddenFields" :key="field.key">
                        <MenuLabel>{{ field.label }}</MenuLabel>
                        <FilterChoices :field="field" :rows="rows" :model-value="modelValue[field.key] ?? null" @update:model-value="change(field.key, $event)" />
                    </template>
                </MenuPanel>
            </template>
        </template>
        <template v-if="active">
            <span v-if="shown !== null" class="filter-count" data-filter-count>{{ shown }} of {{ rows.length }}</span>
            <button type="button" class="filter-clear" data-filter-clear-all @click="clear">Clear</button>
        </template>
    </SearchBar>
</template>

<style scoped>
.filter-bar {
    flex-wrap: nowrap;
}

.filter-chips {
    display: flex;
    flex: 0 1 auto;
    gap: var(--s2);
    min-width: 0;
    overflow: hidden;
}

.filter-more,
.filter-clear {
    flex: none;
    height: 26px;
    padding: 0 9px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.filter-clear {
    border-color: transparent;
}

.filter-count {
    margin-left: auto;
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}
</style>
