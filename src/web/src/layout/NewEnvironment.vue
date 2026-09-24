<script setup>
import {ref, watch} from "vue";
import {api} from "../api/client.js";
import {PROVIDER_CHOICES} from "../agents.js";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import Segmented from "../kit/Segmented.vue";
import Switch from "../kit/Switch.vue";
import TextInput from "../kit/TextInput.vue";

const emit = defineEmits(["close"]);
const name = ref("");
const error = ref("");
const busy = ref(false);
const startAgent = ref(false);
const provider = ref(PROVIDER_CHOICES[0].key);
const field = ref(null);
let made = null;

watch(field, (input) => input && input.$el.focus());

async function create() {
    if (!name.value.trim() || busy.value) return;
    error.value = "";
    busy.value = true;
    try {
        made = made || (await api.create("environment", {title: name.value.trim()}));
        if (startAgent.value) await api.launchAgent(made.n, provider.value);
        emit("close");
    } catch (e) {
        error.value = e.message;
    } finally {
        busy.value = false;
    }
}
</script>

<template>
    <Dialog title="New environment" fixed small @close="emit('close')">
        <div class="new-env">
            <label class="new-env-label" for="new-env-name">A short name</label>
            <TextInput
                id="new-env-name"
                ref="field"
                class="new-env-name"
                :value="name"
                :disabled="!!made"
                placeholder="for example billing-fix"
                @input="name = $event.target.value"
                @keydown.enter="create"
            />
            <div class="new-env-agent">
                <span>Start an agent</span>
                <Switch :on="startAgent" title="Start an agent in it" @change="startAgent = $event" />
            </div>
            <template v-if="startAgent">
                <Segmented :options="PROVIDER_CHOICES" :value="provider" @pick="provider = $event" />
            </template>
            <template v-if="error">
                <p class="new-env-error">{{ error }}</p>
            </template>
        </div>
        <template #foot>
            <span class="new-env-space" />
            <Btn small @click="emit('close')">Cancel</Btn>
            <Btn kind="primary" small :busy="busy" :disabled="!name.trim()" @click="create">Create</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.new-env {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.new-env-space {
    flex: 1;
}

.new-env-label {
    color: var(--text-3);
    font-size: 12px;
}

.new-env-name {
    width: min(320px, 100%);
    text-align: center;
}

.new-env-agent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: min(320px, 100%);
    color: var(--text-2);
    font-size: 12.5px;
}

.new-env-error {
    margin: 0;
    max-width: 320px;
    color: var(--danger);
    font-size: 12px;
    text-align: center;
}
</style>
