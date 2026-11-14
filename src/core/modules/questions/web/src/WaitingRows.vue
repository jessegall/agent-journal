<script setup>
import {computed} from "vue";
import {RowList, WindowRoom, useWindow} from "@journal/window-kit";

const {rows: waits, failure, loaded} = useWindow().props.waits;

function waited(openedAt) {
    return `${Math.max(0, Math.round((Date.now() - Date.parse(openedAt)) / 60000))} min`;
}

const rows = computed(() => waits.value.map((wait) => ({id: wait.id, label: wait.focus, status: wait.state, where: wait.targets, waited: waited(wait.opened_at)})));
</script>

<template>
    <WindowRoom>
        <div class="waiting">
            <h3 class="waiting-heading">What the agent is waiting for</h3>
            <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="Nothing is waiting" hint="Pending answers and other things the agent is waiting for appear here.">
                <template #default="{row}">
                    <span class="label">{{ row.label }}</span>
                    <template v-for="(detail, position) in [row.status, row.where, row.waited]" :key="position">
                        <span class="detail">{{ detail }}</span>
                    </template>
                </template>
            </RowList>
        </div>
    </WindowRoom>
</template>

<style scoped>
.waiting-heading {
    margin: 0 8px 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-2);
}

.label {
    flex: 1;
}

.detail {
    color: var(--text-3);
    font-size: 12px;
}
</style>
