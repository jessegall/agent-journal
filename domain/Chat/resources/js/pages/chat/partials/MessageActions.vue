<script setup lang="ts">
import MessageAction from "./MessageAction.vue";
import ReactionChoice from "./ReactionChoice.vue";

/**
 * The hover controls of a message, in the order the design draws them on its name line: React, then Reply.
 */
defineProps<{ authorLabel: string }>();

const emit = defineEmits<{ react: [emoji: string]; reply: [] }>();
</script>

<template>
  <ReactionChoice :speaker="authorLabel" @choose="(emoji) => emit('react', emoji)" />
  <MessageAction icon="reply" @click="emit('reply')">Reply</MessageAction>
</template>
