<script setup>
import {RowList, WindowRoom, useWindow} from "@journal/window-kit";
import {nudgeTypeLabel} from "./labels.js";

// every line the modules can say to an agent: its key, its type, its words and how often it was said
const view = useWindow();
const {rows, failure, loaded} = view.props.nudges;
</script>

<template>
    <WindowRoom>
        <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No module declares a nudge" hint="Instructions available to agents appear here, grouped by module.">
            <template #default="{row}">
                <div class="nudge" data-nudge>
                    <p class="nudge-head">
                        <span class="nudge-key">{{ row.key }}</span>
                        <span class="nudge-type" :data-type="row.type">{{ nudgeTypeLabel(row.type) }}</span>
                        <span class="nudge-count">said {{ row.delivery_count }} {{ row.delivery_count === 1 ? "time" : "times" }}</span>
                    </p>
                    <p class="nudge-text">{{ row.text }}</p>
                </div>
            </template>
        </RowList>
    </WindowRoom>
</template>

<style scoped>
.nudge {
    min-width: 0;
    padding: 6px 0;
}

.nudge-head {
    display: flex;
    gap: 10px;
    align-items: baseline;
    margin: 0 0 2px;
    font-size: 12px;
}

.nudge-key {
    color: var(--text);
    font-weight: 500;
}

.nudge-type,
.nudge-count {
    color: var(--text-3);
}

.nudge-type[data-type="refusal"] {
    color: var(--tone-bad);
}

.nudge-type[data-type="steering"] {
    color: var(--accent-text);
}

.nudge-text {
    margin: 0;
    color: var(--text-2);
    font-size: 12.5px;
    overflow-wrap: anywhere;
}
</style>
