<script setup>
import {computed, ref, watch} from "vue";
import {Btn, FormField, ModelPicker, Segmented, SidePanel, TextArea, TextInput} from "@journal/window-kit";

// one profile in the panel at the side, as version 4's: the name for a new one, when it is used, its tools, its kind, a model picker for each agent
// program and its instructions, with Cancel and Save in the foot
const props = defineProps({profile: {type: Object, required: true}, used: {type: String, default: ""}, types: {type: Array, default: () => []}});
const emit = defineEmits(["close", "save"]);

const choices = computed(() => props.types.map((type) => ({key: type, label: type.slice(0, 1).toUpperCase() + type.slice(1)})));
const FIELDS = ["description", "tools", "profile_type", "model", "codex_model", "body"];

const draft = ref({});
watch(
    () => props.profile.name,
    () => {
        draft.value = {name: props.profile.name, ...Object.fromEntries(FIELDS.map((key) => [key, props.profile[key]]))};
    },
    {immediate: true},
);
const dirty = computed(() => FIELDS.some((key) => draft.value[key] !== props.profile[key]) || !props.profile.name);
const canSave = computed(() => dirty.value && /^[a-z0-9_-]+$/i.test(draft.value.name || "") && draft.value.description.trim());
</script>

<template>
    <SidePanel :title="profile.name || 'New profile'" :abstract="profile.name ? used : 'Instructions, tools and a model for an agent'" @close="emit('close')">
        <div class="profile-panel" data-profile-panel>
            <template v-if="!profile.name">
                <FormField label="Name" for="profile-name" help="Letters, digits and dashes; the agent starts it by this name.">
                    <TextInput id="profile-name" :value="draft.name" placeholder="critic" @input="draft.name = $event.target.value.trim()" />
                </FormField>
            </template>
            <FormField label="When it is used" for="profile-description" help="The agent reads this to decide when to start it.">
                <TextArea id="profile-description" rows="3" :value="draft.description" @input="draft.description = $event.target.value" />
            </FormField>
            <FormField label="Tools" for="profile-tools" help="Comma separated. A profile that only reads keeps to Read, Grep, Glob and the like.">
                <TextInput id="profile-tools" :value="draft.tools" placeholder="Read, Grep, Glob" @input="draft.tools = $event.target.value" />
            </FormField>
            <FormField label="Kind" for="profile-kind" help="The agent roles your suite supports.">
                <Segmented :options="choices" :value="draft.profile_type" @pick="draft.profile_type = $event" />
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
            <template v-if="profile.shipped">
                <p class="profile-panel-note">The journal ships this profile; setup puts it back as shipped.</p>
            </template>
        </div>
        <template #foot>
            <span class="profile-panel-grow" />
            <Btn kind="ghost" small data-profile-cancel @click="emit('close')">Cancel</Btn>
            <Btn kind="primary" small :disabled="!canSave" data-profile-save @click="emit('save', profile, draft)">Save</Btn>
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

.profile-panel-grow {
    flex: 1;
}
</style>
