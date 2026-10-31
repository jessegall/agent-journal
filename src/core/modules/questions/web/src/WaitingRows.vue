<script setup>
import {computed} from "vue";
import {RowList, useRows} from "@journal/window-kit";

const {rows: waits, failure, loaded} = useRows("wait list", ["wait.*", "question.*"]);
const {rows: targets} = useRows("wait-target list", ["wait_target.*"]);

function waited(openedAt) {
    return `${Math.max(0, Math.round((Date.now() - Date.parse(openedAt)) / 60000))} min`;
}

function waitsOnUser(wait) {
    return wait.type === "help_request" || targets.value.some((target) => target.wait_id === wait.id && target.row_table === "questions");
}

const rows = computed(() => waits.value.filter((wait) => wait.state === "open" && waitsOnUser(wait)).map((wait) => ({
    id: wait.id,
    label: wait.focus,
    status: wait.state,
    where: targets.value.filter((target) => target.wait_id === wait.id).map((target) => `${target.row_table}:${target.row_id}`).join(", "),
    waited: waited(wait.opened_at),
})));
</script>

<template>
    <div class="waiting">
        <h3 class="waiting-heading">What the agent is waiting on</h3>
        <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="Nothing is waiting">
            <template #default="{row}">
                <span class="label">{{ row.label }}</span>
                <template v-for="(detail, position) in [row.status, row.where, row.waited]" :key="position">
                    <span class="detail">{{ detail }}</span>
                </template>
            </template>
        </RowList>
    </div>
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
