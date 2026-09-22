<script setup>
import {ref, watch} from "vue";
import Icon from "./Icon.vue";

const props = defineProps({value: {type: String, default: ""}, placeholder: {type: String, default: ""}});
const emit = defineEmits(["change"]);
const lines = ref([]);

watch(
    () => props.value,
    (value) => (lines.value = value.split("\n").filter((line) => line.trim())),
    {immediate: true}
);

const save = () =>
    emit(
        "change",
        lines.value
            .map((line) => line.trim())
            .filter(Boolean)
            .join("\n")
    );
const remove = (i) => {
    lines.value.splice(i, 1);
    save();
};
</script>

<template>
    <div class="line-list">
        <template v-for="(line, i) in lines" :key="i">
            <div class="line-row">
                <input v-model="lines[i]" class="line-input" spellcheck="false" :placeholder="placeholder" @change="save" />
                <button type="button" class="line-remove" title="Remove" @click="remove(i)"><Icon name="x" :size="12" /></button>
            </div>
        </template>
        <button type="button" class="line-add" @click="lines.push('')">
            <Icon name="plus" :size="12" />
            Add
        </button>
    </div>
</template>

<style scoped>
.line-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.line-row {
    display: flex;
    align-items: center;
    gap: 6px;
}

.line-input {
    flex: 1;
    min-width: 0;
    padding: 6px 9px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
}

.line-input:focus {
    outline: none;
    border-color: var(--accent);
}

.line-remove,
.line-add {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.line-remove {
    padding: 5px;
}

.line-add {
    align-self: flex-start;
    padding: 4px 6px;
}

.line-remove:hover,
.line-add:hover {
    background: var(--hover);
    color: var(--text);
}
</style>
