<script setup>
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";

// the button that goes back to the row an inspector was opened from
const emit = defineEmits(["back"]);
</script>

<template>
    <Btn variant="icon" title="Back" aria-label="Back" data-resource-back @click="emit('back')"><Icon name="back" :size="13" /></Btn>
</template>
