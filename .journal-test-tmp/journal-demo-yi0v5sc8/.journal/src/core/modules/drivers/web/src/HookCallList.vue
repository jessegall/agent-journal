<script setup>
import {RowList, WindowRoom, useRows, useWindow} from "@journal/window-kit";
import {hookEventLabel} from "./labels.js";

const {rows, failure, loaded} = useRows(`hook-call feed --agent-id ${useWindow().agent}`, ["hook_call.*"], {incremental: true});
</script>

<template>
    <WindowRoom>
        <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="Nothing recorded for this agent yet" hint="Each call the agent program makes to the journal is listed here.">
            <template #default="{row}">
                <span class="note">{{ hookEventLabel(row.hook) }}</span>
                <span class="main">{{ row.tool }} {{ row.summary }}</span>
                <span class="note">{{ row.refusal || row.answer }}</span>
            </template>
        </RowList>
    </WindowRoom>
</template>

<style scoped>
.main {
    flex: 1;
}

.note {
    color: var(--text-3);
    font-size: 12px;
}
</style>
