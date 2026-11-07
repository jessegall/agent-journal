<script setup>
import {computed, ref, watch} from "vue";
import {READ_RATES, coalesced, useWindow, wordLabel} from "@journal/window-kit";
import AgentColumn from "./AgentColumn.vue";
import MemoryPane from "./MemoryPane.vue";
import {EVERYONE, MAIN, OTHERS, agentIdOf, isAgent} from "./memoryScope.js";
import {useCounts} from "./useCounts.js";

// the memories of one environment: the column of whose to read beside the memories of whoever is chosen; at phone width one fills the screen
const props = defineProps({environment: {type: String, required: true}});

const context = useWindow();
const who = ref(MAIN);
const picking = ref(false);
const agent = ref(null);
const counts = useCounts();
const CHOICE_NAMES = {[MAIN]: "Main agent", [OTHERS]: "Other agents", [EVERYONE]: "Every agent"};
const chosenName = computed(() => (isAgent(who.value) ? agent.value?.name ?? "" : CHOICE_NAMES[who.value]));
const chosenCount = computed(() => (isAgent(who.value) ? "" : counts[who.value]));

async function readAgent() {
    if (!isAgent(who.value)) return void (agent.value = null);
    const id = agentIdOf(who.value);
    context.state["selected.id"] = String(id);
    await context.reload("selected");
    if (agentIdOf(who.value) !== id) return;
    const selected = context.props.selected;
    const value = selected.data.value;
    agent.value = selected.failure.value ? null : {id, role: value.role, ended_at: value.ended_at, name: value.given_name || `${wordLabel(value.role)} ${id}`};
}

const pick = (chosen) => {
    who.value = chosen;
    picking.value = false;
};
watch(who, readAgent, {immediate: true});
context.follow(["agent.*"], coalesced(() => readAgent(), READ_RATES.openPanel));

</script>

<template>
    <div :class="['browser', {picking}]" data-memory-browser>
        <div class="chooser">
            <span class="chooser-label">Whose memories</span>
            <button type="button" class="chooser-button" :aria-expanded="picking" data-whose @click="picking = !picking">
                <span class="chooser-name">{{ chosenName }}</span>
                <span class="chooser-count">{{ chosenCount }}</span>
                <span aria-hidden="true">{{ picking ? "▴" : "▾" }}</span>
            </button>
        </div>
        <AgentColumn class="who" :environment="environment" :who="who" :counts="counts" @pick="pick" />
        <MemoryPane class="memories" :who="who" :environment="environment" :agent="agent" :counts="counts" @pick="pick" />
    </div>
</template>

<style scoped>
.browser {
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr);
    align-self: stretch;
    height: calc(100vh - 100px);
    min-height: 420px;
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
}

.chooser {
    display: none;
}

@media (max-width: 720px) {
    .browser {
        display: flex;
        flex-direction: column;
        height: auto;
        min-height: 0;
        border: 0;
        border-radius: 0;
    }

    .chooser {
        display: block;
        padding: 8px 0;
    }

    .chooser-label {
        display: block;
        margin-bottom: 4px;
        color: var(--text-3);
        font-size: 12px;
    }

    .chooser-button {
        display: flex;
        gap: 8px;
        align-items: center;
        width: 100%;
        min-height: 48px;
        padding: 6px 12px;
        border: 1px solid var(--border-2);
        border-radius: 8px;
        background: var(--raised);
        color: var(--text);
        font: inherit;
        text-align: left;
    }

    .chooser-name {
        flex: 1;
        min-width: 0;
        font-weight: 600;
    }

    .chooser-count {
        color: var(--text-3);
        font-size: 12px;
    }

    .browser:not(.picking) .who,
    .browser.picking .memories {
        display: none;
    }
}
</style>
