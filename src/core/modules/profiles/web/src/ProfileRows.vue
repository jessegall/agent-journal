<script setup>
import {computed, reactive, ref} from "vue";
import {ago, Btn, Dialog, ListTools, RowList, Segmented, useListTools, useRows} from "@journal/window-kit";

const TYPES = [
    {key: "subagent", label: "Subagent"},
    {key: "worker", label: "Worker"},
];
const NEW_PROFILE = {name: "", description: "", tools: "Read, Grep, Glob", profile_type: "subagent", model: "sonnet", codex_model: "gpt-6.1-sol", body: "", shipped: false};

const {rows, failure, loaded, act, actionFailure} = useRows("profile list", []);
const tools = useListTools(rows, {title: (row) => `${row.name} ${row.description} ${row.profile_type} ${row.model} ${row.codex_model}`});
const opened = ref(null);
const draft = reactive({...NEW_PROFILE});
const notice = ref("");

const validName = computed(() => /^[a-z0-9_-]+$/i.test(draft.name));
const canSave = computed(() => validName.value && draft.description.trim());
const usedWords = (row) => (row.uses ? `Dispatched ${row.uses} ${row.uses === 1 ? "time" : "times"}, last ${ago(new Date(row.last_used * 1000).toISOString())}` : "Never dispatched here");

function open(row) {
    opened.value = row;
    Object.assign(draft, row);
}

async function save() {
    const result = await act(["profile", "save", draft.name, "--description", draft.description, "--tools", draft.tools, "--type", draft.profile_type, "--model", draft.model, "--codex-model", draft.codex_model, "--body", draft.body]);
    if (!result.ok) return;
    notice.value = `${draft.name} saved; the agent reads it at its next dispatch.`;
    opened.value = null;
}
</script>

<template>
    <div class="bar">
        <Btn small data-profile-new @click="open(NEW_PROFILE)">New profile</Btn>
        <span class="count">{{ rows.length }} {{ rows.length === 1 ? "profile" : "profiles" }} in .claude/agents</span>
        <template v-if="notice">
            <span class="count" data-profile-notice>{{ notice }}</span>
        </template>
    </div>
    <template v-if="actionFailure">
        <p class="failure">{{ actionFailure }}</p>
    </template>
    <ListTools :tools="tools" placeholder="Find a profile" />
    <RowList :rows="tools.shown.value" :failure="failure" :loaded="loaded" empty="No profiles yet" row-key="name">
        <template #default="{row}">
            <button type="button" class="profile" :data-profile="row.name" @click="open(row)">
                <span class="title">{{ row.name }}</span>
                <span class="subject">{{ row.description }}</span>
                <span class="subject">{{ row.profile_type }} · {{ row.model || "the agent's model" }} on Claude · {{ row.codex_model || "the agent's model" }} on Codex</span>
                <span class="subject">{{ usedWords(row) }}</span>
            </button>
        </template>
    </RowList>
    <template v-if="opened">
        <Dialog :title="opened.name || 'New profile'" @close="opened = null">
            <form class="form" data-profile-form @submit.prevent="save">
                <template v-if="!opened.name">
                    <label class="field">Name<input v-model.trim="draft.name" placeholder="critic" aria-label="Name"></label>
                </template>
                <label class="field">When it is used<textarea v-model="draft.description" rows="3" aria-label="When it is used"></textarea></label>
                <label class="field">Tools<input v-model="draft.tools" placeholder="Read, Grep, Glob" aria-label="Tools"></label>
                <div class="field">Type<Segmented :options="TYPES" :value="draft.profile_type" @pick="draft.profile_type = $event" /></div>
                <label class="field">Model on Claude Code<input v-model="draft.model" aria-label="Model on Claude Code"></label>
                <label class="field">Model on Codex<input v-model="draft.codex_model" aria-label="Model on Codex"></label>
                <label class="field">Instructions<textarea v-model="draft.body" rows="12" aria-label="Instructions"></textarea></label>
                <template v-if="opened.shipped">
                    <p class="count">The journal ships this profile; the next start puts it back as shipped.</p>
                </template>
                <Btn small kind="primary" type="submit" :disabled="!canSave">Save</Btn>
            </form>
        </Dialog>
    </template>
</template>

<style scoped>
.bar {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 8px;
}

.count,
.subject {
    color: var(--text-3);
    font-size: 12px;
}

.failure {
    margin: 0 0 8px;
    color: var(--bad, var(--text-2));
    font-size: 12px;
}

.profile {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
    padding: 8px;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.title {
    font-weight: 600;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: var(--text-2);
    font-size: 12px;
}

.field input,
.field textarea {
    padding: 4px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface, none);
    color: inherit;
    font: inherit;
}
</style>
