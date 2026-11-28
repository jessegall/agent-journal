<script setup lang="ts">
import Avatar from "@kit/Avatar";
import Chip from "@kit/Chip";
import Icon from "@kit/Icon";
import IconButton from "@kit/IconButton";
import ListRow from "@kit/ListRow";
import Status from "@kit/Status";
import { timeAgo } from "@kit/format";
import { computed } from "vue";
import type { AgentOptionData } from "@generated/types/chat";
import { matchParts } from "../../../chatList";
import { sessionLooks } from "../../../sessionLooks";
import { carriesRecord } from "../../../composables/useHandOver";

/**
 * One chat of the chat list: the agent's avatar, its name with the search's match underlined and a main chip, what it
 * does now, how long ago its chat moved, its state mark, the viewer's unread count and a chip when its question waits
 * for the viewer; the chat shown is ticked, any other offers Open beside. A record let go on it is handed to that agent.
 */
const props = defineProps<{
  agent: AgentOptionData;
  rowId: string;
  search: string;
  isActive: boolean;
  isChosen: boolean;
}>();

const emit = defineEmits<{ choose: []; openBeside: []; drop: [event: DragEvent] }>();

const name = computed(() => matchParts(props.agent.name, props.search));
const doing = computed(() => matchParts(props.agent.status.label, props.search));
</script>

<template>
  <ListRow
    bare
    static
    option
    :id="rowId"
    :selected="isActive"
    :aria-current="isChosen ? 'true' : undefined"
    :data-conversation="agent.id"
    class="flex cursor-pointer items-center gap-2.5 px-3 py-1.5 hover:bg-hover"
    :class="[isActive && 'bg-hover', agent.isRetired && 'opacity-70']"
    @click="emit('choose')"
    @dragover="carriesRecord($event) && $event.preventDefault()"
    @drop.prevent="emit('drop', $event)"
  >
    <Avatar :participant="{ kind: 'agent', driver: agent.sessionDriver ?? '' }" size="lg" />
    <span class="flex min-w-0 flex-1 flex-col leading-[1.25]">
      <span class="flex items-center gap-1.5 text-body text-text">
        <span class="truncate"
          >{{ name.before }}<u>{{ name.match }}</u>{{ name.after }}</span
        >
        <template v-if="agent.isMain">
          <Chip>main</Chip>
        </template>
        <template v-if="agent.isRetired">
          <Chip variant="faint">Retired</Chip>
        </template>
      </span>
      <small class="truncate text-badge text-text-3"
        >{{ doing.before }}<u>{{ doing.match }}</u>{{ doing.after }}</small
      >
    </span>
    <span class="flex items-center gap-1.5 text-badge text-text-3">
      <template v-if="agent.waitsOnYou">
        <Chip data-waits-on-you>Waits on you</Chip>
      </template>
      <template v-if="agent.unreadCount > 0">
        <span class="font-medium text-text" :aria-label="`${agent.unreadCount} unread`">{{
          agent.unreadCount
        }}</span>
      </template>
      <template v-if="agent.lastActiveAt">
        <span>{{ timeAgo(agent.lastActiveAt) }}</span>
      </template>
      <Status :state="sessionLooks[agent.status.sessionState]" label="" />
    </span>
    <template v-if="isChosen">
      <span title="This chat"><Icon name="tick" :size="14" /></span>
    </template>
    <template v-else>
      <IconButton
        icon="float"
        size="sm"
        tabindex="-1"
        :label="`Open ${agent.name} beside this chat`"
        data-open-beside
        @click.stop="emit('openBeside')"
      />
    </template>
  </ListRow>
</template>
