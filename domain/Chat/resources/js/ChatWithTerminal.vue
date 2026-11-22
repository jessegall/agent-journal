<script setup lang="ts">
import { readStoredJson, keepStoredJson } from '@kit/browserStorage';
import PaneSplitter from '@kit/PaneSplitter';
import PaneTabs from '@kit/PaneTabs';
import type { PaneTab } from '@kit/PaneTabs';
import type { AgentOptionData } from '@generated/types/chat';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { closeTerminalBesideChat, terminalDock } from './composables/useTerminalDock';
import DockedTerminal from './DockedTerminal.vue';
import {
    boundedChatShare,
    DEFAULT_CHAT_SHARE,
    placementFor,
    SPLIT_STORAGE_KEY,
    storedShare,
} from './terminalPlacement';
import type { TerminalPlacement } from './terminalPlacement';

/**
 * The chat with the chosen agent's terminal beside it once the agent bar opens it: side by side when both fit, two
 * named tabs when they do not, or the terminal filling the window. Both stay mounted through every change of
 * placement and tab, so the chat's draft and reading position and the terminal's read survive; closing the terminal
 * ends its read and gives the focus back to the chat's Terminal action. Choosing another agent in the chat moves the
 * terminal to that agent, its old screen cleared first, or closes it when that agent has none.
 */
const props = defineProps<{ agents: AgentOptionData[]; selectedAgentId: string | undefined }>();

const space = ref<HTMLElement | null>(null);
const width = ref(0);
const chatShare = ref(readStoredJson('local', SPLIT_STORAGE_KEY, storedShare) ?? DEFAULT_CHAT_SHARE);
const isFullScreen = ref(false);
const chosenTab = ref<'chat' | 'terminal'>('terminal');
let watcher: ResizeObserver | null = null;

const agent = computed(() => props.agents.find((option) => option.id === terminalDock.agentId));
const isOpen = computed(() => agent.value !== undefined);

function remPixels(): number {
    return Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
}

const placement = computed<TerminalPlacement>(() => {
    if (isFullScreen.value) {
        return 'full-screen';
    }

    return placementFor(width.value, remPixels());
});

const showsChat = computed(
    () => !isOpen.value || placement.value === 'dock' || (placement.value === 'tabs' && chosenTab.value === 'chat'),
);
const showsTerminal = computed(
    () =>
        isOpen.value &&
        (placement.value !== 'tabs' || chosenTab.value === 'terminal'),
);
const chatStyle = computed(() =>
    isOpen.value && placement.value === 'dock'
        ? { flex: `0 0 ${boundedChatShare(chatShare.value, width.value, remPixels()) * 100}%` }
        : { flex: '1 1 0%' },
);
const tabs = computed<PaneTab[]>(() => [
    { key: 'chat', title: 'Chat', icon: 'chat', isActive: chosenTab.value === 'chat' },
    {
        key: 'terminal',
        title: `Terminal for ${agent.value?.name ?? ''}`,
        icon: 'term',
        isActive: chosenTab.value === 'terminal',
    },
]);

function moveSplit(share: number, spaceSize: number): void {
    chatShare.value = boundedChatShare(share, spaceSize, remPixels());
    keepStoredJson('local', SPLIT_STORAGE_KEY, chatShare.value);
}

function resetSplit(): void {
    moveSplit(DEFAULT_CHAT_SHARE, width.value);
}

function pickTab(key: string): void {
    chosenTab.value = key === 'chat' ? 'chat' : 'terminal';
}

async function close(): Promise<void> {
    isFullScreen.value = false;
    closeTerminalBesideChat();
    await nextTick();
    document.querySelector<HTMLElement>('[data-terminal-action]')?.focus();
}

function closeTab(key: string): void {
    if (key === 'terminal') {
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

        if (chosen === undefined || !chosen.hasTerminal || chosen.sessionId === null) {
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
            chosenTab.value = 'terminal';
        }
    },
);

onMounted(() => {
    terminalDock.mountedWindows++;
    watcher = new ResizeObserver(([entry]) => (width.value = entry.contentRect.width));

    if (space.value) {
        width.value = space.value.getBoundingClientRect().width;
        watcher.observe(space.value);
    }
});

onBeforeUnmount(() => {
    terminalDock.mountedWindows--;
    watcher?.disconnect();
});
</script>

<template>
    <div
        class="flex min-h-0 flex-col"
        :class="isFullScreen ? 'fixed inset-0 z-40 bg-bg' : 'h-full'"
    >
        <template v-if="isOpen && placement === 'tabs'">
            <PaneTabs :tabs="tabs" @pick="pickTab" @close="closeTab" />
        </template>
        <template v-if="isOpen && agent">
            <div class="flex flex-none items-center gap-2 px-3 py-1 text-small text-text-2">
                <span class="font-semibold text-text">{{ agent.name }}</span>
                <span class="flex-1"></span>
                <button
                    type="button"
                    class="rounded-control border border-border-2 px-2 py-0.5 hover:bg-hover hover:text-text"
                    @click="isFullScreen = !isFullScreen"
                >
                    {{ isFullScreen ? 'Exit full screen' : 'Full screen' }}
                </button>
                <button
                    type="button"
                    class="rounded-control border border-border-2 px-2 py-0.5 hover:bg-hover hover:text-text"
                    @click="close"
                >
                    Close terminal
                </button>
            </div>
        </template>
        <div ref="space" class="flex min-h-0 flex-1 flex-row">
            <div v-show="showsChat" class="min-w-0" :style="chatStyle">
                <slot />
            </div>
            <template v-if="isOpen && placement === 'dock'">
                <PaneSplitter axis="row" :ratio="chatShare" @move="moveSplit" @reset="resetSplit" />
            </template>
            <template v-if="isOpen && agent">
                <div
                    v-show="showsTerminal"
                    class="min-w-0 flex-1 overflow-auto"
                    :aria-label="`Terminal for ${agent.name}`"
                    role="region"
                >
                    <DockedTerminal :agent-id="agent.id" :is-shown="showsTerminal" />
                </div>
            </template>
        </div>
    </div>
</template>
