<script setup>
import {ref} from "vue";
import {phone} from "../api/phone.js";
import Btn from "../kit/Btn.vue";

const props = defineProps({
    target: {type: String, required: true},
    buttons: {type: Array, required: true},
    large: {type: Boolean, default: false},
});
const emit = defineEmits(["pressed", "failed"]);
const pressing = ref("");

async function press(button) {
    pressing.value = button.label;
    try {
        await phone.press(props.target, button.label);
        emit("pressed", button.label);
    } catch (error) {
        emit("failed", error);
    } finally {
        pressing.value = "";
    }
}
</script>

<template>
    <template v-for="(button, i) in buttons" :key="button.label">
        <Btn
            :kind="i === 0 ? 'primary' : ''"
            :large="large"
            :busy="pressing === button.label"
            :disabled="Boolean(pressing)"
            @click="press(button)"
        >
            {{ button.label }}
        </Btn>
    </template>
</template>
