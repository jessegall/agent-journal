<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import ToggleItem from "../kit/ToggleItem.vue";

const props = defineProps({shared: {type: Array, required: true}, environments: {type: Array, required: true}});
const emit = defineEmits(["share"]);
const anchor = ref(null);

const toggled = (name) => (props.shared.includes(name) ? props.shared.filter((shared) => shared !== name) : [...props.shared, name]);
</script>

<template>
    <Btn small v-tip="'Which environments they can see'" @click="(e) => (anchor = anchor ? null : e.currentTarget)">Environments</Btn>
    <template v-if="anchor">
        <MenuPanel :anchor="anchor" :min-width="200" @close="anchor = null">
            <template v-for="name in environments" :key="name">
                <ToggleItem :on="shared.includes(name)" @click="emit('share', toggled(name))">{{ name }}</ToggleItem>
            </template>
        </MenuPanel>
    </template>
</template>
