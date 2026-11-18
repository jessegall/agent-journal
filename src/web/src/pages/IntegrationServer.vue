<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import StateDot from "../kit/StateDot.vue";
import TextInput from "../kit/TextInput.vue";
import IntegrationPending from "./IntegrationPending.vue";
import {signsIn, SIGN_IN_WORDS} from "../domain/mcpSignIn.js";

const props = defineProps({
    server: {type: Object, required: true},
    busy: Boolean,
    signInPage: {type: String, default: ""},
    keyValue: {type: String, default: ""},
    returnAddress: {type: String, default: ""},
});
defineEmits(["remove", "update:keyValue", "saveKey", "signIn", "update:returnAddress", "finishSignIn"]);

const DOTS = {connected: "done", failed: "failed", needs_key: "queued", needs_auth: "queued", installed: "draft"};
const WORDS = {
    connected: "Connected",
    failed: "Could not connect",
    needs_key: "Needs its key",
    needs_auth: "Needs signing in",
    installed: "Installed, not checked yet",
};

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
        <template v-if="server.auth === 'key'">
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
        <template v-else-if="signsIn(server) && signInPage">
            <div class="integration-sign-in">
                <IntegrationPending class="integration-note">
                    <a :href="signInPage" target="_blank" rel="noopener noreferrer">{{ SIGN_IN_WORDS.open }}</a>. {{ SIGN_IN_WORDS.approve }}
                </IntegrationPending>
                <span class="integration-note">{{ SIGN_IN_WORDS.paste }}</span>
                <div class="integration-key">
                    <TextInput
                        :value="returnAddress"
                        :placeholder="SIGN_IN_WORDS.placeholder"
                        @input="$emit('update:returnAddress', $event.target.value)"
                        @keydown.enter="returnAddress.trim() && $emit('finishSignIn')"
                    />
                    <Btn kind="primary" small :busy="busy" :disabled="!returnAddress.trim()" @click="$emit('finishSignIn')">
                        {{ SIGN_IN_WORDS.finish }}
                    </Btn>
                    <Btn kind="ghost" small :disabled="busy" @click="$emit('signIn')">{{ SIGN_IN_WORDS.again }}</Btn>
                </div>
            </div>
        </template>
        <template v-else-if="signsIn(server)">
            <div class="integration-key">
                <span class="integration-note">{{ SIGN_IN_WORDS.offer }}</span>
                <Btn kind="primary" small :busy="busy" @click="$emit('signIn')">{{ SIGN_IN_WORDS.button }}</Btn>
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

.integration-sign-in {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.integration-key > :first-child {
    flex: 1;
}

.integration-note {
    font-size: 12px;
    color: var(--text-dim, #9aa0a6);
}
</style>
