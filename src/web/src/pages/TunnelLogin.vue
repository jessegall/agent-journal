<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import FormField from "../kit/FormField.vue";
import TextInput from "../kit/TextInput.vue";

const props = defineProps({host: {type: String, default: ""}});
const emit = defineEmits(["ready"]);
const endpoint = ref(props.host || "tunler.jessegall.nl");
const username = ref("");
const password = ref("");
const master = ref("");
const asking = ref(false);
const busy = ref(false);
const failure = ref("");
const note = ref("");

async function connect() {
    busy.value = true;
    failure.value = "";
    try {
        const got = await api.tunnelLogin({
            endpoint: endpoint.value.trim(),
            username: username.value.trim(),
            password: password.value,
            master_password: master.value || undefined,
        });
        if (got.connected) {
            master.value = "";
            password.value = "";
            emit("ready", got);
            return;
        }
        if (got.needs_master) {
            asking.value = true;
            note.value = `No account "${username.value.trim()}" on ${endpoint.value.trim()} yet. Enter the server's master password to create it.`;
            return;
        }
        failure.value = got.error;
    } catch (e) {
        failure.value = e.message;
    } finally {
        busy.value = false;
    }
}
</script>

<template>
    <form class="tunnel-login" @submit.prevent="connect">
        <FormField label="Server">
            <TextInput :value="endpoint" placeholder="tunler.jessegall.nl" @input="endpoint = $event.target.value" />
        </FormField>
        <FormField label="Username">
            <TextInput :value="username" autocomplete="username" @input="username = $event.target.value" />
        </FormField>
        <FormField label="Password" hint="at least 8 characters">
            <TextInput :value="password" type="password" autocomplete="current-password" @input="password = $event.target.value" />
        </FormField>
        <template v-if="asking">
            <p class="tunnel-note">{{ note }}</p>
        </template>
        <FormField label="Master password" :hint="asking ? '' : 'only to create a new account'">
            <TextInput :value="master" type="password" autocomplete="off" @input="master = $event.target.value" />
        </FormField>
        <template v-if="failure">
            <p class="tunnel-failure">{{ failure }}</p>
        </template>
        <Btn kind="primary" :busy="busy" @click="connect">{{ asking ? "Create the account" : "Connect" }}</Btn>
        <p class="tunnel-fine">
            A forgotten password can't be recovered: make a new account. Accounts unused for 30 days are deleted with their domains.
        </p>
    </form>
</template>

<style scoped>
.tunnel-login {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
}

.tunnel-login .btn {
    align-self: flex-start;
}

.tunnel-note,
.tunnel-fine,
.tunnel-failure {
    margin: 0;
    line-height: 1.45;
}

.tunnel-note {
    color: var(--text-2);
}

.tunnel-fine {
    color: var(--text-3);
    font-size: 12px;
}

.tunnel-failure {
    color: var(--danger);
}
</style>
