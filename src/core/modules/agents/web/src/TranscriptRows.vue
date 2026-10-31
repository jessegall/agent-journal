<script setup>
import {RowList, useRows} from "@journal/window-kit";

const props = defineProps({line: {type: String, required: true}});
const {rows, failure, loaded} = useRows(props.line, ["hook_call.create"]);
</script>

<template>
    <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No conversation yet">
        <template #default="{row}">
            <span class="author">{{ row.author }}</span>
            <span class="text">{{ row.text }}</span>
        </template>
    </RowList>
</template>

<style scoped>
.author {
    color: var(--text-3);
    font-size: 12px;
    min-width: 72px;
}

.text {
    flex: 1;
    white-space: pre-wrap;
}
</style>
