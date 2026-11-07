<script setup>
import {RowList, WindowRoom, useWindow} from "@journal/window-kit";
import {hookEventLabel} from "./labels.js";
import StopChecks from "./StopChecks.vue";

const window = useWindow();
window.state["calls.session-agent-id"] = String(window.agent);
const {rows, failure, loaded} = window.props.calls;
</script>

<template>
    <WindowRoom>
        <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="Nothing recorded for this agent yet" hint="Each call the agent program makes to the journal is listed here.">
            <template #default="{row}">
                <div class="activity">
                    <div class="summary"><span class="note">{{ hookEventLabel(row.hook) }}</span><span class="main">{{ row.tool }} {{ row.summary }}</span><span class="note">{{ row.refusal || row.answer }}</span></div>
                    <template v-if="row.stop_checks?.length"><StopChecks :checks="row.stop_checks" /></template>
                </div>
            </template>
        </RowList>
    </WindowRoom>
</template>

<style scoped>
.activity { width: 100%; }
.summary { display: flex; gap: 10px; }
.main {
    flex: 1;
}

.note {
    color: var(--text-3);
    font-size: 12px;
}
</style>
