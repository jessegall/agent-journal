<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import Segmented from "../kit/Segmented.vue";
import {TRIGGER_KINDS, blankTrigger, kindOf} from "../domain/sequenceTriggers.js";

const props = defineProps({cards: {type: Array, required: true}});
const kinds = computed(() => TRIGGER_KINDS.map((kind) => ({key: kind.value, label: kind.label})));
let made = 2000;

const add = () => props.cards.push({key: ++made, ...blankTrigger()});
</script>

<template>
    <ol class="trigger-cards">
        <template v-for="(t, i) in cards" :key="t.key">
            <li class="trigger-card">
                <div class="trigger-row">
                    <Segmented wrap :options="kinds" :value="t.trigger_type" @pick="(kind) => (t.trigger_type = kind)" />
                    <span class="grow" />
                    <button type="button" class="trigger-tool" aria-label="Remove this trigger" @click="cards.splice(i, 1)">
                        <Icon name="close" :size="12" />
                    </button>
                </div>
                <template v-for="field in kindOf(t.trigger_type).fields" :key="field.name">
                    <label class="trigger-field">
                        <span class="trigger-label">{{ field.label }}</span>
                        <input v-model="t[field.name]" :placeholder="field.placeholder" />
                    </label>
                </template>
            </li>
        </template>
    </ol>
    <button type="button" class="add-trigger" @click="add">
        <Icon name="plus" :size="12" />
        Add a trigger
    </button>
</template>

<style scoped>
.trigger-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.trigger-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 10px 10px 12px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
}

.trigger-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
}

.grow {
    flex: 1;
}

.trigger-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.trigger-label {
    color: var(--text-3);
    font-size: 12px;
}

.trigger-field input {
    box-sizing: border-box;
    padding: 6px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 13px;
}

.trigger-tool {
    display: inline-grid;
    place-items: center;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.trigger-tool:hover {
    background: var(--hover);
    color: var(--text);
}

.add-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    margin-top: 10px;
    padding: 9px;
    border: 1px dashed var(--border-2);
    border-radius: 10px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
}

.add-trigger:hover {
    border-color: var(--accent);
    color: var(--accent-text);
}
</style>
