<script setup>
import {computed, onMounted, ref} from "vue";
import Btn from "../kit/Btn.vue";
import ListBox from "../kit/ListBox.vue";
import TextInput from "../kit/TextInput.vue";
import {connectToServer, connection, disconnectFromServer, loadConnection} from "../composables/connection.js";
import {stepWords, travelsLine} from "../domain/connection.js";

const address = ref("");
const changing = ref(false);
const busy = ref(false);
const failure = ref("");

const joined = computed(() => Boolean(connection.value && connection.value.connected) && !changing.value);

async function connect() {
    busy.value = true;
    failure.value = "";
    try {
        await connectToServer(address.value);
        changing.value = false;
        address.value = "";
    } catch (e) {
        failure.value = e.message;
    } finally {
        busy.value = false;
    }
}

async function leave() {
    busy.value = true;
    failure.value = "";
    try {
        await disconnectFromServer();
    } catch (e) {
        failure.value = e.message;
    } finally {
        busy.value = false;
    }
}

onMounted(loadConnection);
</script>

<template>
    <template v-if="connection">
        <ListBox title="Connection to a server">
            <div class="connection-state">
                <template v-if="joined">
                    <p class="connection-line">
                        Connected to
                        <b>{{ connection.address }}</b>
                        .
                        {{ stepWords(connection.step) }}
                    </p>
                    <div class="connection-actions">
                        <Btn small @click="changing = true">Change server</Btn>
                        <Btn small :busy="busy" @click="leave">Disconnect</Btn>
                    </div>
                </template>
                <template v-else>
                    <p class="connection-line">Not connected. Give the address of your journal on a server, and this one will share its environments with it.</p>
                    <TextInput :value="address" aria-label="Server address" placeholder="https://journal.example.com" @input="address = $event.target.value" @keydown.enter="connect" />
                    <p class="connection-line connection-travels">{{ travelsLine(connection.travels) }}</p>
                    <div class="connection-actions">
                        <Btn small :busy="busy" :disabled="!address.trim()" @click="connect">Connect</Btn>
                        <template v-if="changing">
                            <Btn small @click="changing = false">Keep the current server</Btn>
                        </template>
                    </div>
                </template>
                <template v-if="failure">
                    <p class="connection-failure">{{ failure }}</p>
                </template>
            </div>
        </ListBox>
    </template>
</template>

<style scoped>
.connection-state {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 14px;
}

.connection-line {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: var(--text);
}

.connection-travels {
    color: var(--text-2);
}

.connection-actions {
    display: flex;
    gap: 8px;
}

.connection-failure {
    margin: 0;
    font-size: 13px;
    color: var(--danger);
}
</style>
