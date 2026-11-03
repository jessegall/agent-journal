<script setup>
import {computed} from "vue";
import {AutoScrollPane, RowList, useRows} from "@journal/window-kit";

// the conversation oldest first with its newest row at the foot, where the pane opens and stays as rows arrive; scrolling up stops that and
// shows Newest; each row says who wrote it and when
const props = defineProps({line: {type: String, required: true}});
const {rows, failure, loaded} = useRows(props.line, ["hook_call.create"]);
const newest = computed(() => rows.value.at(-1)?.id ?? 0);
const timeOf = (row) => (row.at ? new Date(row.at).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", second: "2-digit"}) : "");
</script>

<template>
    <div class="transcript">
        <AutoScrollPane :row-count="newest">
            <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No conversation yet" hint="The agent's words and its tool calls show here as it works.">
                <template #default="{row}">
                    <span class="author" :data-author="row.author">{{ row.author }}</span>
                    <time class="time" data-row-time :datetime="row.at">{{ timeOf(row) }}</time>
                    <span class="text">{{ row.text }}</span>
                </template>
            </RowList>
        </AutoScrollPane>
    </div>
</template>

<style scoped>
.transcript {
    display: flex;
    flex-direction: column;
    height: 320px;
}

.author {
    color: var(--text-3);
    font-size: 12px;
    min-width: 72px;
}

.time {
    flex: none;
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
}

.text {
    flex: 1;
    white-space: pre-wrap;
}
</style>
