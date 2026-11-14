<script setup>
import {CreateDialog, TextList, useWindow} from "@journal/window-kit";
import {checkTemplate, editTemplateCommand, editTemplateLine, newTemplateCommand, newTemplateLine, templateFields} from "./templateForms.js";

// the New template dialog, and with a template given the Edit dialog of a template the user made: its title, description, kind, purpose, parts and phase end commands.
// New runs journal template make and Edit runs journal template edit
const props = defineProps({template: {type: Object, default: null}});
const emit = defineEmits(["close"]);
const view = useWindow();
const run = (values) => view.run(props.template ? editTemplateLine(props.template, values) : newTemplateLine(values));
</script>

<template>
    <CreateDialog :title="template ? `Edit ${template.title}` : 'New template'" :submit="template ? 'Save the template' : 'Make the template'" :fields="templateFields(template)" :command="template ? editTemplateCommand(template) : newTemplateCommand" :check="checkTemplate" :run="run" @close="emit('close')">
        <template #parts="{value, set}">
            <TextList :items="value" kind="part" noun="Part" placeholder="Brief: what the plan is for, {goal}" add-label="Add a part" @items="set" />
        </template>
        <template #commands="{value, set}">
            <TextList :items="value" kind="command" noun="Command" placeholder="pytest tests -q" add-label="Add a command" :keep-one="false" @items="set" />
        </template>
    </CreateDialog>
</template>
