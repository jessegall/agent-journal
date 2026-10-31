<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import StateDot from "../kit/StateDot.vue";
import TextInput from "../kit/TextInput.vue";
import IntegrationPending from "./IntegrationPending.vue";

const props = defineProps({
    server: {type: Object, required: true},
    busy: Boolean,
    signingIn: Boolean,
    agentOnline: Boolean,
    keyValue: {type: String, default: ""},
});
defineEmits(["remove", "update:keyValue", "saveKey", "signIn"]);

const DOTS = {connected: "done", failed: "failed", needs_key: "queued", needs_auth: "queued", installed: "draft"};
const WORDS = {
    connected: "Connected",
    failed: "Could not connect",
    needs_key: "Needs its key",
    needs_auth: "Needs signing in",
    installed: "Installed, not checked yet",
};

const askedFor = computed(() => (props.server.managed ? props.server.auth : "none"));
const keyHint = computed(() =>
    props.server.has_key ? `${props.server.key_var} is set; paste a new one to replace it` : `Paste the ${props.server.key_var}`,
);
</script>

<template>
    <li class="integration">
        <div class="integration-row">
            <StateDot :state="DOTS[server.state] || 'draft'" />
            <strong>{{ server.title }}</strong>
            <span class="integration-state">{{ WORDS[server.state] || server.state }}</span>
            <span class="integration-grow" />
            <Btn kind="ghost" small :busy="busy" @click="$emit('remove')">Remove</Btn>
        </div>
        <template v-if="server.last_error">
            <p class="integration-error">{{ server.last_error }}</p>
        </template>
        <code class="integration-how">{{ server.url || server.command }}</code>
        <template v-if="askedFor === 'key'">
            <div class="integration-key">
                <TextInput
                    :value="keyValue"
                    type="password"
                    :placeholder="keyHint"
                    @input="$emit('update:keyValue', $event.target.value)"
                    @keydown.enter="$emit('saveKey')"
                />
                <Btn kind="primary" small :busy="busy" :disabled="!keyValue.trim()" @click="$emit('saveKey')">
                    {{ server.has_key ? "Replace key" : "Save key" }}
                </Btn>
            </div>
        </template>
        <template v-else-if="askedFor === 'oauth' && signingIn">
            <div class="integration-key">
                <IntegrationPending class="integration-note">Signing in: approve it in the browser window the agent opened.</IntegrationPending>
            </div>
        </template>
        <template v-else-if="askedFor === 'oauth'">
            <div class="integration-key">
                <span class="integration-note">Asks the agent to sign in; a browser window opens from its terminal.</span>
                <Btn kind="primary" small :busy="busy" :disabled="!agentOnline" @click="$emit('signIn')">Sign in</Btn>
            </div>
        </template>
    </li>
</template>

<style scoped>
.integration {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 16px;
    border: 1px solid var(--line, #2a2d33);
    border-radius: 10px;
    background: var(--panel, #16181c);
}

.integration-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.integration-grow {
    flex: 1;
}

.integration-state {
    color: var(--text-dim, #9aa0a6);
    font-size: 13px;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.integration-error {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
    overflow-wrap: anywhere;
}

.integration-how {
    font-size: 12px;
    color: var(--text-dim, #9aa0a6);
    overflow-wrap: anywhere;
}

.integration-key {
    display: flex;
    align-items: center;
    gap: 10px;
}

.integration-key > :first-child {
    flex: 1;
}

.integration-note {
    font-size: 12px;
    color: var(--text-dim, #9aa0a6);
}
</style>
