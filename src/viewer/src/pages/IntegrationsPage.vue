<script setup>
import {useNamedAct} from "../composables/namedAct.js";
import {computed, onUnmounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import {usePoll} from "../composables/poll.js";
import {ago} from "../format/time.js";
import {agentOnline} from "../composables/leadAgent.js";
import Btn from "../kit/Btn.vue";
import TextInput from "../kit/TextInput.vue";
import SkeletonLine from "../kit/SkeletonLine.vue";
import IntegrationPending from "./IntegrationPending.vue";
import IntegrationServer from "./IntegrationServer.vue";
import IntegrationSuggestion from "./IntegrationSuggestion.vue";

const servers = ref([]);
const suggested = ref([]);
const restartPending = ref([]);
const signingIn = ref("");
const loaded = ref(false);
const notice = ref("");
const {busy, act: run} = useNamedAct(notice);

// each act on a server is followed by the page read again
function act(name, work) {
    return run(name, async () => {
        await work();
        await reload();
    });
}
const keys = ref({});

const offered = computed(() => suggested.value.filter((s) => !s.installed));

const checkedAt = ref(0);
const checking = ref(false);
function take(got) {
    if (!got) return;
    checkedAt.value = got.checked_at || 0;
    checking.value = got.checking;
    servers.value = got.servers;
    suggested.value = got.suggested;
    restartPending.value = got.restart_pending || [];
    loaded.value = true;
}
const reload = async () => take(await api.mcp());
usePoll("mcp.servers", {take});
let waiting = 0;
watch(restartPending, (sessions) => {
    clearInterval(waiting);
    if (sessions.length) waiting = setInterval(reload, 3000);
});
onUnmounted(() => clearInterval(waiting));

// while the journal checks the servers, the page reads it again often, so the states arrive as soon as the check does
const CHECKING_EVERY = 1500;
let following = 0;
watch(checking, (on) => {
    clearInterval(following);
    if (on) following = setInterval(reload, CHECKING_EVERY);
});
onUnmounted(() => clearInterval(following));
const firstCheck = computed(() => !loaded.value || (!checkedAt.value && checking.value));

const install = (s) => act(s.name, () => api.mcpInstall(s.name));
const remove = (s) => act(s.name, () => api.mcpRemove(s.name));
const added = ref({name: "", target: ""});
const isAddress = (target) => /^https?:\/\//.test(target.trim());
const add = () =>
    act("add", async () => {
        const target = added.value.target.trim();
        const words = target.split(/\s+/);
        await api.mcpAdd({name: added.value.name.trim(), ...(isAddress(target) ? {url: target} : {command: words[0], args: words.slice(1)})});
        added.value = {name: "", target: ""};
    });
const check = () => act("check", () => api.mcpCheck());
const saveKey = (s) =>
    act(s.name, async () => {
        await api.mcpKey(s.name, keys.value[s.name] || "");
        keys.value[s.name] = "";
    });
const signIn = (s) =>
    act(s.name, async () => {
        await api.mcpSignIn(s.name);
        signingIn.value = s.name;
    });
let signInPolling = 0;
let checks = 0;
watch(signingIn, (name) => {
    clearInterval(signInPolling);
    checks = 0;
    if (!name) return;
    signInPolling = setInterval(async () => {
        const got = await api.mcpCheck();
        servers.value = got.servers;
        const server = got.servers.find((s) => s.name === name);
        checks += 1;
        if (!server || server.state === "connected" || checks >= 18) signingIn.value = "";
    }, 10000);
});
onUnmounted(() => clearInterval(signInPolling));

</script>

<template>
    <section class="integrations">
        <header class="integrations-head">
            <div>
                <h1>MCP</h1>
                <p class="integrations-lead">
                    These are the MCP servers the agents are given, from here or from Claude Code itself. Installing or removing one
                    restarts the running agents once they are idle, so it applies at once. A key restarts nothing: it is kept outside the
                    project, never written into it, and used from the agent's next launch.
                </p>
            </div>
            <template v-if="checkedAt">
                <span class="integrations-checked">States checked {{ ago(checkedAt) }}</span>
            </template>
            <Btn kind="ghost" :busy="busy === 'check' || checking" :disabled="!servers.length" @click="check">Refresh</Btn>
        </header>

        <template v-if="notice">
            <p class="integrations-notice">{{ notice }}</p>
        </template>
        <template v-if="restartPending.length">
            <IntegrationPending>The agent restarts as soon as it finishes what it is doing; the change applies then.</IntegrationPending>
        </template>

        <template v-if="firstCheck">
            <ul class="integrations-list" aria-label="Checking the MCP servers">
                <template v-for="n in 3" :key="n">
                    <li class="integration">
                        <SkeletonLine
                            :bars="[
                                {width: '28%', height: 16},
                                {width: '40%', height: 14},
                            ]"
                        />
                        <SkeletonLine :bars="[{width: '62%', height: 12}]" />
                    </li>
                </template>
            </ul>
        </template>
        <template v-else-if="!servers.length">
            <p class="integrations-none">No MCP server yet. Install one of the suggestions below.</p>
        </template>

        <template v-else>
            <ul class="integrations-list">
                <template v-for="s in servers" :key="s.name">
                    <IntegrationServer
                        v-model:key-value="keys[s.name]"
                        :server="s"
                        :busy="busy === s.name"
                        :signing-in="signingIn === s.name"
                        :agent-online="agentOnline"
                        @remove="remove(s)"
                        @save-key="saveKey(s)"
                        @sign-in="signIn(s)"
                    />
                </template>
            </ul>
        </template>

        <h2 class="integrations-sub">Add a server</h2>
        <div class="integration-key">
            <TextInput :value="added.name" placeholder="Name" @input="added.name = $event.target.value" />
            <TextInput
                :value="added.target"
                placeholder="Its address, or the command that starts it"
                @input="added.target = $event.target.value"
                @keydown.enter="add"
            />
            <Btn kind="primary" small :busy="busy === 'add'" :disabled="!added.name.trim() || !added.target.trim()" @click="add">
                Add
            </Btn>
        </div>

        <h2 class="integrations-sub">Suggested</h2>
        <template v-if="!loaded">
            <ul class="integrations-grid" aria-label="Loading the suggestions">
                <template v-for="n in 4" :key="n">
                    <li class="suggestion">
                        <SkeletonLine :bars="[{width: '40%', height: 16}]" />
                        <SkeletonLine :bars="[{width: '85%', height: 12}]" />
                        <SkeletonLine :bars="[{width: '50%', height: 12}]" />
                    </li>
                </template>
            </ul>
        </template>
        <template v-else-if="!offered.length">
            <p class="integrations-none">Every suggested server is installed.</p>
        </template>
        <template v-else>
            <ul class="integrations-grid">
                <template v-for="s in offered" :key="s.name">
                    <IntegrationSuggestion :suggestion="s" :busy="busy === s.name" @install="install(s)" />
                </template>
            </ul>
        </template>
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

.integrations-checked {
    color: var(--text-3);
    font-size: 12px;
}

.integrations-sub {
    margin: 8px 0 0;
    font-size: 15px;
}
</style>
