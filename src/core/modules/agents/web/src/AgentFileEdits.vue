<script setup>
import {computed} from "vue";
import {ago, AutoScrollPane, DiffCard, RowList, useRows} from "@journal/window-kit";

// the files one agent changed, oldest first with the newest edit at the foot, where the pane opens and stays as edits arrive; scrolling up stops
// that and shows Newest; each edit is a diff card of its first lines, and older edits are read from the button above
const CARD_LINES = 5;
const props = defineProps({agent: {type: Number, required: true}});
const {rows, failure, loaded, more, older} = useRows(`file-edit list --agent ${props.agent}`, ["file_edit.create"], {incremental: true});
const edits = computed(() => rows.value.map((edit) => ({...edit, lines: JSON.parse(edit.rows || "[]")})).reverse());
const newest = computed(() => rows.value[0]?.id ?? 0);
</script>

<template>
    <div class="file-feed">
        <template v-if="more && rows.length">
            <button type="button" class="file-feed-older" data-file-feed-older @click="older">Show older edits</button>
        </template>
        <AutoScrollPane :row-count="newest">
            <RowList :rows="edits" :failure="failure" :loaded="loaded" empty="No edits by this agent yet">
                <template #default="{row}">
                    <DiffCard flush :lines="CARD_LINES" :path="row.path" :kind="row.edit_type" :added="row.added" :removed="row.removed" :ago="ago(row.created_at)" :rows="row.lines" />
                </template>
            </RowList>
        </AutoScrollPane>
    </div>
</template>

<style scoped>
.file-feed {
    display: flex;
    flex-direction: column;
    height: 320px;
}

.file-feed-older {
    align-self: flex-start;
    margin: 0 0 6px;
    padding: 2px 8px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.file-feed-older:hover {
    background: var(--hover);
    color: var(--text);
}
</style>
