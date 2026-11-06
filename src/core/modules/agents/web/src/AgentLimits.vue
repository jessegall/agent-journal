<script setup>
import {ref} from "vue";
import {Btn, TextInput, useWindow} from "@journal/window-kit";

const context = useWindow();
const rows = ref([]);
const sources = ref({});
const editing = ref(false);
const pending = ref(false);
const failure = ref("");
const notice = ref("");
const keptLimit = (value) => value === 0 ? "no limit" : String(value);
let latestRead = 0;
async function load() {
    const turn = ++latestRead;
    const answer = await context.read("agent limits");
    if (turn !== latestRead) return;
    rows.value = answer.ok ? answer.value.rows : [];
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok && editing.value) await loadSources(turn);
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
            <div class="limits-head"><strong>Agent limits</strong><Btn small :disabled="pending || context.readOnly" data-agent-limits-edit @click="toggleEditing">{{ editing ? 'Done' : 'Edit limits' }}</Btn></div>
            <template v-for="row in rows" :key="row.key">
                <div class="type-limits" :data-agent-limit-type="row.key">
                    <div class="limits-counts"><strong>{{ row.label }}</strong>
                        <template v-if="row.per_profile"><span>Running: {{ row.running }} · Kept: {{ row.kept }}</span></template>
                        <template v-else><span>Running: {{ row.running }} of {{ row.run_limit }} · Kept: {{ row.kept }} of {{ keptLimit(row.kept_limit) }}</span></template>
                    </div>
                    <template v-if="row.per_profile"><p>Limits per profile: running {{ row.run_limit }}, kept {{ keptLimit(row.kept_limit) }}.</p></template>
                    <template v-for="profile in row.profiles" :key="profile.profile"><p class="profile-limits" :data-agent-limit-profile="profile.profile">{{ profile.title }}: running {{ profile.running }} of {{ profile.run_limit }} · kept {{ profile.kept }} of {{ keptLimit(profile.kept_limit) }}</p></template>
                    <template v-if="editing">
                        <div class="limit-fields">
                            <label class="limit-field"><span>Running<template v-if="row.per_profile"> per profile</template></span><TextInput type="number" min="0" :value="String(row.run_limit)" :disabled="pending || context.readOnly" :data-agent-run-limit="row.key" @change="change(row, row.run_setting, row.run_limit, $event)" /><small>{{ sources[row.run_setting] }}</small></label>
                            <label class="limit-field"><span>Kept<template v-if="row.per_profile"> per profile</template></span><TextInput type="number" min="0" :value="String(row.kept_limit)" :disabled="pending || context.readOnly" :data-agent-kept-limit="row.key" @change="change(row, row.kept_setting, row.kept_limit, $event)" /><small>{{ sources[row.kept_setting] }}</small></label>
                        </div>
                        <p>Running 0 starts no agents. Kept 0 means no limit. Changes apply to {{ context.environment }}.</p>
                    </template>
                </div>
            </template>
        </template>
        <template v-if="failure"><p role="alert">{{ failure }}</p></template>
        <template v-if="notice"><p role="status">{{ notice }}</p></template>
    </section>
</template>

<style scoped>
.agent-limits { display: flex; flex-direction: column; gap: 8px; padding: 8px 14px; border-bottom: 1px solid var(--border); font-size: 12px; }
.limits-head, .limits-counts { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.limits-head { justify-content: space-between; }
.type-limits { display: flex; flex-direction: column; gap: 5px; }
.limits-counts span, p, small { color: var(--text-3); }
p { margin: 0; }
.profile-limits { padding-left: 12px; }
.limit-fields { display: flex; flex-wrap: wrap; gap: 12px; }
.limit-field { display: flex; gap: 8px; align-items: center; color: var(--text-2); }
.limit-field :deep(input) { width: 64px; }
[role="alert"] { color: var(--danger); }
</style>
