<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { computed, nextTick, ref } from 'vue';
import type { AgentOptionData } from '@generated/types/chat';

/**
 * The agent picker's menu: a search that takes the focus, then the agents in Main, Helpers and Retired groups with
 * their state. The arrow keys move between them, Enter chooses one and Escape closes the menu.
 */
const props = defineProps<{
    agents: AgentOptionData[];
    mainAgentId: string | undefined;
    selectedAgentId: string | undefined;
    agentUrl: (agent: AgentOptionData) => string;
}>();

const emit = defineEmits<{ close: [] }>();

const search = ref('');
const options = ref<HTMLLIElement[]>([]);
const found = computed(() =>
    props.agents.filter((agent) => agent.name.toLowerCase().includes(search.value.trim().toLowerCase())),
);
const groups = computed(() => [
    { title: 'Main', agents: found.value.filter((agent) => agent.id === props.mainAgentId) },
    { title: 'Helpers', agents: found.value.filter((agent) => agent.id !== props.mainAgentId && !agent.retired) },
    { title: 'Retired', agents: found.value.filter((agent) => agent.id !== props.mainAgentId && agent.retired) },
].filter((group) => group.agents.length > 0));
const ordered = computed(() => groups.value.flatMap((group) => group.agents));

function choose(agent: AgentOptionData): void {
    emit('close');
    router.visit(props.agentUrl(agent), { preserveScroll: true });
}

async function focusOption(index: number): Promise<void> {
    await nextTick();
    options.value[(index + ordered.value.length) % ordered.value.length]?.focus();
}
</script>

<template>
    <div
        class="absolute top-full left-0 z-90 mt-1 flex w-72 flex-col gap-2 rounded-control border border-border-2 bg-raised p-2 shadow-lg"
        @keydown.escape="emit('close')"
    >
        <input
            v-model="search"
            type="search"
            placeholder="Find an agent"
            aria-label="Find an agent"
            autofocus
            class="rounded-control border border-border-2 bg-transparent px-2 py-1 text-small"
            @keydown.down.prevent="focusOption(0)"
            @keydown.enter.prevent="ordered[0] && choose(ordered[0])"
        />
        <template v-if="ordered.length === 0">
            <p class="text-small text-text-3">No agent matches.</p>
        </template>
        <ul role="listbox" aria-label="Agents" class="flex max-h-80 flex-col overflow-auto">
            <template v-for="group in groups" :key="group.title">
                <li role="presentation" class="px-2 pt-2 text-caption font-semibold text-text-4 uppercase">
                    {{ group.title }}
                </li>
                <template v-for="agent in group.agents" :key="agent.id">
                    <li
                        ref="options"
                        role="option"
                        tabindex="-1"
                        :aria-selected="agent.id === selectedAgentId"
                        class="flex cursor-pointer items-center gap-2 rounded-control px-2 py-1 text-small text-text outline-none hover:bg-hover focus-visible:bg-hover"
                        :class="{ 'bg-sel': agent.id === selectedAgentId }"
                        @click="choose(agent)"
                        @keydown.enter.prevent="choose(agent)"
                        @keydown.down.prevent="focusOption(ordered.indexOf(agent) + 1)"
                        @keydown.up.prevent="focusOption(ordered.indexOf(agent) - 1)"
                    >
                        <span class="flex-1 truncate">{{ agent.name }}</span>
                        <span class="text-text-3">{{ agent.presenceLabel }}</span>
                    </li>
                </template>
            </template>
        </ul>
        <p class="text-caption text-text-4">Arrows move, Enter chooses, Escape closes.</p>
    </div>
</template>
