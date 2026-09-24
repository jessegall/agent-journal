<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import Icon from "../kit/Icon.vue";
import TextInput from "../kit/TextInput.vue";

defineProps({status: {type: Object, required: true}});
const emit = defineEmits(["ready"]);
const email = ref("");
const password = ref("");
const busy = ref(false);
const failure = ref("");

async function logIn() {
    busy.value = true;
    failure.value = "";
    try {
        emit("ready", await api.command("share", "login", {email: email.value, password: password.value}));
        password.value = "";
    } catch (e) {
        failure.value = e.message;
    } finally {
        busy.value = false;
    }
}
</script>

<template>
    <div class="tunnel-problem">
        <Icon name="warn" :size="14" />
        <template v-if="!status.installed">
            <p>
                Sharing needs
                <b>tunler</b>
                , and it isn't installed on this machine.
            </p>
        </template>
        <template v-else>
            <form class="tunnel-login" @submit.prevent="logIn">
                <p>
                    <b>tunler</b>
                    isn't logged in on this machine. Log in once with your tunler account:
                </p>
                <TextInput :value="email" type="email" placeholder="Email" autocomplete="username" @input="email = $event.target.value" />
                <TextInput
                    :value="password"
                    type="password"
                    placeholder="Master password"
                    autocomplete="current-password"
                    @input="password = $event.target.value"
                />
                <template v-if="failure">
                    <p class="tunnel-failure">{{ failure }}</p>
                </template>
                <button type="submit" class="tunnel-login-go" :disabled="busy || !email || !password">
                    {{ busy ? "Logging in…" : "Log in" }}
                </button>
            </form>
        </template>
    </div>
</template>

<style scoped>
.tunnel-problem {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    padding: 10px 12px;
    border: 1px solid color-mix(in srgb, var(--tone-warn) 45%, transparent);
    border-radius: 8px;
    background: color-mix(in srgb, var(--tone-warn) 10%, transparent);
    color: var(--tone-warn);
}

.tunnel-problem .ico {
    flex: none;
    margin-top: 2px;
}

.tunnel-login {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
}

p {
    margin: 0;
    color: var(--text);
    font-size: 12.5px;
    line-height: 1.5;
}

.tunnel-failure {
    color: var(--tone-bad, var(--tone-warn));
}

.tunnel-login-go {
    align-self: flex-end;
    padding: 5px 12px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
}

.tunnel-login-go:disabled {
    opacity: 0.5;
    cursor: default;
}
</style>
