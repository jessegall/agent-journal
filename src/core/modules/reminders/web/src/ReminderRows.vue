<script setup>
import {computed, reactive} from "vue";
import {Btn, RowList, WindowRoom, added, removed, useWindow} from "@journal/window-kit";

const {rows, failure, loaded, act, actionFailure} = useWindow().props.reminders;
const draft = reactive({text: "", at: "", minutes: "", once: false});
const canMake = computed(() => draft.text.trim() && (draft.at || Number(draft.minutes)));

function when(row) {
    if (row.ended_at) return "Ended";
    const parts = [];
    if (row.due_at) parts.push(`At ${new Date(row.due_at).toLocaleString()}`);
    if (row.interval_seconds) parts.push(`Every ${Math.round(row.interval_seconds / 60)} minutes`);
    if (row.interval_tool_uses) parts.push(`Every ${row.interval_tool_uses} tool uses`);
    if (row.interval_tasks) parts.push(`Every ${row.interval_tasks} closed tasks`);
    if (row.single_use) parts.push("once");
    if (row.block_condition) parts.push(`Waiting: ${row.block_condition}`);
    return parts.join(", ");
}

async function make() {
    const line = ["reminder", "make", draft.text.trim(), ...(draft.at ? ["--at", new Date(draft.at).toISOString()] : []), ...(Number(draft.minutes) ? ["--every-minutes", String(draft.minutes)] : []), ...(draft.once ? ["--once"] : [])];
    const pending = {id: `making-${Date.now()}`, text: draft.text.trim(), ended_at: null, due_at: draft.at ? new Date(draft.at).toISOString() : null, interval_seconds: Number(draft.minutes) * 60 || 0, single_use: draft.once};
    const result = await act(line, added(pending));
    if (result.ok) Object.assign(draft, {text: "", at: "", minutes: "", once: false});
}
</script>

<template>
    <WindowRoom>
        <div class="reminders" data-reminders>
            <form class="form" data-reminder-form @submit.prevent="make">
                <input v-model="draft.text" placeholder="Reminder text" aria-label="Reminder text">
                <label class="note">At<input v-model="draft.at" type="datetime-local" aria-label="At"></label>
                <label class="note">Interval (minutes)<input v-model="draft.minutes" type="number" min="1" aria-label="Interval (minutes)"></label>
                <label class="note"><input v-model="draft.once" type="checkbox" aria-label="Once"> Once</label>
                <Btn small variant="primary" type="submit" :disabled="!canMake">Add</Btn>
            </form>
            <template v-if="actionFailure">
                <p class="failure">{{ actionFailure }}</p>
            </template>
            <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No reminders yet" hint="Reminders appear here with their scheduled times.">
                <template #default="{row}">
                    <div class="row" :data-reminder="row.id">
                        <span class="text">{{ row.text }}</span>
                        <span class="note">{{ when(row) }}</span>
                        <Btn small data-reminder-remove @click="act(['reminder', 'delete', String(row.id)], removed(row.id))">Remove</Btn>
                    </div>
                </template>
            </RowList>
        </div>
    </WindowRoom>
</template>

<style scoped>
.reminders {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}

.form > input {
    flex: 1;
    min-width: 200px;
}

input {
    padding: 4px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface, none);
    color: inherit;
    font: inherit;
}

.row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 8px;
}

.text {
    flex: 1;
    min-width: 0;
}

.note {
    color: var(--text-3);
    font-size: 12px;
}

.failure {
    margin: 0;
    color: var(--bad, var(--text-2));
    font-size: 12px;
}
</style>
