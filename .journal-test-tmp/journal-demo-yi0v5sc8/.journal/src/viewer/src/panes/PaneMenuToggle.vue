<script setup>
import MenuItem from "../kit/MenuItem.vue";

const props = defineProps({option: {type: Object, required: true}, values: {type: Object, default: () => ({})}});
const emit = defineEmits(["set"]);

const isOn = () => Boolean(props.values[props.option.key] ?? props.option.default);
</script>

<template>
    <MenuItem :data-option="option.key" :checked="isOn()" :aria-pressed="isOn()" @click="emit('set', option.key, !isOn())">{{ option.label }}</MenuItem>
</template>
