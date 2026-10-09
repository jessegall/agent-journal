<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {saveSettings} from "../actions/settings.js";
import {useIntegrationState} from "../composables/integrationState.js";
import {fetchingOn, keyOf, keyWords, settingsWith, switchWords} from "../domain/integrations.js";
import {showSession} from "../route.js";
import Btn from "../kit/Btn.vue";
import SecretPicker from "../kit/SecretPicker.vue";
import Switch from "../kit/Switch.vue";
import {store} from "../state/store.js";
import GmailChoices from "./GmailChoices.vue";
import LinearChoices from "./LinearChoices.vue";
import SwitchCase from "../kit/SwitchCase.vue";

const props = defineProps({feature: {type: Object, required: true}});
const {state} = useIntegrationState(props.feature);
const key = computed(() => keyOf(store.settings, props.feature.name));
const words = computed(() => keyWords(props.feature.title));
const switches = computed(() => switchWords(props.feature.title));
const fetching = computed(() => fetchingOn(store.settings, props.feature.name));
const setFetching = (next) => saveSettings(settingsWith(store.settings, props.feature.name, {fetching: next}));
const pick = (variable) => saveSettings(settingsWith(store.settings, props.feature.name, {key: variable}));
const checking = ref(false);

async function checkNow() {
    checking.value = true;
    try {
        state.value = await api.checkIntegration(props.feature.name);
    } finally {
        checking.value = false;
    }
}
</script>

<template>
    <section class="settings" :data-settings="feature.name">
        <header class="bar">
            <Btn small @click="showSession('')">Integrations</Btn>
            <h2 class="title">{{ feature.title }} settings</h2>
        </header>
        <div class="use">
            <span>{{ switches.fetching }}</span>
            <Switch :on="fetching" :title="switches.fetching" @change="setFetching" />
        </div>
        <p class="note">{{ switches.fetchingHelp }}</p>
        <template v-if="fetching">
            <h4 class="label">{{ words.label }}</h4>
            <SecretPicker data-picker="key" :value="key" :picked-line="words.picked" :none-line="words.none" :note="words.note" @pick="pick" />
            <SwitchCase :value="feature.name">
                <template #gmail>
                    <GmailChoices />
                </template>
                <template #linear>
                    <LinearChoices :states="state ? state.choices : []" />
                </template>
            </SwitchCase>
            <template v-if="key">
                <div class="acts">
                    <Btn small :busy="checking" @click="checkNow">Check now</Btn>
                </div>
            </template>
        </template>
    </section>
</template>

<style scoped>
.settings {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 18px 20px;
}

.bar {
    display: flex;
    align-items: center;
    gap: 12px;
}

.title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}

.use {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.note {
    margin: 0;
    color: var(--text-2);
}

.label {
    margin: 4px 0 0;
    font-size: 12px;
    font-weight: 600;
}

.acts {
    display: flex;
}
</style>
