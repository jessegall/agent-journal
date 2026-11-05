<script setup>
import {computed, ref} from "vue";
import FoldSign from "../kit/FoldSign.vue";
import PaneMenuChoice from "./PaneMenuChoice.vue";
import PaneMenuMainOnly from "./PaneMenuMainOnly.vue";
import PaneMenuPreset from "./PaneMenuPreset.vue";
import PaneMenuToggle from "./PaneMenuToggle.vue";
import {MARKS_SECTION} from "../domain/markFamilies.js";

const CONTROLS = {toggle: PaneMenuToggle, main: PaneMenuMainOnly, preset: PaneMenuPreset, choice: PaneMenuChoice};

// the options of a window's menu; those a window puts in the marks section are listed one by one behind a fold under the others
const props = defineProps({declared: {type: Array, required: true}, values: {type: Object, default: () => ({})}});
const emit = defineEmits(["set"]);
const marksOpen = ref(false);
const plain = computed(() => props.declared.filter((option) => option.section !== MARKS_SECTION));
const marks = computed(() => props.declared.filter((option) => option.section === MARKS_SECTION));
const set = (key, value) => emit("set", key, value);
</script>

<template>
    <template v-for="option in plain" :key="option.key">
        <component :is="CONTROLS[option.control]" :option="option" :values="values" @set="set" />
    </template>
    <template v-if="marks.length">
        <button type="button" class="pane-menu-fold" data-menu-marks :aria-expanded="marksOpen" @click="marksOpen = !marksOpen">Choose chat updates <FoldSign :open="marksOpen" /></button>
        <template v-if="marksOpen">
            <template v-for="option in marks" :key="option.key">
                <component :is="CONTROLS[option.control]" :option="option" :values="values" @set="set" />
            </template>
        </template>
    </template>
</template>
