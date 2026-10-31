<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import {agentLines} from "../domain/agentLines.js";
import {clock} from "../format/time.js";
import Icon from "../kit/Icon.vue";
import MenuPanel from "../kit/MenuPanel.vue";

// the latest lines the journal sent this agent, opened from the agent's band beside its context
const LATEST = 150;
const props = defineProps({session: {type: String, required: true}});
const open = ref(false);
const anchor = ref(null);
const lines = ref([]);

async function toggle() {
    open.value = !open.value;
    if (!open.value) return;
    const page = await api.list("nudges", {limit: LATEST});
    lines.value = agentLines(page.rows || [], props.session);
}
</script>

<template>
    <button ref="anchor" type="button" class="agent-lines-open" :aria-expanded="open" v-tip="{title: 'Lines sent to the agent', line: 'The latest lines the journal sent the agent, newest first.'}" @click.stop="toggle">
        <Icon name="activity" />
    </button>
    <template v-if="open">
        <MenuPanel :anchor="anchor" plain :min-width="420" :max-width="560" :max-height="520" :gap="12" @click.stop @close="open = false">
            <div class="agent-lines">
                <p class="agent-lines-title">Lines sent to the agent</p>
                <template v-if="!lines.length">
                    <p class="agent-lines-empty">No lines sent yet.</p>
                </template>
                <ol class="agent-lines-list">
                    <template v-for="sent in lines" :key="sent.id">
                        <li class="agent-lines-row">
                            <span class="agent-lines-time">{{ clock(sent.time) }}</span>
                            <span class="agent-lines-text">{{ sent.line }}</span>
                        </li>
                    </template>
                </ol>
            </div>
        </MenuPanel>
    </template>
</template>

<style scoped>
.agent-lines-open {
    display: inline-flex;
    align-items: center;
    padding: 2px 4px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.agent-lines-open:hover,
.agent-lines-open[aria-expanded="true"] {
    color: var(--text);
    background: var(--hover);
}

.agent-lines {
    padding: 10px 12px;
}

.agent-lines-title {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 11.5px;
}

.agent-lines-empty {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.agent-lines-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.agent-lines-row {
    display: flex;
    gap: 10px;
    font-size: 12px;
    line-height: 1.45;
}

.agent-lines-time {
    flex: none;
    color: var(--text-4);
    font-variant-numeric: tabular-nums;
}

.agent-lines-text {
    color: var(--text-2);
    overflow-wrap: anywhere;
}
</style>
