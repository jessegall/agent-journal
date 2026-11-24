<script setup lang="ts">
import Icon from "@kit/Icon";
import MenuItem from "@kit/MenuItem";
import MenuItemLabel from "@kit/MenuItemLabel";
import type { AgentOptionData } from "@generated/types/chat";
import { chatRoster } from "./composables/useChatRoster";
import { openAgentTerminal } from "./composables/useTerminalModal";

/**
 * What the conversation menu offers below the conversations: the chosen agent's terminal while it runs in one, Add
 * someone to this chat, and New group chat for who may make chats.
 */
defineProps<{
  terminalAgent: AgentOptionData | undefined;
  canCreateChats: boolean;
}>();

const emit = defineEmits<{ newGroup: [] }>();
</script>

<template>
  <template v-if="terminalAgent">
    <MenuItem data-open-terminal @click="openAgentTerminal(terminalAgent)">
      <template #leading>
        <Icon name="term" :size="14" />
      </template>
      <MenuItemLabel
        >Open {{ terminalAgent.sessionDriverLabel ?? "its" }}
        terminal</MenuItemLabel
      >
    </MenuItem>
  </template>
  <MenuItem data-add-someone @click="chatRoster.isOpen = true">
    <template #leading>
      <Icon name="userplus" :size="14" />
    </template>
    <MenuItemLabel>Add someone to this chat…</MenuItemLabel>
  </MenuItem>
  <template v-if="canCreateChats">
    <MenuItem data-new-group @click="emit('newGroup')">
      <template #leading>
        <Icon name="users" :size="14" />
      </template>
      <MenuItemLabel>New group chat…</MenuItemLabel>
    </MenuItem>
  </template>
</template>
