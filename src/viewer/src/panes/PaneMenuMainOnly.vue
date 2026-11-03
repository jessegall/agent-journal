<script setup>
import Btn from "../kit/Btn.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import {isMainOnly, mainOnlyOptions} from "../domain/markFamilies.js";

const props = defineProps({option: {type: Object, required: true}, values: {type: Object, default: () => ({})}});
const emit = defineEmits(["set"]);

const valueOf = (key) => props.values[key];

function choose() {
    Object.entries(mainOnlyOptions(props.option.declarations, props.option.group, valueOf)).forEach(([key, shown]) => emit("set", key, shown));
}
</script>

<template>
    <MenuLabel class="pane-menu-group" :data-group="option.group">{{ option.title }}</MenuLabel>
    <Btn small class="pane-menu-main-only" :data-option="option.key" :aria-pressed="isMainOnly(option.declarations, option.group, valueOf)" @click="choose">{{ option.label }}</Btn>
</template>
