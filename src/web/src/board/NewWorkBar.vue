<script setup>
import Btn from "../kit/Btn.vue";
import Segmented from "../kit/Segmented.vue";

defineProps({
    note: {type: String, default: ""},
    missing: {type: Array, required: true},
    presets: {type: Array, required: true},
    preset: {default: ""},
    phone: {type: Boolean, default: false},
    redraftable: {type: Boolean, default: false},
    addable: {type: Boolean, default: false},
    adding: {type: Boolean, default: false},
    addLabel: {type: String, default: ""},
});
const emit = defineEmits(["choose", "again", "add"]);
</script>

<template>
    <div class="bar">
        <div class="note">
            <span class="note-main">{{ note }}</span>
            <template v-if="missing.length">
                <span class="note-sub" :title="missing.join('; ')">Missing: {{ missing.join("; ") }}</span>
            </template>
        </div>
        <template v-if="presets.length > 1 && !phone">
            <Segmented class="presets" :options="presets" :value="preset" @pick="(key) => emit('choose', key)" />
        </template>
        <Btn small :disabled="!redraftable" @click="emit('again')">Ask for a different set</Btn>
        <Btn kind="primary" small class="add" :busy="adding" :disabled="!addable" @click="emit('add')">
            {{ addLabel }}
        </Btn>
    </div>
</template>

<style scoped>
.bar {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    height: 52px;
    padding: 0 8px 0 16px;
    border-bottom: 1px solid var(--border);
}

.tabs .bar {
    order: 2;
    flex-wrap: wrap;
    align-content: center;
    row-gap: 6px;
    height: 88px;
    padding: 0 8px;
    border-top: 1px solid var(--border);
    border-bottom: 0;
}

.note {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
    line-height: 16px;
}

.tabs .note {
    flex: 1 0 100%;
    flex-direction: row;
    gap: 8px;
    height: 20px;
    align-items: center;
}

.note-main,
.note-sub {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.note-main {
    color: var(--text-3);
    font-size: 13px;
}

.tabs .note-main {
    flex: none;
    font-size: 12.5px;
}

.note-sub {
    color: var(--warn, var(--blocking));
    font-size: 11.5px;
}

.presets {
    flex: 0 1 auto;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
}

.presets :deep(.segmented-option) {
    white-space: nowrap;
}

.add {
    min-width: 140px;
    font-variant-numeric: tabular-nums;
}

.tabs .bar > :deep(.btn) {
    flex: 1;
}

.tabs .note {
    justify-content: flex-start;
}

.phone .bar > :deep(.btn) {
    min-height: 40px;
}
</style>
