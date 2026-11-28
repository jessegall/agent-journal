<script setup lang="ts">
import { usePage } from "@inertiajs/vue3";
import { computed, ref } from "vue";
import type { AgentOptionData, ChatData } from "@generated/types/chat";
import Avatar from "@kit/Avatar";
import Icon from "@kit/Icon";
import Status from "@kit/Status";
import { agentUrl } from "../../agentLinks";
import { sessionLooks } from "../../sessionLooks";
import ConversationMenu from "./partials/ConversationMenu.vue";
import AgentSessionActions from "./partials/AgentSessionActions.vue";
import { useStatusAnnouncement } from "../../composables/useStatusAnnouncement";

/**
 * Home's agent bar: the chosen agent with the state its evidence gives, in a mark and words of their own, why a start
 * was refused and its one next step wrapped below, how old the host's last report is when the state is unknown, a
 * menu to choose another, and the actions its status offers. Choosing another agent changes only the view.
 */
const props = defineProps<{ data: ChatData }>();

const page = usePage();
const isDialogOpen = ref(false);
const selected = computed(() =>
  props.data.agents.find((agent) => agent.id === props.data.selectedAgentId),
);
const status = computed(() => selected.value?.status);
const announcement = useStatusAnnouncement(
  () => status.value,
  () => isDialogOpen.value,
);

// The second line names what runs the agent: its driver and model while a session runs, else the profile it starts from.
const subline = computed(() => {
  const agent = selected.value;

  if (agent === undefined) {
    return "";
  }

  if (agent.sessionDriverLabel === null) {
    return agent.profileKey;
  }

  return [agent.sessionDriverLabel, agent.sessionModel]
    .filter((part) => part !== null && part !== "")
    .join(" · ");
});
</script>

<template>
  <div class="relative z-90 flex flex-1 flex-wrap items-center gap-2">
    <div class="relative">
      <ConversationMenu
        :agents="data.agents"
        :selected-agent-id="data.selectedAgentId"
        :open-agent-ids="selected ? [selected.id] : []"
        :agent-url="(agent: AgentOptionData) => agentUrl(page.url, agent)"
      >
        <template #trigger>
        <template v-if="selected">
          <Avatar
            :participant="{
              kind: 'agent',
              driver: selected.sessionDriver ?? '',
            }"
            size="lg"
          />
          <span class="flex min-w-0 flex-col leading-[1.25] whitespace-nowrap">
            <span class="text-body text-text">{{
              selected.isMain ? `${selected.name} · main` : selected.name
            }}</span>
            <small class="max-w-[340px] truncate text-badge text-text-3">{{ subline }}</small>
          </span>
        </template>
        <template v-else>
          <span class="font-semibold text-text">Choose an agent</span>
        </template>
        <Icon name="caret" :size="14" />
        </template>
      </ConversationMenu>
      <template v-if="status?.reason">
        <p class="max-w-[60ch] px-1.5 text-small break-words text-danger">
          {{ status.reason }}
          <template v-if="status.remedy">
            <span class="text-text-2">{{ status.remedy }}</span>
          </template>
        </p>
      </template>
      <template
        v-if="
          status?.sessionState === 'unknown' &&
          status.observationAgeSeconds !== null
        "
      >
        <p class="px-1.5 text-small text-text-3">
          Last report {{ status.observationAgeSeconds }} s ago
        </p>
      </template>
    </div>
    <template v-if="status">
      <Status
        class="ml-1"
        :state="sessionLooks[status.sessionState]"
        :label="status.label"
        secondary
      />
    </template>
    <template v-if="data.isSetupRequired">
      <span class="text-small text-text-3"
        >No main agent yet: run <code>php artisan agents:install</code>.</span
      >
    </template>
    <span class="flex-1"></span>
    <template v-if="selected">
      <AgentSessionActions
        :agent="selected"
        @dialog="(isOpen: boolean) => (isDialogOpen = isOpen)"
      />
    </template>
    <p class="sr-only" aria-live="polite">{{ announcement.polite.value }}</p>
    <p class="sr-only" role="alert">{{ announcement.alert.value }}</p>
  </div>
</template>
