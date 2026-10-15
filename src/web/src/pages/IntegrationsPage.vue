<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {agent, agentOnline} from "../composables/leadAgent.js";
import Btn from "../kit/Btn.vue";
import StateDot from "../kit/StateDot.vue";
import TextInput from "../kit/TextInput.vue";
import SkeletonLine from "../kit/SkeletonLine.vue";

const servers = ref([]);
const suggested = ref([]);
const loaded = ref(false);
const busy = ref("");
const notice = ref("");
const keys = ref({});

const offered = computed(() => suggested.value.filter((s) => !s.installed));
const DOTS = {connected: "done", failed: "failed", needs_key: "queued", needs_auth: "queued", installed: "draft"};
const WORDS = {
    connected: "Connected",
    failed: "Could not connect",
    needs_key: "Needs its key",
    needs_auth: "Needs signing in",
    installed: "Installed, not checked yet",
};

async function reload() {
    const got = await api.mcp();
    servers.value = got.servers;
    suggested.value = got.suggested;
    loaded.value = true;
}
onMounted(reload);

async function act(name, work) {
    busy.value = name;
    notice.value = "";
    try {
        await work();
        await reload();
    } catch (e) {
        notice.value = e.message;
    } finally {
        busy.value = "";
    }
}
const install = (s) => act(s.name, () => api.mcpInstall(s.name));
const remove = (s) => act(s.name, () => api.mcpRemove(s.name));
const check = () => act("check", () => api.mcpCheck());
const saveKey = (s) =>
    act(s.name, async () => {
        await api.mcpKey(s.name, keys.value[s.name] || "");
        keys.value[s.name] = "";
    });
const signIn = (s) => act(s.name, () => api.runShell(agent.value.title, "/mcp"));
</script>

<template>
    <section class="integrations">
        <header class="integrations-head">
            <div>
                <h1>Integrations</h1>
                <p class="integrations-lead">
                    An integration is an MCP server the agents are given. Installing one restarts the running agents, so it
                    applies at once. A key is kept outside the project and never written into it.
                </p>
            </div>
            <Btn kind="ghost" :busy="busy === 'check'" :disabled="!servers.length" @click="check">Check all</Btn>
        </header>

        <p v-if="notice" class="integrations-notice">{{ notice }}</p>

        <ul v-if="!loaded" class="integrations-list" aria-label="Loading the integrations">
            <li v-for="n in 3" :key="n" class="integration">
                <SkeletonLine :bars="[{width: 28}, {width: 46}]" />
                <SkeletonLine :bars="[{width: 70}]" />
            </li>
        </ul>
        <p v-else-if="!servers.length" class="integrations-none">No integration yet. Install one of the suggestions below.</p>

        <ul v-else class="integrations-list">
            <li v-for="s in servers" :key="s.name" class="integration">
                <div class="integration-row">
                    <StateDot :state="DOTS[s.state] || 'draft'" />
                    <strong>{{ s.title }}</strong>
                    <span class="integration-state">{{ WORDS[s.state] || s.state }}<template v-if="s.last_error">: {{ s.last_error }}</template></span>
                    <span class="integration-grow" />
                    <span v-if="!s.managed" class="integration-note">Set up in Claude Code itself</span>
                    <Btn v-else kind="ghost" small :busy="busy === s.name" @click="remove(s)">Remove</Btn>
                </div>
                <code class="integration-how">{{ s.url || s.command }}</code>
                <div v-if="s.managed && s.auth === 'key'" class="integration-key">
                    <TextInput
                        v-model="keys[s.name]"
                        type="password"
                        :placeholder="s.has_key ? `${s.key_var} is set; paste a new one to replace it` : `Paste the ${s.key_var}`"
                        @keydown.enter="saveKey(s)"
                    />
                    <Btn kind="primary" small :busy="busy === s.name" :disabled="!(keys[s.name] || '').trim()" @click="saveKey(s)">
                        {{ s.has_key ? "Replace key" : "Save key" }}
                    </Btn>
                </div>
                <div v-else-if="s.managed && s.auth === 'oauth'" class="integration-key">
                    <span class="integration-note">Signs in from the agent's terminal: a browser window opens there.</span>
                    <Btn kind="primary" small :busy="busy === s.name" :disabled="!agentOnline" @click="signIn(s)">Sign in</Btn>
                </div>
            </li>
        </ul>

        <h2 class="integrations-sub">Suggested</h2>
        <ul v-if="!loaded" class="integrations-grid" aria-label="Loading the suggestions">
            <li v-for="n in 4" :key="n" class="suggestion">
                <SkeletonLine :bars="[{width: 40}]" />
                <SkeletonLine :bars="[{width: 80}]" />
                <SkeletonLine :bars="[{width: 50}]" />
            </li>
        </ul>
        <p v-else-if="!offered.length" class="integrations-none">Every suggested server is installed.</p>
        <ul v-else class="integrations-grid">
            <li v-for="s in offered" :key="s.name" class="suggestion">
                <strong>{{ s.title }}</strong>
                <p>{{ s.about }}</p>
                <span class="integration-note">
                    <template v-if="s.auth === 'key'">Needs a key ({{ s.key_var }}).</template>
                    <template v-else-if="s.auth === 'oauth'">Signs in on its own.</template>
                    <template v-else>Needs no key.</template>
                </span>
                <Btn kind="primary" small :busy="busy === s.name" @click="install(s)">Install</Btn>
            </li>
        </ul>
    </section>
</template>

<style scoped>
.integrations {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px;
    max-width: 920px;
}

.integrations-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
}

.integrations-head h1 {
    margin: 0 0 6px;
    font-size: 20px;
}

.integrations-lead {
    margin: 0;
    color: var(--text-dim, #9aa0a6);
    max-width: 640px;
}

.integrations-none {
    margin: 0;
    color: var(--text-dim, #9aa0a6);
}

.integrations-notice {
    margin: 0;
    color: var(--warn, #e0a848);
}

.integrations-list,
.integrations-grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 12px;
}

.integrations-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.integration,
.suggestion {
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

.integrations-sub {
    margin: 8px 0 0;
    font-size: 15px;
}

.suggestion p {
    margin: 0;
    color: var(--text-dim, #9aa0a6);
    font-size: 13px;
    flex: 1;
}
</style>
