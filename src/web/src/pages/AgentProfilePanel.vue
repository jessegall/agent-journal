<script setup>
import {computed, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import DropList from "../kit/DropList.vue";
import FormField from "../kit/FormField.vue";
import SidePanel from "../kit/SidePanel.vue";
import TextArea from "../kit/TextArea.vue";
import TextInput from "../kit/TextInput.vue";

const props = defineProps({profile: {type: Object, required: true}, used: {type: String, default: ""}});
const emit = defineEmits(["close", "save"]);

const MODELS = [
    {key: "haiku", label: "haiku", note: "fast, for mechanical work"},
    {key: "sonnet", label: "sonnet", note: "careful work without invention"},
    {key: "opus", label: "opus", note: "judgement"},
    {key: "", label: "the agent's model", note: "inherits whoever dispatches it"},
];

const draft = ref({});
watch(
    () => props.profile.name,
    () => {
        draft.value = {
            name: props.profile.name,
            description: props.profile.description,
            tools: props.profile.tools,
            model: props.profile.model,
            body: props.profile.body,
        };
    },
    {immediate: true}
);
const dirty = computed(
    () => ["description", "tools", "model", "body"].some((key) => draft.value[key] !== props.profile[key]) || !props.profile.name
);
const canSave = computed(() => dirty.value && /^[a-z0-9_-]+$/i.test(draft.value.name || "") && draft.value.description.trim());
const modelLabel = computed(() => (MODELS.find((m) => m.key === draft.value.model) || {label: draft.value.model}).label);
</script>

<template>
    <SidePanel
        :title="profile.name || 'New profile'"
        :abstract="profile.name ? used : 'A subagent the agent can dispatch for one kind of job'"
        @close="$emit('close')"
    >
        <div class="profile-panel">
            <template v-if="!profile.name">
                <FormField label="Name" for="profile-name" help="Letters, digits, dashes; the agent dispatches it by this name.">
                    <TextInput
                        id="profile-name"
                        :value="draft.name"
                        placeholder="critic"
                        @input="draft.name = $event.target.value.trim()"
                    />
                </FormField>
            </template>
            <FormField label="When it is used" for="profile-description" help="The agent reads this to decide when to dispatch it.">
                <TextArea id="profile-description" rows="3" :value="draft.description" @input="draft.description = $event.target.value" />
            </FormField>
            <FormField
                label="Tools"
                for="profile-tools"
                help="Comma separated. A profile that only reads keeps to Read, Grep, Glob and the like."
            >
                <TextInput
                    id="profile-tools"
                    :value="draft.tools"
                    placeholder="Read, Grep, Glob"
                    @input="draft.tools = $event.target.value"
                />
            </FormField>
            <FormField label="Model" for="profile-model" help="The least expensive model that reliably fits the work.">
                <DropList
                    :label="modelLabel"
                    icon="model"
                    :items="MODELS"
                    :picked="draft.model"
                    :menu-width="280"
                    @pick="draft.model = $event.key"
                />
            </FormField>
            <FormField label="Instructions" for="profile-body" help="What it is told at every dispatch, after the brief.">
                <TextArea id="profile-body" rows="16" :value="draft.body" @input="draft.body = $event.target.value" />
            </FormField>
            <template v-if="profile.shipped">
                <p class="profile-panel-note">The journal ships this profile; setup puts it back as shipped.</p>
            </template>
        </div>
        <template #foot>
            <span class="profile-panel-grow" />
            <Btn kind="ghost" small @click="$emit('close')">Cancel</Btn>
            <Btn kind="primary" small :disabled="!canSave" @click="$emit('save', profile, draft)">Save</Btn>
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
