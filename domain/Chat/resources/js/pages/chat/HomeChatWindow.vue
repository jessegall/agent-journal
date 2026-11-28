<script setup lang="ts">
import type { ChatWindowData } from "@generated/types/chat";
import ChatWindow from "./ChatWindow.vue";

const chat = defineProps<ChatWindowData>();
</script>

<template>
  <ChatWindow :data="chat" />
</template>
