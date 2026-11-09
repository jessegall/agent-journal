<script setup>
import {FormField, ModelPicker, Segmented, TextInput} from "@journal/window-kit";

// the Model tab of the profile panel: the program a profile runs on and the model on each program; the fields are the panel's draft
const WHEN_IT_CANNOT_START = [{key: "always", label: "Always this program"}, {key: "possible", label: "This program if possible"}];
const TIERS = [{key: "", label: "Profile models"}, {key: "fast", label: "Fast"}, {key: "general", label: "General"}, {key: "strongest", label: "Strongest"}];

const draft = defineModel("draft", {type: Object, required: true});
defineProps({programs: {type: Array, required: true}, programChoices: {type: Array, required: true}});
</script>

<template>
    <div class="profile-panel-tab" data-profile-tab="model">
        <FormField label="Program" for="profile-program" help="A registered program, or the same program as the agent that starts it.">
            <Segmented :options="programChoices" :value="draft.program" @pick="draft.program = $event" />
        </FormField>
        <template v-if="draft.program">
            <FormField label="When it cannot start" for="profile-program-choice" help="If possible: a start uses the other program, on its model, when this one is not installed or not ready, and says so.">
                <Segmented data-profile-program-choice :options="WHEN_IT_CANNOT_START" :value="draft.preferred_program ? 'possible' : 'always'" @pick="draft.preferred_program = $event === 'possible'" />
            </FormField>
            <template v-if="draft.preferred_program">
                <FormField label="Programs to try instead" for="profile-fallbacks" help="Program names in the order to try them, separated by commas. Blank tries every other program.">
                    <TextInput id="profile-fallbacks" :value="draft.fallback_programs" data-profile-fallbacks @input="draft.fallback_programs = $event.target.value" />
                </FormField>
            </template>
        </template>
        <FormField label="Model tier" for="profile-tier" help="Chooses a model when this profile has no named model for the program.">
            <Segmented data-profile-tier :options="TIERS" :value="draft.tier || ''" @pick="draft.tier = $event || null" />
        </FormField>
        <div class="profile-panel-models">
            <template v-for="program in programs" :key="program.name">
                <FormField :label="`Model on ${program.title}`" :for="`profile-model-${program.name}`" help="The least expensive model that reliably fits the work.">
                    <ModelPicker :title="program.title" :models="program.models" inherits :value="draft.program_models[program.name] || ''" :data-profile-model="program.name" @pick="draft.program_models[program.name] = $event" />
                </FormField>
            </template>
        </div>
    </div>
</template>

<style scoped>
.profile-panel-tab {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.profile-panel-models {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 14px;
}
</style>
