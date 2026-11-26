<script setup lang="ts">
import { computed } from 'vue';
import Button from './Button.vue';
import Card from './Card.vue';
import Status from './Status.vue';

/**
 * A comment on some lines with its answers, as a bordered card: its head names the author, the recipient, the lines and
 * a live status, then the text, the replies, and Reply and the chat button, which the page handles. A part the server
 * does not supply is left out by its flag.
 */
const props = withDefaults(
    defineProps<{
        author: string;
        name: string;
        lines: string;
        text: string;
        isSent: boolean;
        replies: { id: number; author: string; text: string }[];
        hasReceipt?: boolean;
        canReply?: boolean;
        canOpenChat?: boolean;
    }>(),
    { hasReceipt: true, canReply: true, canOpenChat: true },
);

defineEmits<{ reply: []; openChat: [] }>();

const statusState = computed(() => (props.isSent ? 'done' : 'working'));
const statusLabel = computed(() => (props.isSent ? `Read by ${props.name}` : 'Sending'));
</script>

<template>
    <Card tone="plain" role="group" :aria-label="`Comment on ${lines}`">
        <div class="flex items-center justify-between gap-3 text-badge text-text-3">
            <span class="min-w-0 truncate">{{ author }}<template v-if="name !== ''"> → {{ name }}</template> · {{ lines }}</span>
            <template v-if="hasReceipt">
                <Status :state="statusState" :label="statusLabel" live />
            </template>
        </div>
        <p class="mt-1.5 text-field text-text [overflow-wrap:anywhere]">{{ text }}</p>
        <ul v-if="replies.length > 0" class="m-0 mt-2 flex list-none flex-col gap-1.5 p-0">
            <li v-for="reply in replies" :key="reply.id" class="text-small text-text-2 [overflow-wrap:anywhere]">
                <b class="font-medium text-text">{{ reply.author }}</b> {{ reply.text }}
            </li>
        </ul>
        <div v-if="canReply || canOpenChat" class="mt-2 flex items-center gap-2">
            <Button v-if="canReply" size="sm" @click="$emit('reply')">Reply</Button>
            <Button v-if="canOpenChat" size="sm" @click="$emit('openChat')">{{ name }}'s chat</Button>
        </div>
    </Card>
</template>
