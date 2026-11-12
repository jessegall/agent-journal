<script setup>
import {computed, ref, watch} from "vue";

// one input for each entry with a button to add one and a button to remove one; it emits the entries that hold
// something, as text, or as numbers while numbers is on, and emits nothing while an entry is not a number
const props = defineProps({
    modelValue: {type: Array, default: () => []},
    numbers: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
    placeholder: {type: String, default: ""},
    rule: {type: String, default: "Use numbers only."},
});
const emit = defineEmits(["update:modelValue"]);

const entries = ref(props.modelValue.map(String));
const filled = (list) => list.map((entry) => entry.trim()).filter(Boolean);
const isNumber = (entry) => Number.isFinite(Number(entry));
const problem = computed(() => (props.numbers && filled(entries.value).some((entry) => !isNumber(entry)) ? props.rule : ""));
const valueOf = (list) => (props.numbers ? filled(list).map(Number) : filled(list));

watch(() => props.modelValue, (value) => {
    if (JSON.stringify(valueOf(entries.value)) !== JSON.stringify(value)) entries.value = value.map(String);
});

function send() {
    if (!problem.value) emit("update:modelValue", valueOf(entries.value));
}

function edit(index, text) {
    entries.value[index] = text;
    send();
}

function remove(index) {
    entries.value.splice(index, 1);
    send();
}

const add = () => entries.value.push("");
</script>

<template>
    <div class="setting-entries">
        <template v-if="!entries.length">
            <p class="none">Nothing in the list yet.</p>
        </template>
        <template v-for="(entry, index) in entries" :key="index">
            <div class="entry">
                <input type="text" :inputmode="numbers ? 'decimal' : 'text'" :value="entry" :placeholder="placeholder" :disabled="disabled" :data-entry="index" @input="edit(index, $event.target.value)">
                <button type="button" class="remove" aria-label="Remove" :disabled="disabled" :data-remove="index" @click="remove(index)">×</button>
            </div>
        </template>
        <template v-if="problem">
            <span class="problem" role="alert">{{ problem }}</span>
        </template>
        <button type="button" class="add" :disabled="disabled" data-add @click="add">Add</button>
    </div>
</template>

<style scoped>
.setting-entries { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; width: 100%; }
.entry { display: flex; gap: 6px; width: 100%; }
.entry input { flex: 1; min-width: 0; height: 28px; padding: 0 10px; border: 1px solid var(--border-2); border-radius: 7px; background: var(--bg); color: var(--text); font-family: var(--mono); font-size: 11.5px; }
.entry input:focus-visible { border-color: var(--accent); outline: 0; }
.remove { flex: none; width: 28px; height: 28px; border: 1px solid var(--border-2); border-radius: 7px; background: var(--bg); color: var(--text-2); font-size: 15px; line-height: 1; cursor: pointer; }
.remove:hover { color: var(--text); background: var(--hover); }
.add { height: 26px; padding: 0 10px; border: 1px solid var(--border-2); border-radius: 7px; background: var(--bg); color: var(--text); font: inherit; font-size: 12px; cursor: pointer; }
.add:hover { background: var(--hover); }
button[disabled] { cursor: default; opacity: 0.45; }
.none { margin: 0; color: var(--text-3); font-size: 12px; }
.problem { color: var(--danger); font-size: 12px; }
</style>
