<script setup>
import {computed, ref, watch} from "vue";
import {Btn, DiffCard, FormField, InnerTabs, Notice, SidePanel, TextArea, TextInput} from "@journal/window-kit";
import ProfileAboutTab from "./ProfileAboutTab.vue";
import ProfileModelTab from "./ProfileModelTab.vue";
import ProfileSkillToggles from "./ProfileSkillToggles.vue";

const props = defineProps({profile: {type: Object, required: true}, used: {type: String, default: ""}, types: {type: Array, default: () => []}, programs: {type: Array, required: true}, notice: {type: String, default: ""}, failure: {type: String, default: ""}});
const emit = defineEmits(["close", "save", "reset"]);

const WRITING = "writing";
const NAME_PATTERN = /^[a-z0-9_-]+$/i;
const TABS = [{key: "about", label: "About"}, {key: "model", label: "Model"}, {key: "instructions", label: "Instructions"}, {key: "tools", label: "Tools"}, {key: "skills", label: "Skills", count_field: "skills"}];
const programChoices = computed(() => [{key: "", label: "The parent program"}, ...props.programs.map((program) => ({key: program.name, label: program.title}))]);
const choices = computed(() => props.types.map((type) => ({key: type.key, label: type.label})));
const FIELDS = ["title", "description", "agent_type", "access", "program", "preferred_program", "fallback_programs", "independent", "mcp_tools", "program_models", "tier", "body"];

const draft = ref({});
const tab = ref(TABS[0]);
const skillsOn = ref(null);
watch(
    () => props.profile.name,
    () => {
        draft.value = {name: props.profile.name, ...Object.fromEntries(FIELDS.map((key) => [key, props.profile[key]])), mcp_tools: props.profile.mcp_tools.join(","), fallback_programs: props.profile.fallback_programs.join(","), program_models: {...props.profile.program_models}, skills: null, required_skills: null};
        tab.value = TABS[0];
        skillsOn.value = null;
    },
    {immediate: true},
);
const pickedType = computed(() => props.types.find((type) => type.key === draft.value.agent_type));
const canWrite = computed(() => pickedType.value?.access === WRITING);
const accesses = computed(() => [{key: "read-only", label: "Read-only"}, ...(canWrite.value ? [{key: WRITING, label: "Writing"}] : [])]);
watch(canWrite, (allowed) => {
    if (!allowed) draft.value.access = "read-only";
});
const comparing = ref(false);
const lineRows = (type, lines, others) => lines.map((text, index) => ({line_type: type, line: index + 1, text})).filter((row) => !others.includes(row.text));
const compared = computed(() => {
    const yours = props.profile.body.split("\n");
    const journal = (props.profile.module_body || "").split("\n");
    return [...lineRows("del", yours, journal), ...lineRows("add", journal, yours)];
});
const saved = computed(() => ({...props.profile, mcp_tools: props.profile.mcp_tools.join(","), fallback_programs: props.profile.fallback_programs.join(",")}));
const dirty = computed(() => FIELDS.some((key) => JSON.stringify(draft.value[key]) !== JSON.stringify(saved.value[key])) || draft.value.skills !== null || draft.value.required_skills !== null || !props.profile.name);
const nameIsBad = computed(() => !props.profile.name && !NAME_PATTERN.test(draft.value.name || ""));
const descriptionIsEmpty = computed(() => !draft.value.description.trim());
const canSave = computed(() => dirty.value && !nameIsBad.value && !descriptionIsEmpty.value);
const tabCounts = computed(() => (skillsOn.value === null ? {} : {skills: skillsOn.value}));
const problems = computed(() => [props.profile.problem, ...props.profile.notes].filter(Boolean));
</script>

<template>
    <SidePanel width="wide" foot-below :title="profile.title || profile.name || 'New profile'" :abstract="profile.name ? used : 'Instructions, type and model for an agent'" @close="emit('close')">
        <template #meta>
            <template v-if="profile.name">
                <div class="profile-panel-meta" data-profile-meta>
                    <span class="profile-panel-name">{{ profile.name }}</span>
                    <template v-if="profile.shipped"><span class="profile-panel-tag" title="Your changes are kept through updates.">Comes with the journal</span></template>
                    <template v-if="profile.changed.length"><span class="profile-panel-tag">Changed</span></template>
                    <template v-if="profile.problem"><span class="profile-panel-tag">Problem</span></template>
                </div>
            </template>
        </template>
        <slot />
        <div class="profile-panel" data-profile-panel>
            <template v-if="failure">
                <Notice tone="danger"><span role="alert" data-profile-panel-failure>{{ failure }}</span></Notice>
            </template>
            <template v-else-if="notice">
                <Notice><span data-profile-panel-notice>{{ notice }}</span></Notice>
            </template>
            <template v-for="problem in problems" :key="problem">
                <Notice tone="wait">{{ problem }}</Notice>
            </template>
            <template v-if="profile.module_text_changed">
                <Notice>
                    <span class="profile-panel-changed">
                        <span>Text changed: the journal's instructions have a new version.</span>
                        <Btn variant="ghost" small data-profile-compare @click="comparing = !comparing">Compare</Btn>
                    </span>
                </Notice>
                <template v-if="comparing">
                    <DiffCard path="Instructions" change="edit" :added="compared.filter((row) => row.line_type === 'add').length" :removed="compared.filter((row) => row.line_type === 'del').length" at="" :rows="compared" data-profile-diff />
                </template>
            </template>
            <InnerTabs :tabs="TABS" :active="tab" :answer="tabCounts" @choose="tab = $event" />
            <ProfileAboutTab v-show="tab.key === 'about'" v-model:draft="draft" :profile="profile" :choices="choices" :accesses="accesses" :picked-type="pickedType" :name-is-bad="nameIsBad" :description-is-empty="descriptionIsEmpty" />
            <ProfileModelTab v-show="tab.key === 'model'" v-model:draft="draft" :programs="programs" :program-choices="programChoices" />
            <div v-show="tab.key === 'instructions'" class="profile-panel-tab" data-profile-tab="instructions">
                <FormField label="Instructions" for="profile-body" help="What it is told each time it starts, after the brief.">
                    <TextArea id="profile-body" rows="16" :value="draft.body" @input="draft.body = $event.target.value" />
                </FormField>
            </div>
            <div v-show="tab.key === 'tools'" class="profile-panel-tab" data-profile-tab="tools">
                <FormField label="MCP tools this profile may call" for="profile-mcp" help="Separate the names with commas.">
                    <TextInput id="profile-mcp" :value="draft.mcp_tools" @input="draft.mcp_tools = $event.target.value" />
                </FormField>
            </div>
            <div v-show="tab.key === 'skills'" class="profile-panel-tab" data-profile-tab="skills">
                <template v-if="profile.name">
                    <ProfileSkillToggles :profile="profile.name" :chosen="draft.skills" :required-chosen="draft.required_skills" @change="draft.skills = $event" @change-required="draft.required_skills = $event" @count="skillsOn = $event" />
                </template>
                <template v-else>
                    <p class="profile-panel-reason">Save the profile first, then choose its skills.</p>
                </template>
            </div>
        </div>
        <template #foot>
            <Btn variant="ghost" small data-profile-cancel @click="emit('close')">Cancel</Btn>
            <template v-if="profile.changed.length || profile.problem">
                <Btn variant="ghost" small data-profile-reset @click="emit('reset', profile)">Use the journal's version</Btn>
            </template>
            <span class="profile-panel-grow" />
            <template v-if="dirty && profile.name">
                <span class="profile-panel-unsaved" data-profile-unsaved>Unsaved changes</span>
            </template>
            <Btn variant="primary" small :disabled="!canSave" data-profile-save @click="emit('save', profile, draft)">Save</Btn>
        </template>
    </SidePanel>
</template>

<style scoped>
.profile-panel,
.profile-panel-tab {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.profile-panel-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    margin-top: 8px;
}

.profile-panel-name {
    color: var(--text-3);
    font-size: 12px;
}

.profile-panel-tag {
    padding: 0 5px;
    border: 1px solid var(--border-2);
    border-radius: 5px;
    color: var(--text-3);
    font-size: 10px;
}

.profile-panel-changed {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
}

.profile-panel-reason,
.profile-panel-unsaved {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.profile-panel-grow {
    flex: 1;
}
</style>
