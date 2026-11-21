<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { computed, nextTick, ref } from 'vue';
import type { AgentOptionData } from '@generated/types/chat';

/**
 * The agents Home can talk to, idle ones included, as a listbox: Tab reaches it, the arrow keys move between agents
 * and Enter or a click chooses one. Each choice is a link by agent id, so a refresh keeps it, and the chosen agent and
 * its state are announced.
 */
const props = defineProps<{
    agents: AgentOptionData[];
    selectedAgentId: string | undefined;
    agentUrl: (agent: AgentOptionData) => string;
}>();

const options = ref<HTMLLIElement[]>([]);
const selected = computed(() => props.agents.find((agent) => agent.id === props.selectedAgentId));

function choose(agent: AgentOptionData): void {
    router.visit(props.agentUrl(agent), { preserveScroll: true });
}

async function move(from: number, step: number): Promise<void> {
    const next = (from + step + props.agents.length) % props.agents.length;
    await nextTick();
    options.value[next]?.focus();
}

function focusableIndex(): number {
    const index = props.agents.findIndex((agent) => agent.id === props.selectedAgentId);

    return index === -1 ? 0 : index;
}
</script>

<template>
    <div class="border-b border-border py-2">
        <template v-if="agents.length === 0">
            <p class="text-small text-text-3">No agents yet.</p>
        </template>
        <ul
            class="flex flex-wrap gap-1.5"
            role="listbox"
            aria-label="Agents"
            aria-orientation="horizontal"
        >
            <template v-for="(agent, index) in agents" :key="agent.id">
                <li
                    ref="options"
                    role="option"
                    :aria-selected="agent.id === selectedAgentId"
                    :tabindex="index === focusableIndex() ? 0 : -1"
                    class="flex cursor-pointer items-center gap-1.5 rounded-control border border-border-2 px-2.5 py-0.5 text-small text-text-2 outline-none hover:bg-hover hover:text-text focus-visible:ring-2 focus-visible:ring-brand"
                    :class="{ 'border-brand bg-sel text-text': agent.id === selectedAgentId }"
                    @click="choose(agent)"
                    @keydown.enter.prevent="choose(agent)"
                    @keydown.space.prevent="choose(agent)"
                    @keydown.right.prevent="move(index, 1)"
                    @keydown.down.prevent="move(index, 1)"
                    @keydown.left.prevent="move(index, -1)"
                    @keydown.up.prevent="move(index, -1)"
                >
                    <span>{{ agent.name }}</span>
                    <span class="text-text-3">{{ agent.presenceLabel }}</span>
                </li>
            </template>
        </ul>
        <p class="sr-only" aria-live="polite">
            <template v-if="selected">{{ selected.name }}, {{ selected.presenceLabel }}</template>
        </p>
    </div>
</template>
