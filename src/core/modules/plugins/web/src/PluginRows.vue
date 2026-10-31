<script setup>
import {RowList, useRows, useWindow} from "@journal/window-kit";

const context = useWindow();
const {rows, failure, loaded} = useRows("plugin list", ["plugin.*"]);

const switchOver = (row) => context.run(`plugin ${row.enabled ? "disable" : "enable"} ${row.name}`);
</script>

<template>
    <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No plugins installed">
        <template #default="{row}">
            <div class="plugin" :data-row="row.id">
                <span class="name">{{ row.title }}</span>
                <span class="release">{{ row.release }}</span>
                <span :class="['state', {on: row.enabled}]">{{ row.enabled ? "On" : "Off" }}</span>
                <button class="switch" type="button" @click="switchOver(row)">{{ row.enabled ? "Switch off" : "Switch on" }}</button>
            </div>
        </template>
    </RowList>
</template>

<style scoped>
.plugin {
    display: flex;
    flex: 1;
    align-items: baseline;
    gap: 10px;
    font-size: 13px;
}

.name {
    flex: 1;
    font-weight: 600;
}

.release,
.state {
    color: var(--text-3);
    font-size: 12px;
}

.state.on {
    color: var(--good, var(--text-2));
}

.switch {
    padding: 2px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    color: inherit;
    font-size: 12px;
    cursor: pointer;
}
</style>
