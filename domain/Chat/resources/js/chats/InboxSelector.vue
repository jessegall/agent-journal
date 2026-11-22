<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import type { ChatSummaryData } from '@generated/types/chat';
import CreateChatForm from './CreateChatForm.vue';

/**
 * Every chat the viewer is in, with its title and unread count, each a link by inbox id so a chat with no agent opens
 * as well; a viewer who may open chats can start one here, also when it is in none yet. The focus comes here when
 * the open chat is lost.
 */
defineProps<{
    chats: ChatSummaryData[];
    selectedInboxId: string | undefined;
    canCreateChats: boolean;
    chatUrl: (inboxId: string) => string;
}>();
</script>

<template>
    <nav id="chat-selector" class="flex flex-col gap-1" aria-label="Chats" tabindex="-1">
        <template v-if="chats.length === 0">
            <p class="text-small text-text-3">You are in no chats yet.</p>
        </template>
        <ul class="flex flex-col gap-0.5">
            <template v-for="chat in chats" :key="chat.inboxId">
                <li>
                    <Link
                        :href="chatUrl(chat.inboxId)"
                        :aria-current="chat.inboxId === selectedInboxId ? 'page' : undefined"
                        class="flex items-center justify-between rounded-control px-2 py-1 text-body hover:bg-hover"
                        preserve-scroll
                    >
                        <span>{{ chat.label }}</span>
                        <template v-if="chat.unread > 0">
                            <span class="text-small text-text-3">{{ chat.unread }} unread</span>
                        </template>
                    </Link>
                </li>
            </template>
        </ul>
        <template v-if="canCreateChats">
            <CreateChatForm />
        </template>
    </nav>
</template>
