<script setup>
import {ref} from "vue";
import SwitchCase from "../kit/SwitchCase.vue";
import SecretList from "./SecretList.vue";
import SecretNew from "./SecretNew.vue";
import SecretOpen from "./SecretOpen.vue";

const screen = ref("list");
const opened = ref(0);

function show(next, n = 0) {
    screen.value = next;
    opened.value = n;
}
</script>

<template>
    <SwitchCase :value="screen">
        <template #list>
            <SecretList @open="show('one', $event)" @new="show('new')" />
        </template>
        <template #new>
            <SecretNew @open="show('one', $event)" @back="show('list')" />
        </template>
        <template #one>
            <SecretOpen :n="opened" @back="show('list')" />
        </template>
    </SwitchCase>
</template>

<style>
.secrets {
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-width: 760px;
}

.secrets-back {
    align-self: flex-start;
}

.secrets-title {
    margin: 0;
}

.secrets-reason {
    display: block;
    color: var(--text-2);
}

.secrets-bar {
    display: flex;
    gap: 8px;
}

.secrets-kinds {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 10px;
}

.secret-row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px 14px;
    border: 0;
    border-top: 1px solid var(--border-3);
    background: none;
    color: inherit;
    text-align: left;
    font: inherit;
}

button.secret-row {
    cursor: pointer;
}

.secret-row-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    color: var(--text-2);
}

.secret-row-text b {
    color: var(--text);
}

.secrets-file,
.secrets-delete {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 14px;
    border: 1px solid var(--border-3);
    border-radius: 8px;
}

.secrets-file p,
.secrets-delete p {
    margin: 0;
    color: var(--text-2);
}

.secrets-path {
    display: flex;
    align-items: center;
    gap: 8px;
}

.secrets-path code {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
}

.secrets-delete {
    border-color: var(--tone-danger);
}

.secrets-values {
    display: flex;
    flex-direction: column;
}

.secret-failure {
    margin: 0;
    color: var(--tone-danger);
}
</style>
