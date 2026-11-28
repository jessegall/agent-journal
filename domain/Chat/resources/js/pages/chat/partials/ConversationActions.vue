<script setup lang="ts">
import Button from "@kit/Button";
import Icon from "@kit/Icon";
import Kbd from "@kit/Kbd";
import type { AgentOptionData } from "@generated/types/chat";
import { openAgentTerminal } from "../../../composables/useTerminalModal";

/**
 * The bottom of the chat list, which stays while the list scrolls: New chat, and what the chosen chat offers, Stop the
 * turn while its agent works, its terminal, Switch driver… and End session. A chat with no session starts from its
 * start picker.
 */
defineProps<{
  chosenAgent: AgentOptionData | undefined;
  terminalAgent: AgentOptionData | undefined;
  endableAgent: AgentOptionData | undefined;
  workingAgent: AgentOptionData | undefined;
}>();

const emit = defineEmits<{ newChat: []; switchDriver: []; endSession: []; stopTurn: []; technicalDetails: [] }>();
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
        <template v-if="workingAgent">
          <Button size="small" data-stop-turn @click="emit('stopTurn')">
            <Icon name="stop" :size="14" />
            Stop the turn
          </Button>
        </template>
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
        <Button size="small" aria-haspopup="dialog" data-technical-details @click="emit('technicalDetails')"
          >Technical details</Button
        >
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
