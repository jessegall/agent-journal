<script setup lang="ts">
import Button from "@kit/Button";
import type { StatusActionData } from "@generated/types/chat";

/**
 * One action the agent's status offers in the agent bar, as a bordered button with the server's words, as the design
 * draws the agent bar's actions.
 */
defineProps<{
  action: StatusActionData;
  isPending: boolean;
}>();

const emit = defineEmits<{ activate: [] }>();
</script>

<template>
  <Button
    variant="bordered"
    size="small"
    :pending="isPending"
    @click="emit('activate')"
  >
    {{ action.label }}
  </Button>
</template>
