<script setup lang="ts">
import Button from "@kit/Button";
import ChipButton from "@kit/ChipButton";
import Popover from "@kit/Popover";
import SearchField from "@kit/SearchField";
import { router } from "@inertiajs/vue3";
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue";
import type { AgentOptionData } from "@generated/types/chat";
import { CHAT_LIST_FILTERS, chatListRows, type ChatListFilter } from "../../../chatList";
import ConversationActions from "./ConversationActions.vue";
import ConversationRow from "./ConversationRow.vue";
import StopConfirmation from "./StopConfirmation.vue";
import { useSessionEnd } from "../../../composables/useSessionEnd";
import {
  carriesRecord,
  droppedRecord,
  useHandOver,
} from "../../../composables/useHandOver";

/**
 * The one chat list, a popover under the chat's name (also Option+F): a search over each agent's name and what it does,
 * the filters All, Main agents, Helpers and Waits on you, then the chats On Home and the Recent ones, the most recently
 * active first, retired agents behind a toggle, in a list that scrolls under a foot that stays. Up and Down move,
 * Enter opens and Shift+Enter opens beside. A record dragged onto the name opens it; let go on a chat, it is handed to
 * that agent. Group chats are not listed.
 */
const props = defineProps<{
  agents: AgentOptionData[];
  selectedAgentId: string | undefined;
  // The chats Home shows now, listed first under On Home.
  openAgentIds: string[];
  agentUrl: (agent: AgentOptionData) => string;
}>();

const emit = defineEmits<{
  newChat: [];
  openBeside: [agent: AgentOptionData];
  switchDriver: [];
}>();

defineSlots<{ trigger(): unknown }>();

const LIST_ID = "chat-list-rows";

const trigger = useTemplateRef<HTMLElement>("trigger");
const isOpen = ref(false);
const search = ref("");
const filter = ref<ChatListFilter>("all");
const showsRetired = ref(false);
const activeIndex = ref(0);

const retiredCount = computed(() => props.agents.filter((agent) => agent.isRetired).length);
const waitingCount = computed(
  () => props.agents.filter((agent) => agent.waitsOnYou && !agent.isRetired).length,
);
const matching = computed(() => chatListRows(props.agents, filter.value, search.value));
const hiddenRetired = computed(() =>
  showsRetired.value ? 0 : matching.value.filter((agent) => agent.isRetired).length,
);
const working = computed(() => matching.value.filter((agent) => !agent.isRetired));
// The groups in the order they show, each with its rows; an empty group is left out.
const groups = computed(() =>
  [
    {
      label: "On Home",
      hint: "tabs above the agent bar",
      rows: working.value.filter((agent) => props.openAgentIds.includes(agent.id)),
    },
    {
      label: "Recent",
      hint: "most recent first",
      rows: working.value.filter((agent) => !props.openAgentIds.includes(agent.id)),
    },
    {
      label: "Retired",
      hint: "read only",
      rows: showsRetired.value ? matching.value.filter((agent) => agent.isRetired) : [],
    },
  ].filter((group) => group.rows.length > 0),
);
const shownRows = computed(() => groups.value.flatMap((group) => group.rows));
const activeAgent = computed(() => shownRows.value[activeIndex.value]);

const chosenAgent = computed(() => props.agents.find((agent) => agent.id === props.selectedAgentId));
// The chosen agent's own terminal, offered while it runs in one.
const terminalAgent = computed(() =>
  chosenAgent.value?.hasTerminal === true && chosenAgent.value.sessionId !== null
    ? chosenAgent.value
    : undefined,
);
// The chosen agent, while its status offers to end its session; End session asks first.
const endableAgent = computed(() =>
  chosenAgent.value?.status.actions.some((action) => action.type === "stop") === true
    ? chosenAgent.value
    : undefined,
);

watch([search, filter, showsRetired], () => (activeIndex.value = 0));

function rowId(agent: AgentOptionData): string {
  return `chat-list-row-${agent.id}`;
}

function toggle(): void {
  isOpen.value = !isOpen.value;
}

function move(step: 1 | -1): void {
  const last = shownRows.value.length - 1;
  activeIndex.value = Math.max(0, Math.min(last, activeIndex.value + step));
  document.getElementById(rowId(shownRows.value[activeIndex.value]))?.scrollIntoView?.({ block: "nearest" });
}

function choose(agent: AgentOptionData): void {
  isOpen.value = false;
  router.visit(props.agentUrl(agent), { preserveScroll: true });
}

function openBeside(agent: AgentOptionData): void {
  isOpen.value = false;
  emit("openBeside", agent);
}

function newChat(): void {
  isOpen.value = false;
  emit("newChat");
}

function switchDriver(): void {
  isOpen.value = false;
  emit("switchDriver");
}

function openActive(): void {
  if (activeAgent.value !== undefined) {
    choose(activeAgent.value);
  }
}

// Shift+Enter opens the active chat beside this one, before the search field takes Enter as opening it here.
function openActiveBeside(event: KeyboardEvent): void {
  if (event.key !== "Enter" || !event.shiftKey || activeAgent.value === undefined) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  openBeside(activeAgent.value);
}

function openOnShortcut(event: KeyboardEvent): void {
  if (event.altKey && !event.metaKey && !event.ctrlKey && event.code === "KeyF") {
    event.preventDefault();
    isOpen.value = true;
  }
}

onMounted(() => window.addEventListener("keydown", openOnShortcut));
onBeforeUnmount(() => window.removeEventListener("keydown", openOnShortcut));

function openOnDrag(event: DragEvent): void {
  if (carriesRecord(event)) {
    isOpen.value = true;
  }
}

const handOver = useHandOver();

function handTo(event: DragEvent, agent: AgentOptionData): void {
  handOver.hold({ ...droppedRecord(event), agentId: agent.id });
  choose(agent);
}

const isEndAsked = ref(false);
const sessionEnd = useSessionEnd();

function endSession(): void {
  const agent = endableAgent.value;

  if (agent !== undefined) {
    sessionEnd.end(agent, () => (isEndAsked.value = false));
  }
}

function askEnd(): void {
  isOpen.value = false;
  isEndAsked.value = true;
}
</script>

<template>
  <div
    class="relative"
    @dragenter="openOnDrag"
    @dragover="carriesRecord($event) && $event.preventDefault()"
  >
    <button
      ref="trigger"
      type="button"
      class="flex items-center gap-2.5 rounded-field py-[3px] pr-1.5 pl-[3px] text-left hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      data-chat-list-trigger
      @click="toggle"
    >
      <slot name="trigger" />
    </button>
    <Popover v-model:open="isOpen" label="Chats" :anchor="trigger" :width="384">
      <div @keydown.capture="openActiveBeside">
        <SearchField
          v-model="search"
          label="Find a chat"
          placeholder="Find a chat or an agent"
          :controls="LIST_ID"
          :active-descendant="activeAgent ? rowId(activeAgent) : undefined"
          @move="move"
          @run="openActive"
          @close="isOpen = false"
        />
      </div>
      <div class="flex flex-wrap gap-1 px-3 py-2" role="group" aria-label="Show">
        <template v-for="choice in CHAT_LIST_FILTERS" :key="choice.value">
          <ChipButton
            shape="pill"
            :pressed="filter === choice.value"
            :count="choice.value === 'waiting' && waitingCount > 0 ? waitingCount : undefined"
            :data-filter="choice.value"
            @click="filter = choice.value"
            >{{ choice.label }}</ChipButton
          >
        </template>
      </div>
      <div
        :id="LIST_ID"
        role="listbox"
        aria-label="Chats"
        class="max-h-[336px] overflow-y-auto pb-1"
        data-chat-list
      >
        <template v-for="group in groups" :key="group.label">
          <div
            role="presentation"
            class="flex items-baseline gap-2 px-3 pt-2 pb-1 text-badge text-text-3"
            :data-group="group.label"
          >
            <span class="font-medium text-text-2">{{ group.label }}</span>
            <span>{{ group.hint }}</span>
          </div>
          <template v-for="agent in group.rows" :key="agent.id">
            <ConversationRow
              :agent="agent"
              :row-id="rowId(agent)"
              :search="search"
              :is-active="agent.id === activeAgent?.id"
              :is-chosen="agent.id === selectedAgentId"
              @choose="choose(agent)"
              @open-beside="openBeside(agent)"
              @drop="handTo($event, agent)"
            />
          </template>
        </template>
        <template v-if="shownRows.length === 0">
          <div class="flex flex-col items-start gap-1.5 px-3 py-3" role="status" data-no-match>
            <template v-if="search.trim() !== ''">
              <b class="text-body text-text">No chat matches “{{ search.trim() }}”</b>
            </template>
            <template v-else-if="filter === 'waiting'">
              <b class="text-body text-text">Nothing waits on you</b>
              <span class="text-small text-text-3"
                >When an agent asks you something, its chat shows here.</span
              >
            </template>
            <template v-else>
              <b class="text-body text-text">No chats here yet</b>
            </template>
            <span class="flex gap-1.5">
              <template v-if="hiddenRetired > 0">
                <Button size="small" variant="bordered" @click="showsRetired = true"
                  >Show retired agents</Button
                >
              </template>
              <Button size="small" variant="bordered" @click="newChat">New chat</Button>
            </span>
          </div>
        </template>
        <template v-if="retiredCount > 0 && (shownRows.length > 0 || showsRetired)">
          <button
            type="button"
            class="w-full px-3 py-1.5 text-left text-small text-text-3 hover:bg-hover"
            data-retired-toggle
            @click="showsRetired = !showsRetired"
          >
            {{ showsRetired ? "Hide retired agents" : `Show ${retiredCount} retired agents` }}
          </button>
        </template>
      </div>
      <ConversationActions
        :chosen-agent="chosenAgent"
        :terminal-agent="terminalAgent"
        :endable-agent="endableAgent"
        @new-chat="newChat"
        @switch-driver="switchDriver"
        @end-session="askEnd"
      />
    </Popover>
    <template v-if="isEndAsked && endableAgent">
      <StopConfirmation
        :agent-name="endableAgent.name"
        :is-pending="sessionEnd.isPending.value"
        @confirm="endSession"
        @close="isEndAsked = false"
      />
    </template>
    <template v-if="sessionEnd.refusal.value">
      <p class="text-small text-danger" role="alert">
        {{ sessionEnd.refusal.value }}
      </p>
    </template>
  </div>
</template>
