<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import type { AgentOptionData, ChatData } from '@generated/types/chat';
import { agentUrl } from './agentLinks';
import AgentMenu from './AgentMenu.vue';
import AgentSessionActions from './AgentSessionActions.vue';
import { useStatusAnnouncement } from './composables/useStatusAnnouncement';

/**
 * Home's agent bar: the chosen agent with the state its evidence gives, in a mark and words of their own, why a start
 * was refused and its one next step wrapped below, how old the host's last report is when the state is unknown, a
 * menu to choose another, and the actions its status offers. Choosing another agent changes only the view.
 */
const props = defineProps<{ data: ChatData }>();

const page = usePage();
const isMenuOpen = ref(false);
const isDialogOpen = ref(false);
const selected = computed(() => props.data.agents.find((agent) => agent.id === props.data.selectedAgentId));
const status = computed(() => selected.value?.status);
const announcement = useStatusAnnouncement(() => status.value, () => isDialogOpen.value);

// Each state's mark: a filled dot for a running driver, a ring while it moves, a danger dot for a refusal.
const marks: Record<string, string> = {
    working: 'bg-brand',
    idle: 'bg-text-3',
    starting: 'border-2 border-brand bg-transparent',
    stopping: 'border-2 border-tone-warn bg-transparent',
    interrupting: 'border-2 border-tone-warn bg-transparent',
    'waiting-for-sign-in': 'bg-tone-warn',
    'no-capacity': 'bg-danger',
    refused: 'bg-danger',
    failed: 'bg-danger',
    unknown: 'border-2 border-text-3 bg-transparent',
};
const isEmphasised = computed(() => ['failed', 'refused', 'no-capacity'].includes(status.value?.sessionState ?? ''));
</script>

<template>
    <div class="relative z-90 flex flex-1 flex-wrap items-center gap-2.5">
        <div class="relative">
            <button
                type="button"
                class="flex items-center gap-2 rounded-control px-1.5 py-1 hover:bg-hover"
                aria-haspopup="listbox"
                :aria-expanded="isMenuOpen"
                @click="isMenuOpen = !isMenuOpen"
            >
                <span
                    class="size-2 flex-none rounded-full"
                    :class="marks[status?.sessionState ?? ''] ?? 'bg-text-4'"
                    aria-hidden="true"
                ></span>
                <span class="font-semibold text-text">{{ selected?.name ?? 'Choose an agent' }}</span>
                <template v-if="status">
                    <span :class="isEmphasised ? 'font-semibold text-danger' : 'text-text-3'">{{ status.label }}</span>
                </template>
            </button>
            <template v-if="status?.reason">
                <p class="max-w-[60ch] px-1.5 text-small break-words text-danger">
                    {{ status.reason }}
                    <template v-if="status.remedy">
                        <span class="text-text-2">{{ status.remedy }}</span>
                    </template>
                </p>
            </template>
            <template v-if="status?.sessionState === 'unknown' && status.observationAgeSeconds !== null">
                <p class="px-1.5 text-small text-text-3">Last report {{ status.observationAgeSeconds }} s ago</p>
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
        <template v-if="data.setupRequired">
            <span class="text-small text-text-3">No main agent yet: run <code>php artisan agents:install</code>.</span>
        </template>
        <span class="flex-1"></span>
        <template v-if="selected">
            <AgentSessionActions :agent="selected" @dialog="(isOpen: boolean) => (isDialogOpen = isOpen)" />
        </template>
        <p class="sr-only" aria-live="polite">{{ announcement.polite.value }}</p>
        <p class="sr-only" role="alert">{{ announcement.alert.value }}</p>
    </div>
</template>
