<script setup lang="ts">
import Avatar from "@kit/Avatar";
import MenuItem from "@kit/MenuItem";
import MenuItemLabel from "@kit/MenuItemLabel";
import MenuItemSub from "@kit/MenuItemSub";
import type { AgentOptionData } from "@generated/types/chat";
import { carriesRecord } from "../../../composables/useHandOver";

/**
 * One conversation of the conversation menu: the agent's avatar, its name and a sub line, ticked when it is the chat
 * shown; a record let go on it is handed to that agent.
 */
defineProps<{ agent: AgentOptionData; subLine: string; isChosen: boolean }>();

const emit = defineEmits<{ choose: []; drop: [event: DragEvent] }>();
</script>

<template>
  <MenuItem
    :checked="isChosen"
    :data-conversation="agent.id"
    @click="emit('choose')"
    @dragover="carriesRecord($event) && $event.preventDefault()"
    @drop.prevent="emit('drop', $event)"
  >
    <template #leading>
      <Avatar
        :participant="{ kind: 'agent', driver: agent.sessionDriver ?? '' }"
      />
    </template>
    <MenuItemLabel>{{ agent.name }}</MenuItemLabel>
    <MenuItemSub>{{ subLine }}</MenuItemSub>
  </MenuItem>
</template>
