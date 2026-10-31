<script setup>
import {onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import {PROVIDER_CHOICES} from "../domain/agents.js";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import Segmented from "../kit/Segmented.vue";
import Spinner from "../kit/Spinner.vue";
import Switch from "../kit/Switch.vue";
import TextInput from "../kit/TextInput.vue";
import {ago} from "../format/time.js";

const emit = defineEmits(["close"]);
const name = ref("");
const error = ref("");
const busy = ref(false);
const startAgent = ref(false);
const provider = ref(PROVIDER_CHOICES[0].key);
const field = ref(null);
const sessions = ref([]);
const session = ref(null);
let made = null;

onMounted(async () => (sessions.value = await api.pastSessions()));

function pick(row) {
    session.value = row;
    if (row) provider.value = row.provider;
}

watch(field, (input) => input && input.$el.focus());

const FILL_POLL_MS = 400;
const filled = ref(null);

// how far the chat is filled from the chosen session, read every so often while the environment is made
function watchFilling(environment) {
    const timer = setInterval(async () => (filled.value = (await api.filledPercent(environment)).percent), FILL_POLL_MS);
    return () => clearInterval(timer);
}

async function create() {
    if (!name.value.trim() || busy.value) return;
    error.value = "";
    busy.value = true;
    const stopWatching = session.value ? watchFilling(name.value.trim()) : () => {};
    try {
        const from = session.value ? {provider: session.value.provider, session: session.value.session} : {};
        made = made || (await api.create("environments", {name: name.value.trim(), ...from}));
        if (startAgent.value) await api.launchAgent(made.id, provider.value);
        emit("close");
    } catch (e) {
        error.value = e.message;
    } finally {
        stopWatching();
        filled.value = null;
        busy.value = false;
    }
}
</script>

<template>
    <Dialog title="New environment" small @close="emit('close')">
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
            <template v-if="sessions.length">
                <div class="new-env-sessions">
                    <span class="new-env-label">Carry on from</span>
                    <button type="button" :class="['new-env-session', {chosen: !session}]" @click="pick(null)">
                        <b>Nothing: an empty chat</b>
                    </button>
                    <template v-for="row in sessions" :key="row.session">
                        <button type="button" :class="['new-env-session', {chosen: session === row}]" :disabled="!!row.environment" @click="pick(row)">
                            <b>{{ row.first_prompt || "No prompt" }}</b>
                            <span>{{ row.title }} · {{ ago(row.updated_at) }} · {{ row.line_count }} lines<template v-if="row.environment"> · already in {{ row.environment }}</template></span>
                        </button>
                    </template>
                </div>
            </template>
            <div class="new-env-agent">
                <span>Start an agent</span>
                <Switch :on="startAgent" title="Start an agent in it" beside @change="startAgent = $event" />
            </div>
            <template v-if="startAgent">
                <Segmented :options="PROVIDER_CHOICES" :value="provider" @pick="provider = $event" />
            </template>
            <template v-if="error">
                <p class="new-env-error">{{ error }}</p>
            </template>
        </div>
        <template #foot>
            <template v-if="filled !== null">
                <span class="new-env-filling"><Spinner /> Filling the chat from the conversation: {{ filled }}%</span>
            </template>
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

.new-env-filling {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--text-3);
    font-size: 12px;
}

.new-env-sessions {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: min(420px, 100%);
    max-height: 240px;
    overflow-y: auto;
}

.new-env-session {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: transparent;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.new-env-session b {
    overflow: hidden;
    color: var(--text);
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.new-env-session span {
    color: var(--text-3);
    font-size: 11.5px;
}

.new-env-session.chosen {
    border-color: var(--accent);
}

.new-env-session:disabled {
    opacity: 0.5;
    cursor: default;
}

.new-env-error {
    margin: 0;
    max-width: 320px;
    color: var(--danger);
    font-size: 12px;
    text-align: center;
}
</style>
