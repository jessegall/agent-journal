<script setup>
import Btn from "./Btn.vue";
import Icon from "./Icon.vue";

const emit = defineEmits(["back"]);
</script>

<template>
    <Btn small aria-label="Back" data-resource-back @click="emit('back')"><Icon name="back" :size="12" /></Btn>
</template>
