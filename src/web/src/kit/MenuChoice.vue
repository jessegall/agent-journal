<script setup>
import {computed} from "vue";
import {useAnchoredAction} from "../composables/anchored.js";
import Btn from "./Btn.vue";
import MenuItem from "./MenuItem.vue";
import MenuPanel from "./MenuPanel.vue";

const props = defineProps({
    options: {type: Array, default: () => []},
    value: {type: String, default: ""},
    empty: {type: String, default: "Pick one"},
});
const emit = defineEmits(["pick"]);
const {anchor, toggle} = useAnchoredAction();
const current = computed(() => props.options.find((option) => option.value === props.value));

function pick(value) {
    anchor.value = null;
    emit("pick", value);
}
</script>

<template>
    <span class="menu-choice">
        <Btn small :aria-expanded="!!anchor" @click="toggle">{{ current ? current.label : empty }}</Btn>
        <template v-if="anchor">
            <MenuPanel :anchor="anchor" :min-width="180" :max-width="280" @click.stop @close="anchor = null">
                <template v-for="option in options" :key="option.value">
                    <MenuItem :on="option.value === value" @click="pick(option.value)">{{ option.label }}</MenuItem>
                </template>
            </MenuPanel>
        </template>
    </span>
</template>
