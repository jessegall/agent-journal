<script setup>
import {computed, ref} from "vue";
import {Btn, FilterBar, ListReaderLayout, PageHeader, Skeleton, ago, applyFilter, copying, defaultFilter, removed, useWindow} from "@journal/window-kit";
import HelperStartForm from "./HelperStartForm.vue";
import ProfilePanel from "./ProfilePanel.vue";

const NEW_PROFILE = {name: "", title: "", description: "", agent_type: "helper", access: "read-only", program: "", occupant: "when-cold", mcp_tools: [], fallback_programs: [], changed: [], notes: [], problem: "", program_models: {}, tier: null, body: "", shipped: false, uses: 0};
const LIST_WIDTH = 360;
const NEW_ID = "__new";

// the profiles as a list and an editor: the list is grouped by type, each row says its models; the editor is the panel with its tabs, and keeps a slot for the sections that other plans add.
// New and Duplicate start a draft that is a row of its own until it is saved or dropped
const context = useWindow();
const {rows, listing, failure, loaded, act, actionFailure} = context.props.profiles;
const programs = context.props.programs.rows;
const types = computed(() => (listing.value ? listing.value.types : []));
const chosen = ref(null);
const fresh = ref(null);
const draftNumber = ref(0);
const notice = ref("");
const filter = ref(defaultFilter([]));
const words = ref("");

const typeLabel = (row) => types.value.find((type) => type.key === row.agent_type)?.label || row.agent_type;
const fields = computed(() => [{key: "type", label: "Type", options: types.value.map((type) => [type.key, type.label]), get: (item) => item.p.agent_type}]);
const usedWords = (row) => (row.uses ? `Uses: ${row.uses} ${row.uses === 1 ? "time" : "times"}, last ${ago(new Date(row.last_used * 1000).toISOString())}` : "Uses: none");
// a row's facts: its type and the model it starts with on its own program
const modelsOf = (row) => `${typeLabel(row)} · ${row.program_models?.[row.program] || row.model || "model chosen at start"}`;
const listed = computed(() => [
    ...(fresh.value ? [{id: NEW_ID, title: fresh.value.title || "New profile", desc: "Not saved", group: "New", p: fresh.value}] : []),
    ...rows.value.map((row) => ({id: row.name, title: row.title || row.name, desc: modelsOf(row), group: row.is_base ? "Base profiles" : typeLabel(row), kind: typeLabel(row), p: row})),
]);
const shown = computed(() => applyFilter(listed.value, fields.value, filter.value, words.value, ["id", "title", "desc", "kind"]));
const reopen = (profile) => {
    fresh.value = profile;
    draftNumber.value += 1;
    chosen.value = NEW_ID;
};
const make = () => reopen({...NEW_PROFILE});
const duplicate = (row) => reopen({...row, name: "", title: `${row.title || row.name} copy`, shipped: false, changed: [], uses: 0, problem: "", notes: [], module_text_changed: false, is_base: false});
const drop = () => {
    fresh.value = null;
    chosen.value = null;
};

async function reset(profile) {
    notice.value = "";
    const result = await act(["profile", "reset", profile.name]);
    if (result.ok) notice.value = `${profile.name} is back to the journal's version.`;
}

async function save(profile, values) {
    notice.value = "";
    const name = profile.name || values.name;
    const result = await act(["profile", "save", name, ...(values.title ? ["--title", values.title] : []), "--description", values.description, "--type", values.agent_type, "--access", values.access, "--program", values.program, values.preferred_program ? "--program-if-possible" : "--no-program-if-possible", "--fallback-programs", values.fallback_programs, "--tier", values.tier || "", ...programs.value.flatMap((program) => [program.model_option, values.program_models[program.name] || ""]), "--mcp-tools", values.mcp_tools, ...(types.value.find((type) => type.key === values.agent_type)?.declares_occupant ? ["--occupant", values.occupant] : []), "--body", values.body, ...(values.skills ? ["--skills", values.skills.join(",")] : []), ...(values.required_skills ? ["--required-skills", values.required_skills.join(",")] : [])]);
    if (!result.ok) return;
    fresh.value = null;
    chosen.value = name;
    notice.value = `${name} saved. The agent will use it the next time it starts a helper with this profile.`;
}

// the menu of a right click: Open, Duplicate, Copy name, Reset to the journal's version when something is changed, and Remove for a profile the journal does not supply
const needsReset = (row) => Boolean(row.changed.length || row.problem || row.module_text_changed);
const menuOf = (item) => [
    {label: "Open", group: "open", disabled: item.id === chosen.value, reason: "Already open", run: () => (chosen.value = item.id)},
    {label: "Duplicate", group: "open", disabled: item.id === NEW_ID, reason: "Not saved yet", run: () => duplicate(item.p)},
    {label: "Copy name", group: "copy", disabled: item.id === NEW_ID, reason: "Not saved yet", run: ({say}) => copying(item.id, item.id, say)},
    {label: "Reset", group: "own", disabled: item.id === NEW_ID || !item.p.module || !needsReset(item.p), reason: "Same as the journal's version", run: () => reset(item.p)},
    {label: "Remove", group: "delete", danger: true, armedLabel: "Remove: click again", disabled: item.id === NEW_ID || Boolean(item.p.module), reason: "Comes with the journal", run: () => act(["profile", "remove", item.id], removed(item.id))},
];
const place = (item) => ({head: item.title, items: menuOf(item)});
</script>

<template>
    <ListReaderLayout v-model:chosen="chosen" :items="shown" :list-width="LIST_WIDTH" :place="place" empty-title="No profiles yet" pick-line="No profile chosen" open-first data-profiles>
        <template #top>
            <PageHeader title="Profiles" :count="rows.length">
                <template #primary><Btn small variant="primary" data-profile-new @click="make">New profile</Btn></template>
            </PageHeader>
            <FilterBar v-model="filter" v-model:words="words" :fields="fields" :rows="listed" :shown="shown.length" placeholder="Search profiles" data-profile-find />
            <template v-if="notice">
              <p class="note" data-profile-notice>{{ notice }}</p>
            </template>
            <template v-if="actionFailure">
              <p class="note failed" role="alert" data-profile-failure>{{ actionFailure }}</p>
            </template>
            <template v-if="failure">
              <p class="note failed" role="alert">{{ failure }}</p>
            </template>
        </template>
        <template #empty>
            <template v-if="!loaded"><Skeleton shape="rows" /></template>
            <template v-else>A profile gives an agent its instructions, type and model. The journal includes standard profiles.</template>
        </template>
        <template #meta="{item}">
            <template v-if="item.id === NEW_ID">
              <span class="faint">New</span>
            </template>
            <template v-else-if="item.p.is_base">
              <span class="faint" title="Other profiles extend this one; it is never started by itself" data-profile-base>Base</span>
            </template>
            <template v-else-if="item.p.changed.length">
              <span class="faint">Changed</span>
            </template>
        </template>
        <template #reader="{item}">
            <ProfilePanel :key="`${item.id}-${draftNumber}`" :notice="notice" :failure="actionFailure" :programs="programs" :types="types" :profile="item.p" :used="usedWords(item.p)" @close="drop" @save="save" @reset="reset">
                <template v-if="item.p.name && item.p.agent_type === 'helper'"><HelperStartForm :programs="programs" :profile="item.p.name" /></template>
            </ProfilePanel>
        </template>
    </ListReaderLayout>
</template>

<style scoped>
.note {
    margin: 0;
    padding: 4px var(--inset);
    color: var(--text-2);
    font-size: 12px;
}

.failed {
    color: var(--danger);
}

.faint {
    color: var(--text-4);
    font-size: 12px;
    white-space: nowrap;
}
</style>
