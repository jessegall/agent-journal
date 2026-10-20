<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {ago} from "../format/time.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import ListRow from "../kit/ListRow.vue";
import TextInput from "../kit/TextInput.vue";
import AgentProfilePanel from "./AgentProfilePanel.vue";

const rows = ref([]);
const loaded = ref(false);
const opened = ref("");
const query = ref("");
const notice = ref("");
const making = ref(false);

async function reload() {
    rows.value = (await api.agentProfiles()).profiles;
    loaded.value = true;
}
onMounted(reload);

const matching = computed(() => {
    const words = query.value.toLowerCase().split(/\s+/).filter(Boolean);
    return rows.value.filter((p) => words.every((w) => `${p.name} ${p.description} ${p.kind} ${p.model} ${p.codex_model}`.toLowerCase().includes(w)));
});
const panel = computed(() =>
    making.value
        ? {name: "", description: "", tools: "Read, Grep, Glob", kind: "subagent", model: "sonnet", codex_model: "gpt-6.1-sol", body: "", shipped: false, uses: 0}
        : rows.value.find((p) => p.name === opened.value) || null
);
const usedWords = (p) =>
    p.uses ? `Dispatched ${p.uses} ${p.uses === 1 ? "time" : "times"}, last ${ago(p.last_used)}` : "Never dispatched here";

async function save(profile, fields) {
    notice.value = "";
    try {
        const saved = await api.saveAgentProfile(profile.name || fields.name, fields);
        making.value = false;
        opened.value = saved.name;
        await reload();
        notice.value = `${saved.name} saved; the agent reads it at its next dispatch.`;
    } catch (e) {
        notice.value = e.message;
    }
}
</script>

<template>
    <section class="profiles">
        <div class="bar">
            <TextInput
                class="profiles-find"
                icon="search"
                :value="query"
                placeholder="Find a profile"
                aria-label="Find a profile"
                @input="query = $event.target.value"
                @keydown.esc="query = ''"
            />
            <Btn kind="ghost" small @click="((making = true), (opened = ''))">New profile</Btn>
            <span class="count">{{ rows.length }} {{ rows.length === 1 ? "profile" : "profiles" }} in .claude/agents</span>
            <template v-if="notice">
                <span class="notice">{{ notice }}</span>
            </template>
        </div>
        <template v-if="!loaded || !rows.length">
            <EmptyState class="empty" :loading="!loaded" title="No profiles yet">
                A profile is a subagent the agent can start for one kind of job: its description says when, its tools what it may do, its
                model what it runs on. The journal writes a researcher, a planner and a debugger at setup.
            </EmptyState>
        </template>
        <template v-else-if="!matching.length">
            <EmptyState class="empty" title="No profile matches">Try other words.</EmptyState>
        </template>
        <template v-else>
            <div class="rows">
                <template v-for="profile in matching" :key="profile.name">
                    <Btn
                        kind="text"
                        fill
                        class="profile-open"
                        :aria-label="`Open ${profile.name}`"
                        @click="((making = false), (opened = profile.name))"
                    >
                        <ListRow :title="profile.name" :text="profile.description">
                            <template #end>
                                <span class="profile-meta">
                                    <span class="profile-model">{{ profile.kind }} · {{ profile.model || "the agent's model" }} on Claude · {{ profile.codex_model || "the agent's model" }} on Codex</span>
                                    <span :class="['profile-used', {never: !profile.uses}]">{{ usedWords(profile) }}</span>
                                </span>
                            </template>
                        </ListRow>
                    </Btn>
                </template>
            </div>
        </template>
        <template v-if="panel">
            <AgentProfilePanel :profile="panel" :used="usedWords(panel)" @close="((making = false), (opened = ''))" @save="save" />
        </template>
    </section>
</template>

<style scoped>
.profiles {
    padding: 0 0 40px;
}

.bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    min-height: 44px;
    padding: 8px 14px 8px 22px;
    border-bottom: 1px solid var(--border);
    color: var(--text-2);
}

.profiles-find {
    flex: 0 1 280px;
}

.count {
    margin-left: auto;
    color: var(--text-3);
    font-size: 12.5px;
}

.notice {
    font-size: 12px;
    color: var(--text-2);
}

.empty {
    margin: 40px auto;
    max-width: 480px;
}

.rows {
    display: flex;
    flex-direction: column;
    padding: 8px 14px 0 22px;
}

.profile-open {
    text-align: left;
}

.profile-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    font-size: 12px;
}

.profile-model {
    color: var(--text-2);
}

.profile-used {
    color: var(--text-3);
    white-space: nowrap;
}

.profile-used.never {
    color: var(--text-4);
}

@media (max-width: 640px) {
    .profiles-find {
        flex: 1 1 100%;
    }

    .profile-meta {
        display: none;
    }
}
</style>
