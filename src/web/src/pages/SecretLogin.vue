<script setup>
import Btn from "../kit/Btn.vue";

defineProps({login: {type: Object, required: true}, busy: {type: Boolean, default: false}});
const emit = defineEmits(["log-in", "let-log-in", "forget", "ask-each-time"]);
</script>

<template>
    <template v-if="login.kind === 'browser login'">
        <div class="secrets-delete">
            <b>Log in to {{ login.url }}</b>
            <p>
                A browser opens on the computer the journal runs on. Log in, then close its window: the login is saved beside the values and
                the agent's browser starts with it.
                <template v-if="login.login_started_at">The window is open now.</template>
                <template v-else-if="login.session_at">Logged in.</template>
            </p>
            <p>The agent's browser can read this login's cookies, and a page it opens can act on the site as you.</p>
            <Btn small :busy="busy" :disabled="Boolean(login.login_started_at)" @click="emit('log-in')">Log in</Btn>
            <template v-if="!login.auto_login">
                <Btn small :busy="busy" :disabled="Boolean(login.login_started_at)" @click="emit('let-log-in')">
                    Let the agent log in on its own
                </Btn>
            </template>
            <template v-if="login.session_at">
                <Btn kind="danger" small :busy="busy" @click="emit('forget')">Forget this login</Btn>
            </template>
        </div>
    </template>
    <template v-if="login.auto_login">
        <div class="secrets-delete">
            <b>The agent logs in to this site on its own</b>
            <p>You let the agent log in to this site without asking you. Take that back, and the agent asks with a Log in button again.</p>
            <Btn small :busy="busy" @click="emit('ask-each-time')">Make the agent ask each time</Btn>
        </div>
    </template>
</template>
