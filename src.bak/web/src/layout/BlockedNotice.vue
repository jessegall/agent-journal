<script setup>
import {blocked} from "../composables/blocked.js";
import Toast from "../kit/Toast.vue";

const clear = () => (blocked.value = null);
</script>

<template>
    <Toast :toast="blocked" @done="clear" />
</template>
