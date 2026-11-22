<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import type { InboxPageData } from '@generated/types/chat';
import { takeNext as takeNextRoute } from '@generated/routes/chat';
import { questionUrl } from './agentLinks';
import MessageList from './MessageList.vue';

/**
 * Every inbox the user sits at, with what is unread and what waits, and its newest messages. Looking at it marks
 * nothing read; 'Take next' takes up the oldest question nobody has taken up.
 */
defineProps<{ data: InboxPageData }>();

function takeNext(inboxId: string): void {
    router.post(takeNextRoute().url, { inboxId }, { preserveScroll: true });
}

const page = usePage();
</script>

<template>
    <section class="flex flex-col gap-4 p-3" aria-label="Inboxes">
        <template v-if="data.panels.length === 0">
            <p class="m-auto text-empty text-text-3">You sit at no inbox.</p>
        </template>
        <template v-for="panel in data.panels" :key="panel.inbox.inboxId">
            <article
                class="flex flex-col gap-2 rounded-composer border border-border-2 p-3"
            >
                <header class="flex items-center gap-3">
                    <h2 class="text-body text-text">{{ panel.inbox.label }}</h2>
                    <span class="text-small text-text-3">
                        {{ panel.inbox.counts.unread }} unread,
                        {{ panel.inbox.counts.unclaimed }} waiting,
                        {{ panel.inbox.counts.claimed }} taken up
                    </span>
                    <template v-if="panel.inbox.counts.unclaimed > 0">
                        <button
                            type="button"
                            class="ml-auto underline"
                            @click="takeNext(panel.inbox.inboxId)"
                        >
                            Take next
                        </button>
                    </template>
                </header>
                <MessageList
                    :messages="panel.page.messages"
                    :pending="[]"
                    :refused="[]"
                    :own-inbox-id="panel.inbox.inboxId"
                    :question-url="
                        (messageId: string) => questionUrl(page.url, messageId)
                    "
                />
            </article>
        </template>
    </section>
</template>
