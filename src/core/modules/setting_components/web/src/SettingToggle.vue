<script setup>
import {Switch} from "@journal/window-kit";

defineProps({modelValue: {type: Boolean, default: false}, disabled: {type: Boolean, default: false}});
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
    <Switch class="setting-toggle" :on="modelValue" :word="modelValue ? 'On' : 'Off'" :disabled="disabled" @change="emit('update:modelValue', !modelValue)" />
</template>
