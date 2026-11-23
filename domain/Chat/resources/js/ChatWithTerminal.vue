<script setup lang="ts">
import { readStoredJson, keepStoredJson } from "@kit/browserStorage";
import Splitter from "@kit/Splitter";
import PaneTabs from "@kit/PaneTabs";
import type { PaneTab } from "@kit/PaneTabs";
import TerminalHeader from "@kit/TerminalHeader";
import type { TerminalHeaderAction } from "@kit/TerminalHeader";
import type { AgentOptionData } from "@generated/types/chat";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  watch,
} from "vue";
import {
  closeTerminalBesideChat,
  terminalDock,
} from "./composables/useTerminalDock";
import DockedTerminal from "./DockedTerminal.vue";
import {
  boundedChatShare,
  DEFAULT_CHAT_SHARE,
  placementFor,
  SPLIT_STORAGE_KEY,
  storedShare,
} from "./terminalPlacement";
import type { TerminalPlacement } from "./terminalPlacement";

/**
 * The chat with the chosen agent's terminal beside it once the agent bar opens it: side by side when both fit, two
 * named tabs when they do not, or the terminal filling the window. Both stay mounted through every change of
 * placement and tab, so the chat's draft and reading position and the terminal's read survive; closing the terminal
 * ends its read and gives the focus back to the chat's Terminal action. Choosing another agent in the chat moves the
 * terminal to that agent, its old screen cleared first, or closes it when that agent has none.
 */
const props = defineProps<{
  agents: AgentOptionData[];
  selectedAgentId: string | undefined;
}>();

const root = ref<HTMLElement | null>(null);
const space = ref<HTMLElement | null>(null);
const chatPanel = ref<HTMLElement | null>(null);
const header = ref<HTMLElement | null>(null);
const terminalPanel = ref<HTMLElement | null>(null);
const isHelpShown = ref(false);
const ownerLabel = ref("Watching");
const locationLabel = ref("");
const docked = ref<InstanceType<typeof DockedTerminal> | null>(null);
const width = ref(0);
const chatShare = ref(
  readStoredJson("local", SPLIT_STORAGE_KEY, storedShare) ?? DEFAULT_CHAT_SHARE,
);
const isFullScreen = ref(false);
const chosenTab = ref<"chat" | "terminal">("terminal");
let watcher: ResizeObserver | null = null;
// The control that opened full screen, which gets the focus back when it ends.
let fullScreenOpener: HTMLElement | null = null;

const agent = computed(() =>
  props.agents.find((option) => option.id === terminalDock.agentId),
);
const isOpen = computed(() => agent.value !== undefined);

function remPixels(): number {
  return (
    Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  );
}

const placement = computed<TerminalPlacement>(() => {
  if (isFullScreen.value) {
    return "full-screen";
  }

  return placementFor(width.value, remPixels());
});

const showsChat = computed(
  () =>
    !isOpen.value ||
    placement.value === "dock" ||
    (placement.value === "tabs" && chosenTab.value === "chat"),
);
const showsTerminal = computed(
  () =>
    isOpen.value &&
    (placement.value !== "tabs" || chosenTab.value === "terminal"),
);
const chatStyle = computed(() =>
  isOpen.value && placement.value === "dock"
    ? {
        flex: `0 0 ${boundedChatShare(chatShare.value, width.value, remPixels()) * 100}%`,
      }
    : { flex: "1 1 0%" },
);
const panelIds = { chat: useId(), terminal: useId() };
const terminalLabel = computed(() => `Terminal for ${agent.value?.name ?? ""}`);
const tabs = computed<PaneTab[]>(() => [
  {
    key: "chat",
    title: "Chat",
    icon: "chat",
    isActive: chosenTab.value === "chat",
    panelId: panelIds.chat,
  },
  {
    key: "terminal",
    title: terminalLabel.value,
    icon: "term",
    isActive: chosenTab.value === "terminal",
    panelId: panelIds.terminal,
  },
]);
const panelRole = computed(() =>
  isOpen.value && placement.value === "tabs" ? "tabpanel" : "region",
);

const placementLabel = computed(
  () =>
    ({ dock: "Beside chat", tabs: "In a tab", "full-screen": "Full screen" })[
      placement.value
    ],
);
const closeAction: TerminalHeaderAction = {
  key: "close",
  label: "Close terminal",
  run: () => void close(),
};
const exitFullScreen: TerminalHeaderAction = {
  key: "exit-full-screen",
  label: "Exit full screen",
  run: () => void leaveFullScreen(),
};
const enterFullScreen: TerminalHeaderAction = {
  key: "full-screen",
  label: "Full screen",
  run: () => {
    fullScreenOpener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    isFullScreen.value = true;
  },
};
const mainAction = computed(() =>
  isFullScreen.value ? exitFullScreen : closeAction,
);
const keyboardHelp: TerminalHeaderAction = {
  key: "keyboard-help",
  label: "Keyboard help",
  run: () => (isHelpShown.value = !isHelpShown.value),
};
const secondaryActions = computed(() =>
  isFullScreen.value
    ? [closeAction, keyboardHelp]
    : [enterFullScreen, keyboardHelp],
);

/**
 * F6 moves the focus on to the chat, the terminal's header and the terminal's screen in turn, Shift+F6 back; a part
 * that is not shown is passed over.
 */
function cycleFocus(event: KeyboardEvent): void {
  if (event.key !== "F6" || !isOpen.value) {
    return;
  }

  const stops = [chatPanel.value, header.value, terminalPanel.value].filter(
    (stop): stop is HTMLElement => stop !== null && stop.offsetParent !== null,
  );

  if (stops.length === 0) {
    return;
  }

  event.preventDefault();
  const current = stops.findIndex((stop) =>
    stop.contains(document.activeElement),
  );
  const next =
    (current + (event.shiftKey ? stops.length - 1 : 1)) % stops.length;
  stops[current === -1 ? 0 : next].focus();
}

/**
 * When a change of placement hides the part that had the focus, the focus goes to the chosen tab, or to the part
 * still shown.
 */
async function keepFocus(): Promise<void> {
  const focused = document.activeElement;

  if (!(focused instanceof HTMLElement) || !root.value?.contains(focused)) {
    return;
  }

  await nextTick();

  if (focused.offsetParent !== null) {
    return;
  }

  const chosen = root.value.querySelector<HTMLElement>(
    '[role="tab"][aria-selected="true"]',
  );
  (
    chosen ?? (showsTerminal.value ? terminalPanel.value : chatPanel.value)
  )?.focus();
}

async function leaveFullScreen(): Promise<void> {
  isFullScreen.value = false;
  await nextTick();
  fullScreenOpener?.focus();
  fullScreenOpener = null;
}

function moveSplit(share: number, spaceSize: number): void {
  chatShare.value = boundedChatShare(share, spaceSize, remPixels());
  keepStoredJson("local", SPLIT_STORAGE_KEY, chatShare.value);
}

function pickTab(key: string): void {
  chosenTab.value = key === "chat" ? "chat" : "terminal";
}

async function close(): Promise<void> {
  if (docked.value?.holdsCloseForDraft()) {
    return;
  }

  isFullScreen.value = false;
  closeTerminalBesideChat();
  await nextTick();
  document.querySelector<HTMLElement>("[data-terminal-action]")?.focus();
}

function closeTab(key: string): void {
  if (key === "terminal") {
    void close();
  }
}

watch(
  () => props.selectedAgentId,
  (agentId) => {
    if (terminalDock.agentId === null || agentId === terminalDock.agentId) {
      return;
    }

    const chosen = props.agents.find((option) => option.id === agentId);

    if (
      chosen === undefined ||
      !chosen.hasTerminal ||
      chosen.sessionId === null
    ) {
      void close();

      return;
    }

    terminalDock.agentId = chosen.id;
  },
);

watch(
  () => terminalDock.agentId,
  (agentId) => {
    if (agentId !== null) {
      chosenTab.value = "terminal";
    }
  },
);

watch(placement, () => void keepFocus());

onMounted(() => {
  terminalDock.mountedWindows++;
  document.addEventListener("keydown", cycleFocus);
  watcher = new ResizeObserver(
    ([entry]) => (width.value = entry.contentRect.width),
  );

  if (space.value) {
    width.value = space.value.getBoundingClientRect().width;
    watcher.observe(space.value);
  }
});

onBeforeUnmount(() => {
  terminalDock.mountedWindows--;
  document.removeEventListener("keydown", cycleFocus);
  watcher?.disconnect();
});
</script>

<template>
  <div
    ref="root"
    class="flex min-h-0 flex-col"
    :class="isFullScreen ? 'fixed inset-0 z-40 bg-bg' : 'h-full'"
  >
    <template v-if="isOpen && placement === 'tabs'">
      <PaneTabs :tabs="tabs" @pick="pickTab" @close="closeTab" />
    </template>
    <template v-if="isOpen && agent">
      <div
        ref="header"
        tabindex="-1"
        class="focus-visible:outline-2 focus-visible:outline-focus"
      >
        <TerminalHeader
          :agent-name="agent.name"
          :driver="agent.sessionDriverLabel"
          :owner="ownerLabel"
          :location="locationLabel"
          :placement="placementLabel"
          :main="mainAction"
          :secondary="secondaryActions"
        />
      </div>
      <template v-if="isHelpShown">
        <p class="px-3 pb-1 text-small text-text-2">
          F6 moves between the chat, this header and the terminal; Shift+F6 goes
          back. On the divider, the arrow keys resize, Home and End reach the
          limits. In the tabs, Left and Right switch.
        </p>
      </template>
    </template>
    <div ref="space" class="relative flex min-h-0 flex-1 flex-row">
      <div
        :id="panelIds.chat"
        ref="chatPanel"
        v-show="showsChat"
        tabindex="-1"
        :role="panelRole"
        aria-label="Chat"
        class="min-w-0 focus-visible:outline-2 focus-visible:outline-focus"
        :style="chatStyle"
      >
        <slot />
      </div>
      <template v-if="isOpen && placement === 'dock'">
        <Splitter
          axis="x"
          :span="width"
          :model-value="boundedChatShare(chatShare, width, remPixels())"
          :style="{
            left: `calc(${boundedChatShare(chatShare, width, remPixels()) * 100}% - 4px)`,
          }"
          @update:model-value="(share: number) => moveSplit(share, width)"
        />
      </template>
      <template v-if="isOpen && agent">
        <div
          :id="panelIds.terminal"
          ref="terminalPanel"
          v-show="showsTerminal"
          tabindex="-1"
          class="min-w-0 flex-1 overflow-auto focus-visible:outline-2 focus-visible:outline-focus"
          :aria-label="terminalLabel"
          :role="panelRole"
        >
          <DockedTerminal
            ref="docked"
            :agent-id="agent.id"
            :is-shown="showsTerminal"
            :expected="terminalDock.expected"
            :waits-for-choice="agent.needsAttention"
            @back-to-chat="close"
            @owner="(label: string) => (ownerLabel = label)"
            @location="(label: string) => (locationLabel = label)"
          />
        </div>
      </template>
    </div>
  </div>
</template>
