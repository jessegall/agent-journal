<script setup>
import Btn from "../src/kit/Btn.vue";
import Icon from "../src/kit/Icon.vue";

// a list of texts in order, each in its own box with its number and the buttons to move it up, move it down and remove it, and a button under it to add one;
// the steps of a sequence and the parts of a template are written in it. kind names its data attributes: kind "step" gives data-step-text, data-step-up and so on.
const props = defineProps({
    items: {type: Array, required: true},
    kind: {type: String, default: "item"},
    noun: {type: String, default: "Item"},
    placeholder: {type: String, default: ""},
    addLabel: {type: String, default: "Add one"},
    // the last one cannot be removed while the list must not be empty
    keepOne: {type: Boolean, default: true},
});
const emit = defineEmits(["items"]);

function changed(at, text) {
    emit("items", props.items.map((item, index) => (index === at ? text : item)));
}

function moved(at, by) {
    const items = [...props.items];
    const [item] = items.splice(at, 1);
    items.splice(at + by, 0, item);
    emit("items", items);
}

const removed = (at) => emit("items", props.items.filter((_, index) => index !== at));
</script>

<template>
    <ol class="text-list">
        <template v-for="(item, index) in items" :key="index">
            <li class="text-card">
                <span class="text-number">{{ index + 1 }}</span>
                <textarea :value="item" rows="2" :aria-label="`${noun} ${index + 1}`" :placeholder="placeholder" :[`data-${kind}-text`]="''" @input="changed(index, $event.target.value)" />
                <div class="text-moves">
                    <Btn small :disabled="index === 0" :aria-label="`Move ${noun.toLowerCase()} ${index + 1} up`" :[`data-${kind}-up`]="''" @click="moved(index, -1)"><Icon name="up" :size="12" /></Btn>
                    <Btn small :disabled="index === items.length - 1" :aria-label="`Move ${noun.toLowerCase()} ${index + 1} down`" :[`data-${kind}-down`]="''" @click="moved(index, 1)"><Icon name="down" :size="12" /></Btn>
                    <Btn small :disabled="keepOne && items.length === 1" :aria-label="`Remove ${noun.toLowerCase()} ${index + 1}`" :[`data-${kind}-remove`]="''" @click="removed(index)"><Icon name="trash" :size="12" /></Btn>
                </div>
            </li>
        </template>
    </ol>
    <Btn small bordered :[`data-${kind}-add`]="''" @click="emit('items', [...items, ''])">{{ addLabel }}</Btn>
</template>

<style scoped>
.text-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0 0 8px;
    padding: 0;
    list-style: none;
}

.text-card {
    display: flex;
    gap: 8px;
    align-items: flex-start;
}

.text-number {
    flex: none;
    width: 18px;
    padding-top: 8px;
    color: var(--text-3);
    font-size: 12px;
    text-align: right;
    font-variant-numeric: tabular-nums;
}

.text-moves {
    display: flex;
    flex: none;
    gap: 2px;
}

textarea {
    flex: 1;
    box-sizing: border-box;
    min-width: 0;
    padding: 6px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    resize: vertical;
}
</style>
