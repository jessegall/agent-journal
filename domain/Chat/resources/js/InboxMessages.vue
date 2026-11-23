<script setup lang="ts">
import { usePage } from "@inertiajs/vue3";
import type { InboxMessagesPartData } from "@generated/types/chat";
import { questionUrl } from "./agentLinks";
import InboxMessageList from "./InboxMessageList.vue";

/**
 * One inbox's newest messages as a native part of the Inbox page: the bounded slice the server read, each question
 * linking to its own place; a live change of the inbox replaces the slice in place.
 */
defineProps<InboxMessagesPartData>();

const page = usePage();
</script>

<template>
  <InboxMessageList
    :messages="messages"
    :pending="[]"
    :refused="[]"
    :own-inbox-id="inboxId"
    :question-url="(messageId: string) => questionUrl(page.url, messageId)"
  />
</template>
