<script setup>
import Btn from "../kit/Btn.vue";

const props = defineProps({option: {type: Object, required: true}, values: {type: Object, default: () => ({})}});
const emit = defineEmits(["set"]);

const isOn = () => Boolean(props.values[props.option.key] ?? props.option.default);
</script>

<template>
    <Btn :data-option="option.key" :aria-pressed="isOn()" @click="emit('set', option.key, !isOn())">
        {{ option.label }}
    </Btn>
</template>
