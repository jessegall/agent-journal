<script setup>
import {reactive} from "vue";
import {RowList, useRows} from "@journal/window-kit";

const {rows, failure, loaded, act, actionFailure} = useRows("secret list", ["secret.*"]);
const typed = reactive({});

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
    <p v-if="actionFailure" class="failure">{{ actionFailure }}</p>
    <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No secrets yet">
        <template #default="{row}">
            <div class="secret" :data-row="row.id">
                <div class="head">
                    <span class="title">{{ row.title }}</span>
                    <span class="kind">{{ row.secret_type }}</span>
                </div>
                <p v-if="row.brief" class="brief">{{ row.brief }}</p>
                <form v-for="field in row.fields" :key="field.name" class="field" @submit.prevent="fill(row, field)">
                    <label :for="key(row, field)">{{ field.name }}</label>
                    <input :id="key(row, field)" v-model="typed[key(row, field)]" :type="field.hidden ? 'password' : 'text'" autocomplete="off"
                           :placeholder="isFilled(row, field) ? 'Filled; type to replace it' : 'Type the value'">
                    <button type="submit">Save</button>
                </form>
                <div class="programs">
                    <span class="label">Programs</span>
                    <span>{{ row.programs.length ? row.programs.join(", ") : "None allowed yet" }}</span>
                    <button v-for="program in row.proposed" :key="program" type="button" @click="act(['secret', 'allow', String(row.id), program])">
                        Allow {{ program }}
                    </button>
                    <button v-if="!row.helpers" type="button" @click="act(['secret', 'allow', String(row.id), '--helpers'])">Let helpers use it</button>
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
