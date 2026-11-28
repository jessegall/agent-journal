<script setup lang="ts">
import Button from "@kit/Button";
import Icon from "@kit/Icon";
import Kbd from "@kit/Kbd";
import type { AgentOptionData } from "@generated/types/chat";
import { openAgentTerminal } from "../../../composables/useTerminalModal";

/**
 * The chat list's foot, which stays while the list scrolls: New chat, which starts another main agent, then what the
 * chosen chat offers: its terminal while it runs in one, Switch driver… and End session while its status offers it.
 * Nothing here starts or resumes a session: the next message does.
 */
defineProps<{
  chosenAgent: AgentOptionData | undefined;
  terminalAgent: AgentOptionData | undefined;
  endableAgent: AgentOptionData | undefined;
}>();

const emit = defineEmits<{ newChat: []; switchDriver: []; endSession: [] }>();
</script>

<template>
  <div class="flex flex-col gap-1.5 border-t border-line px-3 py-2">
    <button
      type="button"
      class="flex items-center gap-2 rounded-field px-1.5 py-1 text-left text-body text-text hover:bg-hover"
      data-new-chat
      @click="emit('newChat')"
    >
      <Icon name="plus" :size="14" />
      <span class="flex flex-1 flex-col leading-[1.25]"
        >New chat<small class="text-badge text-text-3"
          >Starts another main agent</small
        ></span
      >
      <Kbd>⌥N</Kbd>
    </button>
    <template v-if="chosenAgent">
      <div
        class="flex flex-wrap items-center gap-1.5"
        role="group"
        :aria-label="`${chosenAgent.name}'s chat`"
      >
        <span class="mr-auto truncate text-badge text-text-3">{{
          chosenAgent.name
        }}</span>
        <template v-if="terminalAgent">
          <Button
            size="small"
            data-open-terminal
            @click="openAgentTerminal(terminalAgent)"
          >
            <Icon name="term" :size="14" />
            {{ terminalAgent.sessionDriverLabel ?? "Its" }} terminal
          </Button>
        </template>
        <Button
          size="small"
          aria-haspopup="dialog"
          data-switch-driver
          @click="emit('switchDriver')"
          >Switch driver…</Button
        >
        <Button
          size="small"
          data-end-session
          :disabled="endableAgent === undefined"
          :title="
            endableAgent === undefined
              ? 'No session is running'
              : 'Ends the session; the chat stays, and your next message starts a new one'
          "
          @click="emit('endSession')"
          >End session</Button
        >
      </div>
    </template>
  </div>
</template>
