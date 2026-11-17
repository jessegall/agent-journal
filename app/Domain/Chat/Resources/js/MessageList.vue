<script setup lang="ts">
import type { MessageData } from '@generated/types/chat';

/**
 * The messages of one conversation, oldest first, each body shown exactly as it was typed.
 */
defineProps<{ messages: MessageData[] }>();
</script>

<template>
    <div class="flex flex-1 flex-col gap-2.5 overflow-y-auto pt-4.5 pb-2">
        <template v-if="messages.length === 0">
            <div class="m-auto flex flex-col items-center gap-1 text-center">
                <p class="text-empty text-text-2">No messages yet</p>
                <p class="text-small text-text-3">
                    Send a message below to start a conversation.
                </p>
            </div>
        </template>
        <template v-for="message in messages" :key="message.id">
            <p
                class="ml-auto max-w-[85%] rounded-bubble bg-raised px-3 py-2 text-body whitespace-pre-wrap text-text"
            >
                {{ message.body }}
            </p>
        </template>
    </div>
</template>
