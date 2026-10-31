<script setup>
import Btn from "./Btn.vue";
</script>

<template>
    <Btn kind="text" class="reset-button"><slot>Reset</slot></Btn>
</template>

<style scoped>
.reset-button {
    color: var(--accent-text);
    font-size: 12px;
}
</style>
