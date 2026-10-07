<script setup>
import Btn from "./Btn.vue";
import Icon from "./Icon.vue";

defineProps({title: {type: String, default: "Close"}});
</script>

<template>
    <Btn kind="icon" v-tip="title"><Icon name="x" /></Btn>
</template>
