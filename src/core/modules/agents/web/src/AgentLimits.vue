<script setup>
import {computed, ref} from "vue";
import {Btn, Icon, TextInput, useWindow} from "@journal/window-kit";

const context = useWindow();
const rows = ref([]);
const sources = ref({});
const open = ref(false);
const editing = ref(false);
const pending = ref(false);
const failure = ref("");
const notice = ref("");
const keptLimit = (value) => value === 0 ? "no limit" : String(value);
const status = (count, limit) => {
    if (limit === 0) return 0;
    return count > limit ? 2 : count === limit ? 1 : 0;
};
const entries = computed(() => rows.value.flatMap((row) => row.per_profile && row.profiles.length ? row.profiles.map((profile) => ({...profile, label: profile.title, type: row.key, key: `${row.key}:${profile.profile}`})) : [row]));
const severity = (row) => Math.max(status(row.running, row.run_limit), status(row.kept, row.kept_limit));
const flagged = computed(() => entries.value.filter((row) => severity(row)).sort((a, b) => severity(b) - severity(a)));
const running = computed(() => rows.value.reduce((sum, row) => sum + row.running, 0));
const kept = computed(() => rows.value.reduce((sum, row) => sum + row.kept, 0));
const statusText = (row) => {
    const amounts = [row.run_limit ? row.running - row.run_limit : -1, row.kept_limit ? row.kept - row.kept_limit : -1];
    const excess = Math.max(...amounts);
    return excess > 0 ? `Over by ${excess}` : excess === 0 ? "At limit" : "Within limits";
};
const barWidth = (count, limit) => limit ? `${Math.min(count / Math.max(count, limit) * 100, 100)}%` : "0%";
const overflowWidth = (count, limit) => limit && count > limit ? `${(count - limit) / count * 100}%` : "0%";
let latestRead = 0;
async function load() {
    const turn = ++latestRead;
    const answer = await context.read("agent limits");
    if (turn !== latestRead) return;
    rows.value = answer.ok ? answer.value.rows : [];
    failure.value = answer.ok ? "" : answer.error;
}
async function loadSources(turn) {
    const values = await Promise.all(rows.value.flatMap((row) => [row.run_setting, row.kept_setting]).map(async (key) => {
        const current = await context.read(`setting show ${key}`);
        return [key, current.ok ? current.value.source : ""];
    }));
    if (turn === latestRead) sources.value = Object.fromEntries(values);
}
async function toggleEditing() {
    editing.value = !editing.value;
    if (editing.value) await loadSources(latestRead);
}
async function change(row, key, previous, event) {
    if (pending.value || context.readOnly) return;
    const value = Number(event.target.value);
    if (!Number.isInteger(value) || value < 0 || !event.target.value.trim()) {
        failure.value = "Use a whole number of 0 or more.";
        event.target.value = String(previous);
        return;
    }
    pending.value = true;
    notice.value = "";
    try {
        const answer = await context.run(["setting", "set", key, String(value), "--environment", context.environment]);
        failure.value = answer.ok ? "" : answer.error;
        if (!answer.ok) {
            event.target.value = String(previous);
            return;
        }
        await load();
        notice.value = `${row.label} limits saved.`;
    } finally {
        pending.value = false;
    }
}
context.follow(["agent.*", "setting.*"], load);
load();
</script>

<template>
    <section class="agent-limits" data-agent-limits>
        <template v-if="rows.length">
            <button class="summary" type="button" :aria-expanded="open" @click="open = !open">
                <template v-if="flagged.length">
                    <template v-for="row in flagged.slice(0, 2)" :key="row.key"><span class="summary-item"><span :class="['mark', {over: severity(row) === 2}]" />{{ row.label }}: {{ statusText(row) }}</span></template>
                    <template v-if="flagged.length > 2"><span>{{ flagged.length - 2 }} more</span></template>
                </template>
                <template v-else><span>All within limits, {{ running }} running, {{ kept }} kept</span></template>
                <Icon name="caret" :size="12" />
            </button>
            <div v-show="open" class="limits-panel">
                <div class="limits-head"><strong>Agent limits</strong><Btn small :disabled="pending || context.readOnly" data-agent-limits-edit @click="toggleEditing">{{ editing ? 'Done' : 'Edit limits' }}</Btn></div>
                <template v-if="!editing">
                    <div class="table-head"><span>Agent</span><span>Running</span><span>Kept</span><span>Status</span></div>
                    <template v-for="row in entries" :key="row.key">
                        <div class="limit-row" :data-agent-limit-type="row.type || row.key" :data-agent-limit-profile="row.profile">
                            <strong>{{ row.label }}</strong>
                            <div class="count"><span>{{ row.run_limit ? `${row.running} of ${row.run_limit}` : `${row.running} · none may start` }}</span><div class="bar"><span :style="{width: barWidth(row.running, row.run_limit)}" /><i :style="{width: overflowWidth(row.running, row.run_limit)}" /></div></div>
                            <div class="count"><span>{{ row.kept }} of {{ keptLimit(row.kept_limit) }}</span><div class="bar"><span :style="{width: barWidth(row.kept, row.kept_limit)}" /><i :style="{width: overflowWidth(row.kept, row.kept_limit)}" /></div></div>
                            <span :class="['status', {warning: severity(row) === 1, danger: severity(row) === 2}]">{{ statusText(row) }}</span>
                        </div>
                    </template>
                </template>
                <template v-else>
                    <template v-for="row in rows" :key="row.key">
                        <div class="edit-row" :data-agent-limit-type="row.key">
                            <strong>{{ row.label }}</strong>
                            <label class="limit-field"><span>Running<template v-if="row.per_profile"> per profile</template></span><TextInput type="number" min="0" :value="String(row.run_limit)" :disabled="pending || context.readOnly" :data-agent-run-limit="row.key" @change="change(row, row.run_setting, row.run_limit, $event)" /><small>{{ sources[row.run_setting] }}</small></label>
                            <label class="limit-field"><span>Kept<template v-if="row.per_profile"> per profile</template></span><TextInput type="number" min="0" :value="String(row.kept_limit)" :disabled="pending || context.readOnly" :data-agent-kept-limit="row.key" @change="change(row, row.kept_setting, row.kept_limit, $event)" /><small>{{ sources[row.kept_setting] }}</small></label>
                        </div>
                    </template>
                    <p>Running 0 starts no agents. Kept 0 means no limit. Changes apply to {{ context.environment }}.</p>
                </template>
            </div>
        </template>
        <template v-if="failure"><p role="alert">{{ failure }}</p></template>
        <template v-if="notice"><p role="status">{{ notice }}</p></template>
    </section>
</template>

<style scoped>
.agent-limits { border-bottom: 1px solid var(--border); font-size: 12px; }
.summary { width: 100%; min-height: 32px; display: flex; align-items: center; gap: 12px; padding: 4px 14px; border: 0; background: none; color: var(--text-2); font: inherit; text-align: left; cursor: pointer; }
.summary svg { margin-left: auto; }
.summary-item { display: inline-flex; gap: 6px; align-items: center; white-space: nowrap; }
.mark { width: 7px; height: 7px; border-radius: 50%; background: var(--tone-warn); }
.mark.over { border-radius: 0; transform: rotate(45deg); background: var(--danger); }
.limits-panel { padding: 8px 14px 12px; }
.limits-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.table-head, .limit-row { display: grid; grid-template-columns: minmax(90px, 1fr) minmax(90px, 1fr) minmax(90px, 1fr) minmax(75px, .8fr); align-items: center; gap: 10px; padding: 5px 0; }
.table-head, p, small { color: var(--text-3); }
.count { min-width: 0; white-space: nowrap; }
.bar { position: relative; height: 3px; margin-top: 4px; background: var(--border); }
.bar span { display: block; height: 100%; background: var(--text-3); }
.bar i { position: absolute; right: 0; top: 0; height: 100%; background: var(--danger); }
.status.warning { color: var(--tone-warn); }
.status.danger { color: var(--danger); }
.edit-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 5px 0; }
p { margin: 0; }
.limit-field { display: flex; gap: 8px; align-items: center; color: var(--text-2); }
.limit-field :deep(input) { width: 64px; }
[role="alert"] { color: var(--danger); }
</style>
