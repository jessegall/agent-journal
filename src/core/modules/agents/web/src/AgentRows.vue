<script setup>
import {RowList, useRows} from "@journal/window-kit";

const props = defineProps({line: {type: String, required: true}, empty: {type: String, required: true}});
const {rows, failure, loaded, older} = useRows(props.line, ["agent.*"], {incremental: true});
</script>

<template>
    <RowList :rows="rows" :failure="failure" :loaded="loaded" :older="older" :empty="empty">
        <template #default="{row}">
            <span class="id">#{{ row.id }}</span>
            <span class="main">{{ row.session }}</span>
            <span class="note">{{ row.program }} · {{ row.role }}</span>
            <span :class="['state', {running: !row.ended_at}]">{{ row.ended_at ? `Closed ${new Date(row.ended_at).toLocaleString()}` : "Running" }}</span>
        </template>
    </RowList>
</template>

<style scoped>
.id {
    flex: none;
    width: 44px;
    color: var(--text-3);
    font-size: 12px;
}

.state {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
}

.state.running {
    color: var(--accent-text);
}

.main {
    flex: 1;
}

.note {
    color: var(--text-3);
    font-size: 12px;
}
</style>
