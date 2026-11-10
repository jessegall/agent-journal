<script setup>
import {FormField, Segmented, TextArea, TextInput} from "@journal/window-kit";

const OCCUPANTS = [{key: "continue", label: "Resume it"}, {key: "when-cold", label: "Start over after a long pause"}, {key: "each-launch", label: "New for each job"}];

// the About tab of the profile panel: what the profile is called, when it is used and what kind of agent runs it; the fields are the panel's draft
const draft = defineModel("draft", {type: Object, required: true});
defineProps({profile: {type: Object, required: true}, choices: {type: Array, required: true}, accesses: {type: Array, required: true}, pickedType: {type: Object, default: null}, nameIsBad: Boolean, descriptionIsEmpty: Boolean});
</script>

<template>
    <div class="profile-panel-tab" data-profile-tab="about">
        <template v-if="!profile.name">
            <FormField label="Name" for="profile-name" help="Letters, digits and dashes; the agent starts it by this name.">
                <TextInput id="profile-name" :value="draft.name" placeholder="critic" @input="draft.name = $event.target.value.trim()" />
            </FormField>
            <template v-if="nameIsBad && draft.name">
                <p class="profile-panel-reason">Use letters, digits and dashes.</p>
            </template>
        </template>
        <FormField label="Title" for="profile-title">
            <TextInput id="profile-title" :value="draft.title" @input="draft.title = $event.target.value" />
        </FormField>
        <FormField label="When it is used" for="profile-description" help="The agent reads this to decide when to start it.">
            <TextArea id="profile-description" rows="3" :value="draft.description" @input="draft.description = $event.target.value" />
        </FormField>
        <template v-if="descriptionIsEmpty">
            <p class="profile-panel-reason">Describe when the agent should start it.</p>
        </template>
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
        <template v-if="pickedType?.declares_occupant">
            <FormField label="Conversation" for="profile-occupant" help="What the agent does with its conversation when it gets its next job. The agent itself is kept in each case.">
                <Segmented data-profile-occupant :options="OCCUPANTS" :value="draft.occupant" @pick="draft.occupant = $event" />
            </FormField>
        </template>
    </div>
</template>

<style scoped>
.profile-panel-tab {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.profile-panel-reason {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
