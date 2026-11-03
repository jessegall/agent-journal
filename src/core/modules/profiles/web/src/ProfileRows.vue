<script setup>
import {computed, ref} from "vue";
import {ago, Btn, EmptyState, ListRow, TextInput, useRows} from "@journal/window-kit";
import ProfilePanel from "./ProfilePanel.vue";

// the Agent profiles page as version 4 drew it: a bar with the find box, New profile and the count, a row for each profile with its kind, models and use, and
// the profile opened in a panel at the side, where it is edited and saved; the person saves, an agent is refused
const NEW_PROFILE = {name: "", description: "", tools: "Read, Grep, Glob", profile_type: "subagent", model: "sonnet", codex_model: "gpt-6.1-sol", body: "", shipped: false, uses: 0};

const {rows, failure, loaded, act, actionFailure} = useRows("profile list", []);
const opened = ref("");
const query = ref("");
const notice = ref("");
const making = ref(false);

const matching = computed(() => {
    const words = query.value.toLowerCase().split(/\s+/).filter(Boolean);
    return rows.value.filter((row) => words.every((word) => `${row.name} ${row.description} ${row.profile_type} ${row.model} ${row.codex_model}`.toLowerCase().includes(word)));
});
const panel = computed(() => (making.value ? NEW_PROFILE : rows.value.find((row) => row.name === opened.value) || null));
const usedWords = (row) => (row.uses ? `Dispatched ${row.uses} ${row.uses === 1 ? "time" : "times"}, last ${ago(new Date(row.last_used * 1000).toISOString())}` : "Never dispatched here");

function make() {
    making.value = true;
    opened.value = "";
}

function open(row) {
    making.value = false;
    opened.value = row.name;
}

function close() {
    making.value = false;
    opened.value = "";
}

async function save(profile, fields) {
    notice.value = "";
    const name = profile.name || fields.name;
    const result = await act(["profile", "save", name, "--description", fields.description, "--tools", fields.tools, "--type", fields.profile_type, "--model", fields.model, "--codex-model", fields.codex_model, "--body", fields.body]);
    if (!result.ok) return;
    making.value = false;
    opened.value = name;
    notice.value = `${name} saved; the agent reads it at its next dispatch.`;
}
</script>

<template>
    <section class="profiles" data-profiles>
        <div class="bar">
            <TextInput v-model="query" class="profiles-find" icon="search" placeholder="Find a profile" aria-label="Find a profile" data-profile-find @keydown.esc="query = ''" />
            <Btn kind="ghost" small data-profile-new @click="make">New profile</Btn>
            <span class="count" data-profile-count>{{ rows.length }} {{ rows.length === 1 ? "profile" : "profiles" }} in .claude/agents</span>
            <template v-if="notice">
                <span class="notice" data-profile-notice>{{ notice }}</span>
            </template>
            <template v-if="actionFailure">
                <span class="notice failed" role="alert" data-profile-failure>{{ actionFailure }}</span>
            </template>
        </div>
        <template v-if="failure">
            <EmptyState class="empty" title="The profiles could not be read">{{ failure }}</EmptyState>
        </template>
        <template v-else-if="!loaded || !rows.length">
            <EmptyState class="empty" :loading="!loaded" title="No profiles yet">
                A profile is a subagent the agent can start for one kind of job: its description says when, its tools what it may do, its model what it runs on.
                The journal writes a researcher, a planner and a debugger at setup.
            </EmptyState>
        </template>
        <template v-else-if="!matching.length">
            <EmptyState class="empty" title="No profile matches">Try other words.</EmptyState>
        </template>
        <template v-else>
            <div class="rows">
                <template v-for="profile in matching" :key="profile.name">
                    <Btn kind="text" fill class="profile-open" :aria-label="`Open ${profile.name}`" :data-profile="profile.name" @click="open(profile)">
                        <ListRow :title="profile.name" :text="profile.description">
                            <template #end>
                                <span class="profile-meta">
                                    <span class="profile-model">{{ profile.profile_type }} · {{ profile.model || "the agent's model" }} on Claude · {{ profile.codex_model || "the agent's model" }} on Codex</span>
                                    <span :class="['profile-used', {never: !profile.uses}]">{{ usedWords(profile) }}</span>
                                </span>
                            </template>
                        </ListRow>
                    </Btn>
                </template>
            </div>
        </template>
        <template v-if="panel">
            <ProfilePanel :profile="panel" :used="usedWords(panel)" @close="close" @save="save" />
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

.notice.failed {
    color: var(--danger);
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
