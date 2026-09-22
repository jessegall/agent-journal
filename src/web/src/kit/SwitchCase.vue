<script setup>
import {computed, useSlots} from "vue";
const props = defineProps({value: {type: [String, Number], required: true}});
const slots = useSlots();
const slotName = computed(() => (slots[String(props.value)] ? String(props.value) : "default"));
</script>
<template><slot :name="slotName" /></template>
