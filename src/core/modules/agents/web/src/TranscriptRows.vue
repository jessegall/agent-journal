<script setup>
import {computed} from "vue";
import {AutoScrollPane, RowList, WindowRoom, useRows} from "@journal/window-kit";

// the conversation oldest first with its newest row at the foot, where the pane opens and stays as rows arrive; scrolling up stops that and
// shows Newest; each row says who wrote it, lined up with the card's tabs, its words, and at its end when
const props = defineProps({line: {type: String, required: true}, padding: {type: String, default: "8px 22px 8px 27px"}});
const {rows, failure, loaded} = useRows(props.line, ["hook_call.create"]);
const newest = computed(() => rows.value.at(-1)?.id ?? 0);
const timeOf = (row) => (row.time ? new Date(row.time).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", second: "2-digit"}) : "");
</script>

<template>
    <WindowRoom :padding="padding">
        <div class="transcript">
            <AutoScrollPane :row-count="newest">
                <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No conversation yet" hint="The agent's words and its tool calls show here as it works.">
                    <template #default="{row}">
                        <span class="author" :data-author="row.author">{{ row.author }}</span>
                        <span class="text">{{ row.text }}</span>
                        <time class="time" data-row-time :datetime="row.time">{{ timeOf(row) }}</time>
                    </template>
                </RowList>
            </AutoScrollPane>
        </div>
    </WindowRoom>
</template>

<style scoped>
.transcript {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
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
