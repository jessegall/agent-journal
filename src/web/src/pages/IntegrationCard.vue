<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {saveSettings} from "../actions/settings.js";
import {useIntegrationState} from "../composables/integrationState.js";
import {loggedIn, loginLine, loginWords, mcpOn, refusedKey, settingsWith, stateWords, switchWords} from "../domain/integrations.js";
import {showSession} from "../route.js";
import Btn from "../kit/Btn.vue";
import Console from "../kit/Console.vue";
import Switch from "../kit/Switch.vue";
import {store} from "../state/store.js";

const props = defineProps({feature: {type: Object, required: true}});
const {on, state} = useIntegrationState(props.feature);
const line = computed(() => stateWords(props.feature.title, on.value, state.value, refusedKey(props.feature, state.value)));
const detail = computed(() => (on.value ? state.value?.last_error || "" : ""));
const detailShown = ref(false);
const switches = computed(() => switchWords(props.feature.title));
const mcp = computed(() => mcpOn(store.settings, props.feature.name));
const setMcp = (next) => saveSettings(settingsWith(store.settings, props.feature.name, {use_mcp: next}));
const login = computed(() => loginWords(props.feature.title));
const loginState = computed(() => loginLine(props.feature.title, state.value));
const signing = ref(false);

async function logIn() {
    signing.value = true;
    try {
        await api.logInIntegration(props.feature.name);
    } finally {
        setTimeout(() => (signing.value = false), 5000);
    }
}

const loggingOut = ref(false);

async function logOut() {
    loggingOut.value = true;
    try {
        await api.logOutIntegration(props.feature.name);
        state.value = await api.integration(props.feature.name);
    } finally {
        loggingOut.value = false;
    }
}

const switchTo = (next) => saveSettings({features: {[props.feature.name]: next}});
</script>

<template>
    <article :class="['integration', {off: !on}]" :data-integration="feature.name">
        <header class="head">
            <span class="title">{{ feature.title }}</span>
        </header>
        <p class="abstract">{{ feature.abstract }}</p>
        <div class="use">
            <span>{{ feature.label }}</span>
            <Switch :on="on" :title="feature.label" @change="switchTo" />
        </div>
        <template v-if="on">
            <template v-if="feature.mcp_server">
                <div class="use">
                    <span>{{ login.label }}</span>
                    <template v-if="loggedIn(state)">
                        <Btn small :busy="loggingOut" @click="logOut">{{ login.out }}</Btn>
                    </template>
                    <template v-else>
                        <Btn small :busy="signing" @click="logIn">{{ login.button }}</Btn>
                    </template>
                </div>
                <p class="abstract" data-login>{{ signing ? login.waiting : loginState }}</p>
                <div class="use">
                    <span>{{ switches.mcp }}</span>
                    <Switch :on="mcp" :title="switches.mcp" @change="setMcp" />
                </div>
            </template>
            <p class="state" data-state>{{ line }}</p>
            <template v-if="detail">
                <div class="acts">
                    <Btn small @click="detailShown = !detailShown">{{ detailShown ? "Hide" : "Show" }}</Btn>
                </div>
                <template v-if="detailShown">
                    <Console><pre class="detail">{{ detail }}</pre></Console>
                </template>
            </template>
            <div class="acts">
                <Btn small @click="showSession(feature.name)">Settings</Btn>
            </div>
        </template>
        <template v-else>
            <p class="state" data-state>{{ line }}</p>
        </template>
    </article>
</template>

<style scoped>
.integration {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
}

.integration.off .abstract,
.integration.off .state {
    color: var(--text-3);
}

.head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.title {
    font-weight: 600;
}

.detail {
    margin: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.abstract,
.state {
    margin: 0;
    color: var(--text-2);
}

.acts {
    display: flex;
}

.use {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}
</style>
