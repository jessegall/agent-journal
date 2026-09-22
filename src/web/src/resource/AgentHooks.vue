<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";

const props = defineProps({provider: String});
const path = ref("");
const hooks = ref({});
const elsewhere = ref([]);
const saved = ref("{}");
const error = ref("");
const saving = ref(false);
const events = computed(() => Object.keys(hooks.value).sort());
const changed = computed(() => JSON.stringify(hooks.value) !== saved.value);

function showHooks(got) {
    hooks.value = JSON.parse(JSON.stringify(got));
    saved.value = JSON.stringify(got);
}

async function fetchHooks() {
    try {
        const got = await api.agentHooks(props.provider);
        path.value = got.path;
        elsewhere.value = got.elsewhere || [];
        showHooks(got.hooks);
        error.value = "";
    } catch (reason) {
        error.value = reason.message;
    }
}

async function save() {
    saving.value = true;
    try {
        showHooks((await api.saveAgentHooks(props.provider, hooks.value)).hooks);
        error.value = "";
    } catch (reason) {
        error.value = reason.message;
    } finally {
        saving.value = false;
    }
}

function remove(event, block, line) {
    const blocks = hooks.value[event];
    blocks[block].hooks.splice(line, 1);
    if (!blocks[block].hooks.length) blocks.splice(block, 1);
}

function add(event) {
    hooks.value[event].push({hooks: [{type: "command", command: ""}]});
}

onMounted(fetchHooks);
</script>

<template>
    <div class="agent-hooks">
        <p class="where">
            Read from and saved to
            <code>{{ path }}</code>
        </p>
        <template v-if="error">
            <p class="read-error">{{ error }}</p>
        </template>
        <template v-for="event in events" :key="event">
            <section class="event">
                <h4>
                    {{ event }}
                    <button type="button" class="add" @click="add(event)">add</button>
                </h4>
                <template v-for="(block, b) in hooks[event]" :key="b">
                    <template v-for="(hook, h) in block.hooks" :key="`${b}-${h}`">
                        <div class="hook">
                            <template v-if="block.matcher">
                                <span class="matcher">{{ block.matcher }}</span>
                            </template>
                            <input v-model="hook.command" class="command" spellcheck="false" :placeholder="'command'" />
                            <Btn kind="icon" title="Remove this hook" @click="remove(event, b, h)"><Icon name="x" /></Btn>
                        </div>
                    </template>
                </template>
            </section>
        </template>
        <template v-if="!events.length && !error">
            <p class="none">No hooks are set for this agent.</p>
        </template>
        <div class="actions">
            <Btn kind="primary" small :disabled="!changed || saving" @click="save">Save</Btn>
            <Btn small :disabled="!changed || saving" @click="fetchHooks">Discard</Btn>
        </div>
        <template v-for="file in elsewhere" :key="file.path">
            <section class="elsewhere">
                <p class="where">
                    Also registered, read only, in
                    <code>{{ file.path }}</code>
                </p>
                <template v-for="(blocks, event) in file.hooks" :key="event">
                    <h4>{{ event }}</h4>
                    <template v-for="(block, b) in blocks" :key="b">
                        <template v-for="(hook, h) in block.hooks" :key="`${b}-${h}`">
                            <div class="hook">
                                <template v-if="block.matcher">
                                    <span class="matcher">{{ block.matcher }}</span>
                                </template>
                                <code class="command fixed">{{ hook.command }}</code>
                            </div>
                        </template>
                    </template>
                </template>
            </section>
        </template>
    </div>
</template>

<style scoped>
.agent-hooks {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.where {
    margin: 0;
    font-size: 12px;
    color: var(--text-3);
}

.where code {
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    color: var(--text-2);
}

.event h4,
.elsewhere h4 {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin: 0 0 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-2);
}

.add {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 11px;
    font-weight: 400;
    cursor: pointer;
}

.hook {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
}

.matcher {
    flex: none;
    padding: 1px 6px;
    border-radius: 99px;
    background: var(--raised);
    font-size: 11px;
    color: var(--text-3);
}

.command {
    flex: 1;
    min-width: 0;
    padding: 5px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
}

.command.fixed {
    border-color: transparent;
    background: var(--raised);
    color: var(--text-2);
    white-space: pre-wrap;
    word-break: break-all;
}

.command:focus {
    outline: none;
    border-color: var(--accent);
}

.none {
    margin: 0;
    color: var(--text-3);
}

.read-error {
    margin: 0;
    color: var(--blocking);
}

.actions {
    display: flex;
    gap: 8px;
}
</style>
