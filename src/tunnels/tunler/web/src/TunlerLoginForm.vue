<script setup>
import {ref} from "vue";
import {Btn, useWindow} from "@journal/window-kit";

const props = defineProps({host: {type: String, default: ""}});
const emit = defineEmits(["ready"]);
const context = useWindow();
const server = ref(props.host);
const username = ref("");
const password = ref("");
const master = ref("");
const asking = ref(false);
const busy = ref(false);
const failure = ref("");

async function connect() {
    busy.value = true;
    const flags = master.value ? ["--master", master.value] : [];
    const result = await context.run(["tunler", "login", server.value.trim(), username.value.trim(), password.value, ...flags]);
    busy.value = false;
    failure.value = result.ok ? "" : result.error;
    if (!result.ok) return;
    if (result.value.connected) {
        password.value = "";
        master.value = "";
        emit("ready");
        return;
    }
    asking.value = result.value.needs_master;
    failure.value = result.value.error;
}
</script>

<template>
    <form class="login" data-tunler-login @submit.prevent="connect">
        <label for="tunler-server">Tunler server address</label>
        <input id="tunler-server" v-model="server" placeholder="tunler.example.com" autocomplete="off">
        <label for="tunler-username">Username</label>
        <input id="tunler-username" v-model="username" autocomplete="username">
        <label for="tunler-password">Password</label>
        <input id="tunler-password" v-model="password" type="password" autocomplete="current-password">
        <p class="fine">At least 8 characters.</p>
        <label for="tunler-master">Master password</label>
        <input id="tunler-master" v-model="master" type="password" autocomplete="off" data-tunler-master>
        <p class="fine">Only to create a new account.</p>
        <template v-if="failure">
            <p class="failure" role="alert" data-tunler-login-failure>{{ failure }}</p>
        </template>
        <div class="actions">
            <Btn small variant="primary" type="submit" :busy="busy" data-tunler-connect>{{ asking ? "Create the account" : "Connect" }}</Btn>
        </div>
        <p class="fine">A forgotten password can't be recovered: make a new account. Accounts unused for 30 days are deleted with their domains.</p>
    </form>
</template>

<style scoped>
.login {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

label {
    color: var(--text-3);
    font-size: 12px;
}

input {
    padding: 4px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    color: inherit;
    font-size: 13px;
}

.fine {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.failure {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}

.actions {
    display: flex;
    gap: 8px;
}
</style>
