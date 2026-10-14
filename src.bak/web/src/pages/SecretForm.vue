<script setup>
import {computed, ref} from "vue";
import {allowedProgram} from "../domain/secrets.js";
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import FormField from "../kit/FormField.vue";
import Icon from "../kit/Icon.vue";
import Switch from "../kit/Switch.vue";
import TextArea from "../kit/TextArea.vue";
import TextInput from "../kit/TextInput.vue";

const props = defineProps({draft: {type: Object, required: true}});
const emit = defineEmits(["allowed"]);
const program = ref("");
const own = computed(() => props.draft.kind === "custom");

// Allowing a program the agent proposed is a decision of its own, so the page it sits on saves it at once rather than waiting for the Save below.
function allow(name) {
    allowedProgram(props.draft, name);
    emit("allowed", name);
}

function addProgram() {
    const name = program.value.trim();
    if (name) allowedProgram(props.draft, name);
    program.value = "";
}

const addField = () => props.draft.fields.push({name: "", hidden: true, variable: ""});
const removeField = (index) => props.draft.fields.splice(index, 1);
</script>

<template>
    <div class="secret-form">
        <FormField label="Title" for="secret-title">
            <TextInput id="secret-title" :value="draft.title" placeholder="For example Stripe test key" @input="draft.title = $event.target.value" />
        </FormField>
        <FormField label="Description" for="secret-abstract">
            <TextInput id="secret-abstract" :value="draft.abstract" placeholder="One line" @input="draft.abstract = $event.target.value" />
        </FormField>
        <FormField label="Instructions for the agent" for="secret-brief" help="The agent reads this. It never sees the value itself.">
            <TextArea id="secret-brief" :value="draft.brief" rows="3" @input="draft.brief = $event.target.value" />
        </FormField>
        <FormField label="Fields" help="Each field holds one value. You set the values after saving.">
            <ul class="secret-fields">
                <template v-for="(field, index) in draft.fields" :key="index">
                    <li class="secret-field-line">
                        <template v-if="own">
                            <TextInput :value="field.name" placeholder="Field name" :aria-label="`Name of field ${index + 1}`" class="secret-field-name" @input="field.name = $event.target.value" />
                            <Switch :on="field.hidden" word="Hidden" title="Hide the value while you type it" labelled @change="field.hidden = $event" />
                            <Btn small aria-label="Remove field" @click="removeField(index)"><Icon name="close" :size="12" /></Btn>
                        </template>
                        <template v-else>
                            <b>{{ field.name }}</b>
                            <Chip>{{ field.hidden ? "Hidden" : "Shown while typing" }}</Chip>
                        </template>
                    </li>
                </template>
            </ul>
            <template v-if="own">
                <Btn small @click="addField"><Icon name="plus" :size="12" /> Add a field</Btn>
            </template>
        </FormField>
        <FormField label="Allowed programs" help="The programs that may be given this secret, such as curl or gh. The agent can propose one and you allow it here. With none listed, no program gets the secret.">
            <div class="secret-programs">
                <template v-for="name in draft.programs" :key="name">
                    <Chip removable :label="name" @remove="draft.programs.splice(draft.programs.indexOf(name), 1)">{{ name }}</Chip>
                </template>
            </div>
            <template v-if="draft.proposed && draft.proposed.length">
                <div class="secret-programs">
                    <template v-for="name in draft.proposed" :key="name">
                        <Btn small :aria-label="`Allow ${name}, which the agent proposed`" @click="allow(name)"><Icon name="plus" :size="12" /> Allow {{ name }}</Btn>
                    </template>
                </div>
            </template>
            <form class="secret-program-form" @submit.prevent="addProgram">
                <TextInput :value="program" placeholder="Program name" aria-label="Program name" @input="program = $event.target.value" />
                <Btn small :disabled="!program.trim()" @click="addProgram">Add program</Btn>
            </form>
        </FormField>
        <div class="secret-helpers">
            <Switch :on="draft.helpers" title="Let helpers and subagents use this secret" @change="draft.helpers = $event" />
            <span>Helpers and subagents may use this secret too</span>
        </div>
        <slot />
    </div>
</template>

<style scoped>
.secret-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.secret-fields {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0 0 8px;
    padding: 0;
    list-style: none;
}

.secret-field-line {
    display: flex;
    align-items: center;
    gap: 8px;
}

.secret-field-name {
    flex: 1;
    min-width: 0;
}

.secret-programs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
}

.secret-program-form {
    display: flex;
    gap: 8px;
}

.secret-helpers {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>
