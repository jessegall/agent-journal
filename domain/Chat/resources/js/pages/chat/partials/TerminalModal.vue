<script setup lang="ts">
import Dialog from "@kit/Dialog";
import type { AgentOptionData } from "@generated/types/chat";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  closeAgentTerminal,
  terminalModal,
} from "../../../composables/useTerminalModal";
import SessionTerminal from "./SessionTerminal.vue";

/**
 * An agent's own terminal as a centred modal over the page, for looking in on it: never a tab, a window or a part of
 * Home. Closing it ends its read; a line a browser writer left unsent holds the close until it is settled.
 */
const props = defineProps<{ agents: AgentOptionData[] }>();

const terminal = ref<InstanceType<typeof SessionTerminal> | null>(null);
const agent = computed(() =>
  props.agents.find((option) => option.id === terminalModal.agentId),
);

function close(): void {
  if (terminal.value?.holdsCloseForDraft()) {
    return;
  }

  closeAgentTerminal();
}

onMounted(() => terminalModal.mountedWindows++);
onBeforeUnmount(() => terminalModal.mountedWindows--);
</script>

<template>
  <Dialog
    :open="agent !== undefined"
    :title="`Terminal · ${agent?.name ?? ''}`"
    size="lg"
    flush
    @close="close"
  >
    <template v-if="agent">
      <div
        class="flex h-[min(560px,calc(100dvh-160px))] min-h-0 flex-col"
        data-terminal-modal
      >
        <div class="min-h-0 flex-1">
          <SessionTerminal
            ref="terminal"
            :agent-id="agent.id"
            :is-shown="true"
            :expected="terminalModal.expected"
            :waits-for-choice="agent.needsAttention"
            @back-to-chat="close"
          />
        </div>
        <p class="border-t border-line px-3 py-1.5 text-meta text-text-3">
          What you type here goes to {{ agent.name }}. Ctrl+C stops it. To
          close, press × or click outside.
        </p>
      </div>
    </template>
  </Dialog>
</template>
