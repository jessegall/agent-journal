<script setup>
import {computed, reactive, ref} from "vue";
import {SearchBar, Segmented} from "@journal/window-kit";
import AgentList from "./AgentList.vue";
import WhoRow from "./WhoRow.vue";
import {EVERYONE, MAIN, OTHERS, ROLES, agentOf} from "./memoryScope.js";

// the column that answers whose memories to read: the main agent, every other agent as one list, then one agent at a time
const props = defineProps({environment: {type: String, required: true}, who: {type: String, required: true}, counts: {type: Object, required: true}});
const emit = defineEmits(["pick"]);

const listed = reactive({working: 0, ended: 0});
const role = ref("all");
const find = ref("");
const endedOpen = ref(false);
const searching = computed(() => Boolean(find.value.trim()));
const others = computed(() => props.counts.others);
const pickAgent = (agent) => emit("pick", agentOf(agent.agent_id), agent);
</script>

<template>
    <div class="column" data-agent-column>
        <div class="pinned">
            <WhoRow name="Main agent" meta="Reads these at every start" mark="main" :count="counts.main" :selected="who === MAIN" data-main @pick="emit('pick', MAIN)" />
            <template v-if="others">
                <WhoRow name="Other agents" meta="All of them in one list" :count="others" :selected="who === OTHERS" data-others @pick="emit('pick', OTHERS)" />
                <WhoRow name="Every agent" meta="All agents" :count="counts.everyone" :selected="who === EVERYONE" data-everyone @pick="emit('pick', EVERYONE)" />
            </template>
        </div>
        <template v-if="!others">
            <p class="note" data-no-agents>No other agent has saved a memory yet.</p>
        </template>
        <template v-else>
            <div class="tools">
                <SearchBar v-model="find" placeholder="Find an agent" data-agent-find />
                <Segmented fill :options="ROLES" :value="role" data-agent-roles @pick="role = $event" />
            </div>
            <div class="list">
                <AgentList :environment="environment" :role="role" :name="find" :who="who" @counted="listed.working = $event" @pick="pickAgent" />
                <AgentList ended :environment="environment" :role="role" :name="find" :who="who" :open="endedOpen || searching" @counted="listed.ended = $event" @fold="endedOpen = !endedOpen" @pick="pickAgent" />
                <template v-if="(searching || role !== 'all') && !listed.working && !listed.ended">
                    <p class="note" data-no-agent-match><b>No agent matches</b><br>Try another name, or a role and number such as helper 212.</p>
                </template>
                <p class="note">Agents with no memories are left out.</p>
            </div>
        </template>
    </div>
</template>

<style scoped>
.column {
    display: flex;
    flex-direction: column;
    min-height: 0;
    border-right: 1px solid var(--border);
}

.pinned {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 2px;
    padding: 8px;
    border-bottom: 1px solid var(--border);
}

.tools {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
}

.input {
    width: 100%;
    padding: 6px 9px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    outline: 0;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
}

.input:focus {
    border-color: var(--accent);
}

.list {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 0 8px 12px;
}

.note {
    margin: 8px;
    color: var(--text-3);
    font-size: 11.5px;
}

@media (max-width: 720px) {
    .column {
        border-right: 0;
    }

    .input {
        min-height: 44px;
        font-size: 16px;
    }
}
</style>
