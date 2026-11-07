<script setup>
import {computed, ref, watch} from "vue";
import {Btn, DiffCard, FormField, ModelPicker, Segmented, SidePanel, TextArea, TextInput} from "@journal/window-kit";

const props = defineProps({profile: {type: Object, required: true}, used: {type: String, default: ""}, types: {type: Array, default: () => []}});
const emit = defineEmits(["close", "save", "reset"]);

const WRITING = "writing";
const TIERS = [{key: "", label: "Profile models"}, {key: "fast", label: "Fast"}, {key: "general", label: "General"}, {key: "strongest", label: "Strongest"}];
const PROGRAM_CHOICES = [{key: "always", label: "Always this program"}, {key: "possible", label: "This program if possible"}];
const PROGRAMS = [{key: "", label: "The parent's program"}, {key: "claude", label: "Claude Code"}, {key: "codex", label: "Codex"}];
const choices = computed(() => props.types.map((type) => ({key: type.key, label: type.label})));
const FIELDS = ["title", "description", "agent_type", "access", "program", "program_if_possible", "independent", "mcp_tools", "model", "codex_model", "tier", "body"];

const draft = ref({});
watch(
    () => props.profile.name,
    () => {
        draft.value = {name: props.profile.name, ...Object.fromEntries(FIELDS.map((key) => [key, props.profile[key]])), mcp_tools: props.profile.mcp_tools.join(",")};
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
const saved = computed(() => ({...props.profile, mcp_tools: props.profile.mcp_tools.join(",")}));
const dirty = computed(() => FIELDS.some((key) => draft.value[key] !== saved.value[key]) || !props.profile.name);
const canSave = computed(() => dirty.value && /^[a-z0-9_-]+$/i.test(draft.value.name || "") && draft.value.description.trim());
</script>

<template>
    <SidePanel :title="profile.title || profile.name || 'New profile'" :abstract="profile.name ? used : 'Instructions, type and model for an agent'" @close="emit('close')">
        <slot />
        <div class="profile-panel" data-profile-panel>
            <template v-if="profile.title"><small>{{ profile.name }}</small></template>
            <template v-if="!profile.name">
                <FormField label="Name" for="profile-name" help="Letters, digits and dashes; the agent starts it by this name.">
                    <TextInput id="profile-name" :value="draft.name" placeholder="critic" @input="draft.name = $event.target.value.trim()" />
                </FormField>
            </template>
            <FormField label="Title" for="profile-title">
                <TextInput id="profile-title" :value="draft.title" @input="draft.title = $event.target.value" />
            </FormField>
            <FormField label="When it is used" for="profile-description" help="The agent reads this to decide when to start it.">
                <TextArea id="profile-description" rows="3" :value="draft.description" @input="draft.description = $event.target.value" />
            </FormField>
            <FormField label="Type" for="profile-type" help="The type of agent that runs this profile.">
                <template v-if="profile.shipped">
                    <span data-profile-type-locked>{{ pickedType?.label }}</span>
                </template>
                <template v-else>
                    <Segmented data-profile-type :options="choices" :value="draft.agent_type" @pick="draft.agent_type = $event" />
                </template>
            </FormField>
            <FormField label="Access" for="profile-access" help="Whether it may change files.">
                <Segmented data-profile-access :options="accesses" :value="draft.access" @pick="draft.access = $event" />
            </FormField>
            <FormField label="Program" for="profile-program" help="Claude Code or Codex, or the same program as the agent that starts it.">
                <Segmented :options="PROGRAMS" :value="draft.program" @pick="draft.program = $event" />
            </FormField>
            <template v-if="draft.program">
                <FormField label="When it cannot start" for="profile-program-choice" help="If possible: a start uses the other program, on its model, when this one is not installed or not ready, and says so.">
                    <Segmented data-profile-program-choice :options="PROGRAM_CHOICES" :value="draft.program_if_possible ? 'possible' : 'always'" @pick="draft.program_if_possible = $event === 'possible'" />
                </FormField>
            </template>
            <FormField label="Model tier" for="profile-tier" help="Chooses a model when this profile has no named model for the program.">
                <Segmented data-profile-tier :options="TIERS" :value="draft.tier || ''" @pick="draft.tier = $event || null" />
            </FormField>
            <FormField label="Model on Claude Code" for="profile-model" help="The least expensive model that reliably fits the work.">
                <ModelPicker provider="claude" inherits :value="draft.model" data-profile-model="claude" @pick="draft.model = $event" />
            </FormField>
            <FormField label="Model on Codex" for="profile-codex-model" help="The model it runs on when the agent is Codex.">
                <ModelPicker provider="codex" inherits :value="draft.codex_model" data-profile-model="codex" @pick="draft.codex_model = $event" />
            </FormField>
            <FormField label="Instructions" for="profile-body" help="What it is told each time it starts, after the brief.">
                <TextArea id="profile-body" rows="16" :value="draft.body" @input="draft.body = $event.target.value" />
            </FormField>
            <FormField label="MCP tools this profile may call" for="profile-mcp" help="Separate the names with commas.">
                <TextInput id="profile-mcp" :value="draft.mcp_tools" @input="draft.mcp_tools = $event.target.value" />
            </FormField>
            <label class="profile-panel-check"><input v-model="draft.independent" type="checkbox" data-profile-independent /> Must judge fresh</label>
            <template v-if="profile.module_text_changed">
                <p class="profile-panel-note">Text changed: the journal's instructions have a new version.</p>
                <Btn variant="ghost" small data-profile-compare @click="comparing = !comparing">Compare</Btn>
                <template v-if="comparing">
                    <DiffCard path="Instructions" change="edit" :added="compared.filter((row) => row.line_type === 'add').length" :removed="compared.filter((row) => row.line_type === 'del').length" at="" :rows="compared" data-profile-diff />
                </template>
            </template>
            <template v-if="profile.shipped">
                <p class="profile-panel-note">This comes with the journal. Your changes are kept through updates.</p>
            </template>
        </div>
        <template #foot>
            <template v-if="profile.changed.length || profile.problem">
                <Btn variant="ghost" small data-profile-reset @click="emit('reset', profile)">Use the journal's version</Btn>
            </template>
            <span class="profile-panel-grow" />
            <Btn variant="ghost" small data-profile-cancel @click="emit('close')">Cancel</Btn>
            <Btn variant="primary" small :disabled="!canSave" data-profile-save @click="emit('save', profile, draft)">Save</Btn>
        </template>
    </SidePanel>
</template>

<style scoped>
.profile-panel {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.profile-panel-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.profile-panel-check {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 13px;
}

.profile-panel-grow {
    flex: 1;
}
</style>
