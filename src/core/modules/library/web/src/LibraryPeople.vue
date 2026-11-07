<script setup>
import {ref} from "vue";
import {Btn, FormField, RowList, Segmented, TextInput, useRunLine, useWindow} from "@journal/window-kit";
import LibraryPerson from "./LibraryPerson.vue";

const ROLES = [
    {key: "admin", label: "Admin"},
    {key: "edit", label: "Edit"},
    {key: "read", label: "Read-only"},
];

// the users of the shared server, for an admin: add one, change a role, remove one, and read and revoke tokens; the
// server decides each of them, so a refusal shows as the server worded it
const context = useWindow();
const {data: users, failure} = context.props.users;
const load = () => context.reload("users");
const {refusal, run} = useRunLine(load);
const name = ref("");
const role = ref("read");
const added = ref(null);

async function add() {
    const answer = await run(["library-user", "add", name.value.trim(), "--role", role.value]);
    added.value = answer.ok ? answer.value : null;
    if (answer.ok) name.value = "";
}

load();
</script>

<template>
    <div class="people" data-library-people>
        <form class="people-add" data-people-add @submit.prevent="add">
            <FormField label="Add a user" for="people-name" help="Their first token is shown once, below.">
                <TextInput id="people-name" v-model="name" placeholder="Name" data-people-name />
            </FormField>
            <Segmented :options="ROLES" :value="role" data-people-new-role @pick="role = $event" />
            <Btn variant="primary" :disabled="!name.trim()" data-people-submit @click="add">Add the user</Btn>
        </form>
        <template v-if="added">
            <p class="people-token" data-people-first-token>{{ added.user.name }} has this token, shown once: {{ added.token_text }}</p>
        </template>
        <template v-if="refusal">
            <p class="people-failure" role="alert" data-people-refusal>{{ refusal }}</p>
        </template>
        <RowList :rows="users?.users ?? []" :failure="failure" :loaded="Boolean(users) || Boolean(failure)" empty="No users yet" hint="The users of the shared server appear here.">
            <template #default="{row}">
                <LibraryPerson :user="row" @role="(user, picked) => run(['library-user', 'role', String(user.id), picked])" @remove="(user) => run(['library-user', 'remove', String(user.id)])" />
            </template>
        </RowList>
    </div>
</template>

<style scoped>
.people {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.people-add {
    display: flex;
    align-items: flex-end;
    gap: 10px;
}

.people-token {
    margin: 0;
    font-family: var(--mono);
    font-size: 12px;
    word-break: break-all;
}

.people-failure {
    margin: 0;
    color: var(--danger);
    font-size: 13px;
}
</style>
