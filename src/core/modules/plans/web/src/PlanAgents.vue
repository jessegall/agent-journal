<script setup>
import {computed, ref} from "vue";
import {AgentBadge, AgentTip, Icon, MenuItem, MenuLabel, MenuPanel, agentLabel, peekRef} from "@journal/window-kit";

// who has a plan, on its card: always one row, so every card keeps its height. One agent shows its badge, several a button that lists them
const props = defineProps({planId: {type: Number, required: true}, agents: {type: Array, default: () => []}, assignee: {type: Object, default: null}});
const named = computed(() => [...new Map(props.agents.filter((agent) => agent.id !== props.assignee?.id).map((agent) => [agent.id, agent])).values()]);
const anchor = ref(null);
const open = ref(false);
const openAgent = (agent) => peekRef(`agents:${agent.id}`);
</script>

<template>
    <span class="plan-agents" data-plan-agents @click.stop @keydown.enter.stop>
        <template v-if="assignee">
            <AgentTip as="button" :agent-id="assignee.id" :label="agentLabel(assignee.name, assignee.main)" class="plan-agents-button" data-plan-assignee @click="openAgent(assignee)"><AgentBadge :name="assignee.name" :main="assignee.main" /></AgentTip>
        </template>
        <template v-if="!named.length">
            <template v-if="!assignee">
                <span class="plan-agents-none" data-plan-agents-none>No agent assigned</span>
            </template>
        </template>
        <template v-else-if="named.length === 1">
            <AgentTip as="button" :agent-id="named[0].id" :label="agentLabel(named[0].name, named[0].main)" class="plan-agents-button" data-plan-agent @click="openAgent(named[0])"><AgentBadge :name="named[0].name" :main="named[0].main" /></AgentTip>
        </template>
        <template v-else>
            <button ref="anchor" type="button" class="plan-agents-button" :aria-expanded="open" data-plan-agents-list @click="open = !open">
                Agents: {{ named.length }}
                <Icon name="down" :size="11" />
            </button>
            <template v-if="open">
                <MenuPanel :anchor="anchor" :min-width="200" data-plan-agents-menu @close="open = false">
                    <MenuLabel>Agents on plan {{ planId }}</MenuLabel>
                    <template v-for="agent in named" :key="agent.id">
                        <MenuItem data-plan-agent @click="openAgent(agent)"><AgentBadge :name="agent.name" :main="agent.main" /></MenuItem>
                    </template>
                </MenuPanel>
            </template>
        </template>
    </span>
</template>

<style scoped>
.plan-agents {
    display: flex;
    align-items: center;
    flex: none;
    min-width: 0;
    color: var(--text-3);
    font-size: 12px;
}

.plan-agents-none {
    color: var(--text-4);
}

.plan-agents-button {
    display: inline-flex;
    gap: 5px;
    align-items: center;
    min-width: 0;
    margin-left: -6px;
    padding: 3px 6px;
    overflow: hidden;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
}

.plan-agents-button:hover {
    background: var(--hover);
    color: var(--text);
}
</style>
