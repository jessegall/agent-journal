<script setup lang="ts">
import Popover from "@kit/Popover";
import { router } from "@inertiajs/vue3";
import { computed, onMounted, ref, useId, useTemplateRef } from "vue";
import ListBox from "@kit/ListBox";
import MenuGroup from "@kit/MenuGroup";
import MenuItem from "@kit/MenuItem";
import SearchField from "@kit/SearchField";
import type { AgentOptionData } from "@generated/types/chat";
import {
  carriesRecord,
  droppedRecord,
  useHandOver,
} from "./composables/useHandOver";
import { openAgentTerminal } from "./composables/useTerminalModal";

/**
 * The agent picker's menu, drawn as the design's menus on the kit: a search field that keeps the focus above the agents
 * in Main, Helpers and Retired groups with their state. Up and Down move the active agent, Enter chooses it and Escape
 * closes the menu. A record dragged here opens the chat of the agent it rests on, and let go on an agent it is handed
 * to that agent.
 */
const props = defineProps<{
  agents: AgentOptionData[];
  mainAgentId: string | undefined;
  selectedAgentId: string | undefined;
  agentUrl: (agent: AgentOptionData) => string;
}>();

const emit = defineEmits<{ close: [] }>();

const opener =
  document.activeElement instanceof HTMLElement ? document.activeElement : null;

// Escape closes the menu and gives the focus back to the button that opened it.
function closeToOpener(): void {
  emit("close");
  opener?.focus();
}

// The chosen agent's own terminal, offered below the agents while it runs in one.
const terminalAgent = computed(() =>
  props.agents.find(
    (agent) =>
      agent.id === props.selectedAgentId &&
      agent.hasTerminal &&
      agent.sessionId !== null,
  ),
);

function openTerminalOf(agent: AgentOptionData): void {
  emit("close");
  openAgentTerminal(agent);
}

const search = ref("");
const activeId = ref<string | null>(null);
const list = useTemplateRef<InstanceType<typeof ListBox>>("list");
const listId = `agents-${useId()}`;
const root = useTemplateRef<HTMLElement>("root");

onMounted(() => root.value?.querySelector<HTMLInputElement>("input")?.focus());
const found = computed(() =>
  props.agents.filter((agent) =>
    agent.name.toLowerCase().includes(search.value.trim().toLowerCase()),
  ),
);
const groups = computed(() =>
  [
    {
      title: "Main",
      agents: found.value.filter((agent) => agent.id === props.mainAgentId),
    },
    {
      title: "Helpers",
      agents: found.value.filter(
        (agent) => agent.id !== props.mainAgentId && !agent.retired,
      ),
    },
    {
      title: "Retired",
      agents: found.value.filter(
        (agent) => agent.id !== props.mainAgentId && agent.retired,
      ),
    },
  ].filter((group) => group.agents.length > 0),
);

function optionId(agent: AgentOptionData): string {
  return `${listId}-${agent.id}`;
}

function press(key: string): void {
  list.value?.controlKeys(
    new KeyboardEvent("keydown", { key, cancelable: true }),
  );
}

function choose(agent: AgentOptionData): void {
  emit("close");
  router.visit(props.agentUrl(agent), { preserveScroll: true });
}

const handOver = useHandOver();
// How long a dragged record rests on an agent before that agent's chat opens.
const REST_MS = 700;
let resting: ReturnType<typeof setTimeout> | undefined;

function restOn(event: DragEvent, agent: AgentOptionData): void {
  if (!carriesRecord(event)) {
    return;
  }

  clearTimeout(resting);
  resting = setTimeout(
    () => router.visit(props.agentUrl(agent), { preserveScroll: true }),
    REST_MS,
  );
}

function clearRest(): void {
  clearTimeout(resting);
}

function handTo(event: DragEvent, agent: AgentOptionData): void {
  clearTimeout(resting);
  handOver.hold({ ...droppedRecord(event), agentId: agent.id });
  choose(agent);
}
</script>

<template>
  <Popover
    :open="true"
    :anchor="opener"
    align="left"
    :width="288"
    label="Choose an agent"
    @update:open="(isOpen) => !isOpen && emit('close')"
  >
    <div ref="root" class="flex flex-col">
    <SearchField
      v-model="search"
      label="Find an agent"
      placeholder="Find an agent"
      :controls="listId"
      :active-descendant="activeId ?? undefined"
      @move="press($event === 1 ? 'ArrowDown' : 'ArrowUp')"
      @run="press('Enter')"
      @close="closeToOpener"
    />
    <div :id="listId" class="max-h-80 overflow-y-auto p-1.5">
      <ListBox ref="list" v-model:active-id="activeId" label="Agents">
        <template v-for="group in groups" :key="group.title">
          <MenuGroup :label="group.title">
            <template v-for="agent in group.agents" :key="agent.id">
              <MenuItem
                option
                :id="optionId(agent)"
                :checked="agent.id === selectedAgentId"
                @click="choose(agent)"
                @dragenter="restOn($event, agent)"
                @dragover="carriesRecord($event) && $event.preventDefault()"
                @dragleave="clearRest"
                @drop.prevent="handTo($event, agent)"
              >
                <span class="truncate">{{ agent.name }}</span>
                <template #trailing>
                  <span class="text-badge text-text-3">{{
                    agent.status.label
                  }}</span>
                </template>
              </MenuItem>
            </template>
          </MenuGroup>
        </template>
      </ListBox>
      <template v-if="groups.length === 0">
        <p role="status" class="px-3 py-2 text-small text-text-3">
          No agent matches
        </p>
      </template>
    </div>
    <template v-if="terminalAgent">
      <div class="border-t border-line p-1.5">
        <MenuItem data-open-terminal @click="openTerminalOf(terminalAgent)">
          Open {{ terminalAgent.sessionDriverLabel ?? "its" }} terminal
        </MenuItem>
      </div>
    </template>
  </div>
  </Popover>
</template>
