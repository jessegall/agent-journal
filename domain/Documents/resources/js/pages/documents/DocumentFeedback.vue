<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import Icon from '@kit/Icon';
import Menu from '@kit/Menu';
import MenuItem from '@kit/MenuItem';
import type { DocumentFeedbackPartData } from '@generated/types/documents';

/**
 * Ask for feedback on the whole document: a menu of the agents the reader may see; choosing one sends that agent a
 * chat message asking for feedback on it.
 */
const props = defineProps<DocumentFeedbackPartData>();

function ask(agentId: string): void {
    router.post(props.address, { agent: agentId }, { preserveScroll: true });
}
</script>

<template>
    <Menu
        label="Ask for feedback"
        align="left"
        trigger-class="h-6 gap-1.5 rounded-button border border-border-2 px-2 text-small text-text-2 hover:bg-hover hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
        <template #trigger><Icon name="chat" :size="14" />Ask for feedback</template>
        <template v-for="recipient in recipients" :key="recipient.id">
            <MenuItem @click="ask(recipient.id)">{{ recipient.name }}</MenuItem>
        </template>
    </Menu>
</template>
