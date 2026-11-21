<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import type { AgentOptionData, ChatData } from '@generated/types/chat';
import { agentUrl } from './agentLinks';
import AgentMenu from './AgentMenu.vue';
import AgentSessionActions from './AgentSessionActions.vue';

/**
 * Home's agent bar: the chosen agent with its state dot and word, why its start was refused when it was, a menu to
 * choose another, and the actions its state offers. Without a designated main agent it says how to create one.
 */
const props = defineProps<{ data: ChatData }>();

const page = usePage();
const isMenuOpen = ref(false);
const selected = computed(() => props.data.agents.find((agent) => agent.id === props.data.selectedAgentId));
const dots: Record<string, string> = {
    working: 'bg-brand',
    'pending-switch': 'bg-tone-warn',
    failed: 'bg-danger',
};
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
                <span class="size-2 flex-none rounded-full" :class="dots[selected?.presence ?? ''] ?? 'bg-text-4'"></span>
                <span class="font-semibold text-text">{{ selected?.name ?? 'Choose an agent' }}</span>
                <template v-if="selected">
                    <span class="text-text-3" aria-live="polite">{{ selected.presenceLabel }}</span>
                </template>
            </button>
            <template v-if="selected?.startRefusal">
                <p class="max-w-[60ch] px-1.5 text-small text-danger" role="alert">{{ selected.startRefusal }}</p>
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
            <AgentSessionActions :agent="selected" />
        </template>
    </div>
</template>
