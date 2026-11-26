<script setup lang="ts">
import Button from "@kit/Button";
import Icon from "@kit/Icon";
import type { StatusActionData } from "@generated/types/chat";

/**
 * One action the agent's status offers now, as a bordered button with the server's words, Stop with its mark, as the
 * design draws the agent bar's actions.
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
    <template v-if="action.type === 'stop'">
      <Icon name="stop" :size="14" />
    </template>
    {{ action.label }}
  </Button>
</template>
