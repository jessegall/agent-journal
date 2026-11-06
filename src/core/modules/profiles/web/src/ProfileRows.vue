<script setup>
import {computed, ref} from "vue";
import {ago, Btn, EmptyState, ListRow, SearchBar, matchesSearch, useWindow} from "@journal/window-kit";
import HelperStartForm from "./HelperStartForm.vue";
import ProfilePanel from "./ProfilePanel.vue";

const NEW_PROFILE = {name: "", title: "", description: "", agent_type: "helper", access: "read-only", program: "", independent: false, mcp_tools: [], changed: [], notes: [], problem: "", model: "sonnet", codex_model: "gpt-6.1-sol", body: "", shipped: false, uses: 0};
const ACCESS_WORDS = {"read-only": "Read-only", writing: "Writing"};

const context = useWindow();
const {rows, listing, failure, loaded, act, actionFailure} = context.props.profiles;
const types = computed(() => listing.value ? listing.value.types : []);
const opened = ref("");
const query = ref("");
const notice = ref("");
const making = ref(false);

const matching = computed(() => {
    const words = query.value.toLowerCase().split(/\s+/).filter(Boolean);
    return rows.value.filter((row) => words.every((word) => matchesSearch(row, word, context.search?.fields)));
});
const panel = computed(() => (making.value ? NEW_PROFILE : rows.value.find((row) => row.name === opened.value) || null));
const typeLabel = (row) => types.value.find((type) => type.key === row.agent_type)?.label || row.agent_type;
const origin = (row) => (row.shipped ? "Comes with the journal" : row.module);
const rowLine = (row) => [`Type: ${typeLabel(row)}`, `Access: ${ACCESS_WORDS[row.access]}`, `${row.model || "chosen at start"} on Claude`, `${row.codex_model || "chosen at start"} on Codex`, row.changed.length ? "Changed" : "", origin(row)].filter(Boolean).join(" · ");
const warnings = (row) => [row.problem, row.module_text_changed ? "Text changed: the journal's instructions have a new version" : "", ...row.notes].filter(Boolean);
const usedWords = (row) => (row.uses ? `Uses: ${row.uses} ${row.uses === 1 ? "time" : "times"}, last ${ago(new Date(row.last_used * 1000).toISOString())}` : "Uses: none");

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

async function reset(profile) {
    notice.value = "";
    const result = await act(["profile", "reset", profile.name]);
    if (result.ok) notice.value = `${profile.name} is back to the journal's version.`;
}

async function save(profile, fields) {
    notice.value = "";
    const name = profile.name || fields.name;
    const result = await act(["profile", "save", name, ...(fields.title ? ["--title", fields.title] : []), "--description", fields.description, "--type", fields.agent_type, "--access", fields.access, "--program", fields.program, "--model", fields.model, "--codex-model", fields.codex_model, "--mcp-tools", fields.mcp_tools, fields.independent ? "--independent" : "--no-independent", "--body", fields.body]);
    if (!result.ok) return;
    making.value = false;
    opened.value = name;
    notice.value = `${name} saved. The agent will use it the next time it starts a helper with this profile.`;
}
</script>

<template>
    <section class="profiles" data-profiles>
        <SearchBar v-model="query" class="bar" data-profile-find>
            <Btn variant="ghost" small data-profile-new @click="make">New profile</Btn>
            <span class="count" data-profile-count>{{ rows.length }} {{ rows.length === 1 ? "profile" : "profiles" }}</span>
            <template v-if="notice">
                <span class="notice" data-profile-notice>{{ notice }}</span>
            </template>
            <template v-if="actionFailure">
                <span class="notice failed" role="alert" data-profile-failure>{{ actionFailure }}</span>
            </template>
        </SearchBar>
        <template v-if="failure">
            <EmptyState class="empty" title="The profiles could not be read">{{ failure }}</EmptyState>
        </template>
        <template v-else-if="!loaded || !rows.length">
            <EmptyState class="empty" :loading="!loaded" title="No profiles yet">
                A profile gives an agent its instructions, type and model. The journal includes standard profiles.
            </EmptyState>
        </template>
        <template v-else-if="!matching.length">
            <EmptyState class="empty" title="No profile matches">Try other words.</EmptyState>
        </template>
        <template v-else>
            <div class="rows">
                <template v-for="profile in matching" :key="profile.name">
                    <Btn variant="text" fill class="profile-open" :aria-label="`Open ${profile.name}`" :data-profile="profile.name" @click="open(profile)">
                        <ListRow :title="profile.title || profile.name" :text="profile.description">
                            <template #end>
                                <span class="profile-meta">
                                    <template v-if="profile.title"><span class="profile-model">{{ profile.name }}</span></template>
                                    <span class="profile-model">{{ rowLine(profile) }}</span>
                                    <template v-for="warning in warnings(profile)" :key="warning">
                                        <span class="profile-warning" data-profile-warning>{{ warning }}</span>
                                    </template>
                                    <span :class="['profile-used', {never: !profile.uses}]">{{ usedWords(profile) }}</span>
                                </span>
                            </template>
                        </ListRow>
                    </Btn>
                </template>
            </div>
        </template>
        <template v-if="panel">
            <ProfilePanel :types="types" :profile="panel" :used="usedWords(panel)" @close="close" @save="save" @reset="reset">
                <template v-if="panel.name && panel.agent_type === 'helper'"><HelperStartForm :profile="panel.name" /></template>
            </ProfilePanel>
        </template>
    </section>
</template>

<style scoped>
.profiles {
    padding: 0 0 40px;
}

.bar {
    flex-wrap: wrap;
    gap: 8px 12px;
    color: var(--text-2);
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

.profile-warning {
    color: var(--tone-warn);
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
