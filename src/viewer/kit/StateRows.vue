<script setup>
import RowList from "./RowList.vue";
import {useRows} from "./useRows.js";
import {stateLabel} from "../src/domain/states.js";

const props = defineProps({
    term: {type: String, required: true},
    line: {type: String, required: true},
    events: {type: Array, required: true},
    empty: {type: String, required: true},
});
const {rows, failure, loaded} = useRows(props.line, props.events);
</script>

<template>
    <RowList :rows="rows" :failure="failure" :loaded="loaded" :empty="empty">
        <template #default="{row}">
            <span class="title">{{ row.title }}</span>
            <span class="state">{{ stateLabel(term, row.state) }}</span>
        </template>
    </RowList>
</template>

<style scoped>
.title {
    flex: 1;
}

.state {
    color: var(--text-3);
    font-size: 12px;
}
</style>
