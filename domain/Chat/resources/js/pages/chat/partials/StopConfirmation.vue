<script setup lang="ts">
import Button from "@kit/Button";
import Dialog from "@kit/Dialog";

/**
 * Asks before the agent's session ends, naming the agent and what ending does; Close leaves everything as it is.
 */
defineProps<{ agentName: string; isPending: boolean }>();

const emit = defineEmits<{ confirm: []; close: [] }>();
</script>

<template>
  <Dialog
    :open="true"
    :title="`End ${agentName}'s session?`"
    @close="emit('close')"
  >
    <p class="text-body text-text">
      Ending stops this session; the conversation stays, and your next message
      starts the agent again.
    </p>
    <template #footer>
      <Button variant="ghost" @click="emit('close')">Cancel</Button>
      <Button variant="danger" :pending="isPending" @click="emit('confirm')"
        >End session</Button
      >
    </template>
  </Dialog>
</template>
