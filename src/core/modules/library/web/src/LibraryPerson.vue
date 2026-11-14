<script setup>
import {ref} from "vue";
import {Btn, Segmented, useRunLine, useWindow} from "@journal/window-kit";

const ROLES = [
    {key: "admin", label: "Admin"},
    {key: "edit", label: "Edit"},
    {key: "read", label: "Read-only"},
];

// one user of the shared server: the role to change, and the tokens to read and revoke; the server decides who may
const props = defineProps({user: {type: Object, required: true}});
const emit = defineEmits(["role", "remove"]);
const context = useWindow();
const tokens = ref(null);
const failure = ref("");

async function readTokens() {
    context.state["tokens.user"] = String(props.user.id);
    await context.reload("tokens");
    const prop = context.props.tokens;
    failure.value = prop.failure.value;
    tokens.value = prop.failure.value ? null : prop.data.value.tokens;
}

async function toggle() {
    if (tokens.value) return void (tokens.value = null);
    await readTokens();
}

const {refusal, run} = useRunLine(readTokens);
</script>

<template>
    <li class="person" :data-people-user="user.id">
        <span class="person-name">{{ user.name }}</span>
        <template v-if="user.removed_at">
            <span class="person-facts" data-people-removed>Removed</span>
        </template>
        <template v-else>
            <Segmented :options="ROLES" :value="user.role" data-people-role @pick="emit('role', user, $event)" />
            <Btn small data-people-tokens @click="toggle">Tokens</Btn>
            <Btn small variant="danger" data-people-remove @click="emit('remove', user)">Remove user</Btn>
        </template>
        <template v-if="failure || refusal">
            <p class="person-failure" role="alert" data-people-failure>{{ failure || refusal }}</p>
        </template>
        <template v-if="tokens">
            <ul class="person-tokens" data-people-token-list>
                <template v-for="token in tokens" :key="token.id">
                    <li :data-people-token="token.id">
                        <span>{{ token.label || "No label" }}, Last used: {{ token.last_used_at || "never" }}</span>
                        <template v-if="token.revoked_at">
                            <span data-people-revoked>Revoked</span>
                        </template>
                        <template v-else>
                            <Btn small variant="danger" data-people-revoke @click="run(['library-user', 'revoke', String(token.id)])">Revoke</Btn>
                        </template>
                    </li>
                </template>
            </ul>
        </template>
    </li>
</template>

<style scoped>
.person {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    padding: 8px 0;
}

.person-name {
    min-width: 120px;
    font-weight: 600;
}

.person-facts,
.person-tokens {
    color: var(--text-3);
    font-size: 12px;
}

.person-tokens {
    flex-basis: 100%;
    margin: 0;
    padding: 0 0 0 16px;
    list-style: none;
}

.person-tokens li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 2px 0;
}

.person-failure {
    flex-basis: 100%;
    margin: 0;
    color: var(--danger);
    font-size: 13px;
}
</style>
