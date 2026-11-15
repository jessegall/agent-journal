<script setup>
import {RowList, WindowRoom, useWindow} from "@journal/window-kit";
import {agentMessageTypeLabel} from "./labels.js";

// every line the modules can say to an agent: its key, its type, its words and how often it was said
const view = useWindow();
const {rows, failure, loaded} = view.props.agent_messages;
</script>

<template>
    <WindowRoom>
        <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No module declares an agent message" hint="Instructions available to agents appear here, grouped by module.">
            <template #default="{row}">
                <div class="agent-message" data-agent-message>
                    <p class="agent-message-head">
                        <span class="agent-message-key">{{ row.key }}</span>
                        <span class="agent-message-type" :data-type="row.type">{{ agentMessageTypeLabel(row.type) }}</span>
                        <span class="agent-message-count">said {{ row.delivery_count }} {{ row.delivery_count === 1 ? "time" : "times" }}</span>
                    </p>
                    <p class="agent-message-text">{{ row.text }}</p>
                </div>
            </template>
        </RowList>
    </WindowRoom>
</template>

<style scoped>
.agent-message {
    min-width: 0;
    padding: 6px 0;
}

.agent-message-head {
    display: flex;
    gap: 10px;
    align-items: baseline;
    margin: 0 0 2px;
    font-size: 12px;
}

.agent-message-key {
    color: var(--text);
    font-weight: 500;
}

.agent-message-type,
.agent-message-count {
    color: var(--text-3);
}

.agent-message-type[data-type="refusal"] {
    color: var(--tone-bad);
}

.agent-message-type[data-type="steering"] {
    color: var(--accent-text);
}

.agent-message-text {
    margin: 0;
    color: var(--text-2);
    font-size: 12.5px;
    overflow-wrap: anywhere;
}
</style>
