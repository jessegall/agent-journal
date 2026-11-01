<script setup>
import {reactive, ref} from "vue";
import {Btn, RowList, Segmented, useRows} from "@journal/window-kit";

const KINDS = [
    {key: "api key", label: "API key"},
    {key: "login", label: "Login"},
    {key: "custom", label: "Custom"},
];

const {rows, failure, loaded, act, actionFailure} = useRows("secret list", ["secret.*"]);
const typed = reactive({});
const drafting = ref(false);
const draft = reactive({kind: KINDS[0].key, title: "", brief: ""});
const editing = ref(0);
const edited = reactive({title: "", brief: ""});
const asking = ref(0);
const removed = ref([]);

async function create() {
    if (!draft.title.trim()) return;
    const result = await act(["secret", "make", draft.title.trim(), "--kind", draft.kind, ...(draft.brief.trim() ? ["--brief", draft.brief.trim()] : [])]);
    if (!result.ok) return;
    drafting.value = false;
    Object.assign(draft, {kind: KINDS[0].key, title: "", brief: ""});
}

function edit(row) {
    editing.value = row.id;
    Object.assign(edited, {title: row.title, brief: row.brief});
}

async function saveEdit(row) {
    const result = await act(["secret", "update", String(row.id), "--title", edited.title.trim(), "--brief", edited.brief.trim()]);
    if (result.ok) editing.value = 0;
}

async function remove(row) {
    if (asking.value !== row.id) return void (asking.value = row.id);
    asking.value = 0;
    const result = await act(["secret", "delete", String(row.id)]);
    if (result.ok) removed.value = [...removed.value, row];
}

async function restore(row) {
    const result = await act(["secret", "restore", String(row.id)]);
    if (result.ok) removed.value = removed.value.filter((other) => other.id !== row.id);
}

const key = (row, field) => `${row.id}:${field.name}`;
const isFilled = (row, field) => row.filled.includes(field.name);

async function fill(row, field) {
    const value = (typed[key(row, field)] || "").trim();
    if (!value) return;
    const result = await act(["secret", "fill", String(row.id), field.name, value]);
    if (result.ok) typed[key(row, field)] = "";
}
</script>

<template>
    <template v-if="actionFailure">
        <p class="failure">{{ actionFailure }}</p>
    </template>
    <div class="tools">
        <Btn small bordered data-secret-new @click="drafting = !drafting">New secret</Btn>
    </div>
    <template v-if="drafting">
        <form class="draft" data-secret-draft @submit.prevent="create">
            <Segmented :options="KINDS" :value="draft.kind" @pick="draft.kind = $event" />
            <input v-model="draft.title" placeholder="What it is for" aria-label="Title">
            <input v-model="draft.brief" placeholder="A note on where it is used; you can leave this empty" aria-label="Note">
            <div class="draft-foot">
                <Btn small @click="drafting = false">Cancel</Btn>
                <Btn small kind="primary" type="submit" :disabled="!draft.title.trim()" data-secret-create>Make the secret</Btn>
            </div>
        </form>
    </template>
    <template v-for="row in removed" :key="row.id">
        <p class="removed" data-secret-removed>{{ row.title }} was deleted. <button type="button" data-secret-restore @click="restore(row)">Restore</button></p>
    </template>
    <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No secrets yet">
        <template #default="{row}">
            <div class="secret" :data-row="row.id">
                <template v-if="editing === row.id">
                    <form class="draft" data-secret-edit @submit.prevent="saveEdit(row)">
                        <input v-model="edited.title" aria-label="Title">
                        <input v-model="edited.brief" aria-label="Note">
                        <div class="draft-foot">
                            <Btn small @click="editing = 0">Cancel</Btn>
                            <Btn small kind="primary" type="submit" data-secret-save>Save</Btn>
                        </div>
                    </form>
                </template>
                <template v-else>
                    <div class="head">
                        <span class="title">{{ row.title }}</span>
                        <span class="kind">{{ row.secret_type }}</span>
                        <span class="grow" />
                        <button type="button" data-secret-edit-open @click="edit(row)">Edit</button>
                        <template v-if="asking === row.id">
                            <button type="button" @click="asking = 0">Keep it</button>
                            <button type="button" data-secret-confirm @click="remove(row)">Yes, delete</button>
                        </template>
                        <template v-else>
                            <button type="button" data-secret-delete @click="remove(row)">Delete</button>
                        </template>
                    </div>
                    <template v-if="row.brief">
                        <p class="brief">{{ row.brief }}</p>
                    </template>
                </template>
                <template v-for="field in row.fields" :key="field.name">
                    <form class="field" @submit.prevent="fill(row, field)">
                        <label :for="key(row, field)">{{ field.name }}</label>
                        <input :id="key(row, field)" v-model="typed[key(row, field)]" :type="field.hidden ? 'password' : 'text'" autocomplete="off"
                               :placeholder="isFilled(row, field) ? 'Filled; type to replace it' : 'Type the value'">
                        <button type="submit">Save</button>
                    </form>
                </template>
                <div class="programs">
                    <span class="label">Programs</span>
                    <span>{{ row.programs.length ? row.programs.join(", ") : "None allowed yet" }}</span>
                    <template v-for="program in row.proposed" :key="program">
                        <button type="button" @click="act(['secret', 'allow', String(row.id), program])">Allow {{ program }}</button>
                    </template>
                    <template v-if="!row.helpers">
                        <button type="button" @click="act(['secret', 'allow', String(row.id), '--helpers'])">Let helpers use it</button>
                    </template>
                </div>
            </div>
        </template>
    </RowList>
</template>

<style scoped>
.failure {
    margin: 0 0 8px;
    color: var(--bad, var(--text-2));
    font-size: 12px;
}

.tools {
    margin-bottom: 8px;
}

.draft {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
    padding: 10px 12px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
}

.draft-foot {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
}

.removed {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 12px;
}

.grow {
    flex: 1;
}

.secret {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
}

.head {
    display: flex;
    align-items: baseline;
    gap: 10px;
}

.title {
    flex: 1;
    font-weight: 600;
}

.kind,
.brief,
.label {
    color: var(--text-3);
    font-size: 12px;
}

.brief {
    margin: 0;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.field input {
    padding: 4px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    color: inherit;
    font-size: 12px;
}

.programs {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 8px;
}

button {
    padding: 2px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    color: inherit;
    font-size: 12px;
    cursor: pointer;
}
</style>
