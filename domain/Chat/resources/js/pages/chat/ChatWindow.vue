<script setup lang="ts">
import { useWindowReload } from "@kit/useWindowQuery";
import type { ChatData } from "@generated/types/chat";
import ChatPane from "./partials/ChatPane.vue";
import TerminalModal from "./partials/TerminalModal.vue";

defineProps<{ data: ChatData }>();
const reload = useWindowReload();

function loadMore(token: string): void {
  reload({ dock: token });
}
</script>

<template>
  <ChatPane :chat="data" :offers-choice="true" :load-more="loadMore" protected-prop="page" />
  <TerminalModal :agents="data.agents" />
</template>
