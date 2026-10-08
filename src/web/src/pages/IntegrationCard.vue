<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {saveSettings} from "../actions/settings.js";
import {usePoll, pollKey} from "../composables/poll.js";
import {isOn, keyOf, keyWords, settingsWith, stateWords} from "../domain/integrations.js";
import Btn from "../kit/Btn.vue";
import SecretPicker from "../kit/SecretPicker.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import Switch from "../kit/Switch.vue";
import {store} from "../state/store.js";
import LinearChoices from "./LinearChoices.vue";

const props = defineProps({feature: {type: Object, required: true}});
const EVERY = 15000;
const on = computed(() => isOn(store.settings, props.feature.name));
const key = computed(() => keyOf(store.settings, props.feature.name));
const words = computed(() => keyWords(props.feature.title));
const state = ref(null);
const line = computed(() => stateWords(props.feature.title, on.value, state.value));

usePoll(
    pollKey(),
    () => (on.value ? api.integration(props.feature.name) : Promise.resolve(null)),
    EVERY,
    (got) => (state.value = got),
    () => on.value
);

const checking = ref(false);

async function checkNow() {
    checking.value = true;
    try {
        state.value = await api.checkIntegration(props.feature.name);
    } finally {
        checking.value = false;
    }
}

const switchTo = (next) => saveSettings({features: {[props.feature.name]: next}});
const pick = (variable) => saveSettings(settingsWith(store.settings, props.feature.name, {key: variable}));
</script>

<template>
    <article :class="['integration', {off: !on}]" :data-integration="feature.name">
        <header class="head">
            <span class="title">{{ feature.title }}</span>
        </header>
        <p class="abstract">{{ feature.abstract }}</p>
        <div class="use">
            <span>{{ feature.label }}</span>
            <Switch :on="on" :title="on ? 'Turn it off' : 'Turn it on'" @change="switchTo" />
        </div>
        <h4 class="key-label">{{ words.label }}</h4>
        <SecretPicker :value="key" :picked-line="words.picked" :none-line="words.none" :note="words.note" @pick="pick" />
        <template v-if="on">
            <SwitchCase :value="feature.name">
                <template #linear>
                    <LinearChoices :states="state ? state.choices : []" />
                </template>
            </SwitchCase>
        </template>
        <p class="state" data-state>{{ line }}</p>
        <template v-if="on && key">
            <div class="acts">
                <Btn small :busy="checking" @click="checkNow">Check now</Btn>
            </div>
        </template>
    </article>
</template>

<style scoped>
.integration {
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
}

.key-label {
    margin: 4px 0 0;
    font-size: 12px;
    font-weight: 600;
}
</style>
