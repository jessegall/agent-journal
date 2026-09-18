<script setup>
import { computed, useSlots } from "vue";
const props = defineProps({ value: { type: [String, Number], required: true } });
const slots = useSlots();
const shown = computed(() => (slots[String(props.value)] ? String(props.value) : "default"));
</script>
<template><slot :name="shown" /></template>
