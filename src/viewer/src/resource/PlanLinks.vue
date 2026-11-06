<script setup>
import ResourceLinks from "../../kit/ResourceLinks.vue";

defineProps({id: {type: Number, required: true}, documentId: {type: Number, default: 0}, read: {type: Function, required: true}});
defineEmits(["open"]);
</script>

<template>
    <ResourceLinks model="plan" :id="id" :document-id="documentId" :read="read" link-attribute="data-plan-link" data-plan-links @open="$emit('open', $event)" />
</template>
