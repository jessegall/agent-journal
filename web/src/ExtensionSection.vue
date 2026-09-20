<script setup lang="ts">
import ChatWindow from "./layout/ChatWindow.vue";

defineProps<{extension: unknown}>();
</script>

<template>
    <ChatWindow floating />
</template>
