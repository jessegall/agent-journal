<script setup>
import {badgeClass} from "../domain/badgeLook.js";

defineProps({text: {type: String, required: true}, tone: {type: String, default: ""}});
</script>

<template>
    <span :class="badgeClass(tone)">{{ text }}</span>
</template>

<style scoped src="./badgeLook.css"></style>
