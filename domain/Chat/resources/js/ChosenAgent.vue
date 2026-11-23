<script setup lang="ts">
import { usePage } from "@inertiajs/vue3";
import { computed, ref } from "vue";
import type { AgentOptionData, ChatData } from "@generated/types/chat";
import type { SessionState } from "@kit/CoreTypes";
import Avatar from "@kit/Avatar";
import Icon from "@kit/Icon";
import Status from "@kit/Status";
import type { StatusState } from "@kit/Status";
import { agentUrl } from "./agentLinks";
import { carriesRecord } from "./composables/useHandOver";
import AgentMenu from "./AgentMenu.vue";
import AgentSessionActions from "./AgentSessionActions.vue";
import { AGENT_BAR_MEMBERS } from "./agentBarMembers";
import { useStatusAnnouncement } from "./composables/useStatusAnnouncement";

/**
 * Home's agent bar: the chosen agent with the state its evidence gives, in a mark and words of their own, why a start
 * was refused and its one next step wrapped below, how old the host's last report is when the state is unknown, a
 * menu to choose another, and the actions its status offers. Choosing another agent changes only the view.
 */
const props = defineProps<{ data: ChatData }>();

const page = usePage();
const isMenuOpen = ref(false);
const isDialogOpen = ref(false);
const selected = computed(() =>
  props.data.agents.find((agent) => agent.id === props.data.selectedAgentId),
);
const status = computed(() => selected.value?.status);
const announcement = useStatusAnnouncement(
  () => status.value,
  () => isDialogOpen.value,
);

// Each session state as the kit's Status shows it: a spinner while it moves, a hollow dot at rest, an alert when refused.
const looks: Record<SessionState, StatusState> = {
  stopped: "stopped",
  starting: "connecting",
  working: "working",
  idle: "open",
  stopping: "running",
  interrupting: "running",
  failed: "failed",
  refused: "failed",
  "waiting-for-sign-in": "not-signed-in",
  "no-capacity": "failed",
  unknown: "open",
  retired: "ended",
  verifying: "connecting",
  unverified: "open",
};
const isMain = computed(
  () =>
    selected.value !== undefined &&
    selected.value.id === props.data.mainAgentId,
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
  <div class="relative z-90 flex flex-1 flex-wrap items-center gap-2.5">
    <div class="relative">
      <button
        type="button"
        class="flex items-center gap-2 rounded-control py-1 pr-1.5 pl-1 text-left hover:bg-hover"
        aria-haspopup="listbox"
        :aria-expanded="isMenuOpen"
        title="Choose whom this chat talks to"
        @click="isMenuOpen = !isMenuOpen"
        @dragenter="carriesRecord($event) && (isMenuOpen = true)"
        @dragover="carriesRecord($event) && $event.preventDefault()"
      >
        <template v-if="selected">
          <Avatar
            :participant="{
              kind: 'agent',
              driver: selected.sessionDriver ?? '',
            }"
            size="lg"
          />
          <span class="flex flex-col leading-tight">
            <span class="text-body text-text">{{
              isMain ? `${selected.name} · main` : selected.name
            }}</span>
            <small class="text-small text-text-3">{{ subline }}</small>
          </span>
        </template>
        <template v-else>
          <span class="font-semibold text-text">Choose an agent</span>
        </template>
        <Icon name="caret" :size="14" />
      </button>
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
      <template v-if="isMenuOpen">
        <AgentMenu
          :agents="data.agents"
          :main-agent-id="data.mainAgentId"
          :selected-agent-id="data.selectedAgentId"
          :agent-url="(agent: AgentOptionData) => agentUrl(page.url, agent)"
          @close="isMenuOpen = false"
        />
      </template>
    </div>
    <span :id="AGENT_BAR_MEMBERS" class="flex items-center"></span>
    <template v-if="status">
      <Status :state="looks[status.sessionState]" :label="status.label" />
    </template>
    <template v-if="data.setupRequired">
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
