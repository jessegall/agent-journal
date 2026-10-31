<script setup>
import {RowList, useRows} from "@journal/window-kit";

const {rows, failure, loaded} = useRows("dump list", ["dump.*", "dump_item.*"]);
</script>

<template>
    <div class="dumps">
        <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No dumps">
            <template #default="{row}">
                <div class="dump">
                    <p class="dump-title">{{ row.title || `Dump ${row.id}` }}</p>
                    <p class="dump-brief">{{ row.outcome ? `Closed: ${row.outcome}` : row.brief }}</p>
                </div>
            </template>
        </RowList>
    </div>
</template>

<style scoped>
.dump {
    padding: 6px 0;
}

.dump-title {
    margin: 0;
    font-size: 13px;
}

.dump-brief {
    margin: 2px 0 0;
    font-size: 12px;
    color: var(--text-4);
}
</style>
