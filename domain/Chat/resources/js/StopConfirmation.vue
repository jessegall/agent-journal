<script setup lang="ts">
import Button from '@kit/Button';
import Dialog from '@kit/Dialog';

/**
 * Asks before the agent's session is stopped, naming the agent and what stopping does; Close leaves everything as it
 * is.
 */
defineProps<{ agentName: string; isPending: boolean }>();

const emit = defineEmits<{ confirm: []; close: [] }>();
</script>

<template>
    <Dialog :open="true" :title="`Stop ${agentName}'s session?`" @close="emit('close')">
        <p class="text-body text-text">Stopping ends this session; the conversation stays.</p>
        <template #footer>
            <Button variant="ghost" @click="emit('close')">Cancel</Button>
            <Button variant="danger" :pending="isPending" @click="emit('confirm')">Stop session</Button>
        </template>
    </Dialog>
</template>
