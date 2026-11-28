<script setup lang="ts">
import { computed } from "vue";
import type { ChatData } from "@generated/types/chat";
import { useAppContext } from "@kit/appContext";
import { useOpenChats } from "../../composables/useOpenChats";
import ChatTabs from "./partials/ChatTabs.vue";
import { useStatusAnnouncement } from "../../composables/useStatusAnnouncement";
import { useChatListShortcut } from "../../composables/useChatBarAsks";

/**
 * Home's part of the one chat bar: the open chats as tabs with New chat and the chat layout. The chosen agent is named
 * in its chat, above the composer; here its state changes are read out, and Option+F opens its chat list.
 */
const props = defineProps<{ data: ChatData }>();

const viewerId = useAppContext().viewer.value.id ?? "guest";
const openChats = useOpenChats(viewerId);

// Option+F opens the list of the chosen agent's chat: one listener for Home.
useChatListShortcut(() => props.data.selectedAgentId);

// The chats that have a column now: the chosen one, and side by side those beside it.
const columnAgentIds = computed(() =>
  openChats.chats.columns > 1 && props.data.selectedAgentId !== undefined
    ? [props.data.selectedAgentId, ...openChats.besideOf(props.data.selectedAgentId)]
    : [],
);
const selected = computed(() => props.data.agents.find((agent) => agent.id === props.data.selectedAgentId));
const announcement = useStatusAnnouncement(
  () => selected.value?.status,
  () => false,
);
</script>

<template>
  <div class="relative z-90 flex h-full min-w-0 flex-1 items-center gap-2" data-chosen-agent>
    <ChatTabs :agents="data.agents" :selected-agent-id="data.selectedAgentId" :column-agent-ids="columnAgentIds" />
    <template v-if="data.isSetupRequired">
      <span class="text-small whitespace-nowrap text-text-3"
        >No main agent yet: run <code>php artisan agents:install</code>.</span
      >
    </template>
    <p class="sr-only" aria-live="polite">{{ announcement.polite.value }}</p>
    <p class="sr-only" role="alert">{{ announcement.alert.value }}</p>
  </div>
</template>
