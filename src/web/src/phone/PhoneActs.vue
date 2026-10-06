<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import ActionSheet from "./kit/ActionSheet.vue";
import FormSheet from "./kit/FormSheet.vue";
import {toast} from "./kit/toast.js";
import {kindTitle} from "./kinds.js";
import {laneQuestion, perform, filled, resultOf} from "./acts.js";

const props = defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["changed", "gone", "share"]);
const form = ref(null);
const choices = ref(null);
const picker = ref(null);
const about = () => `${kindTitle(props.row.type)} ${props.row.n}`;

async function go(action, body, value) {
    try {
        const got = await perform(props.row, action, body);
        const undo = action.undo?.(props.row);
        toast(resultOf(action, props.row, value, got), undo ? () => again(undo) : null);
        emit(action.gone ? "gone" : "changed");
    } catch (error) {
        toast(error.message);
    }
}

async function again(undo) {
    try {
        await api.act(props.row.type, props.row.n, undo.word, undo.body);
        toast(undo.result);
    } catch (error) {
        toast(error.message);
    }
    emit("changed");
}

function ask(action, fields, choice = null) {
    const button = action.button || (action.confirm && !fields.length ? action.label : choice ? "Move" : action.label);
    form.value = {action, choice, button, fields: filled(fields, props.row)};
}

async function list(action) {
    try {
        const got = await action.pick(props.row);
        if (!got.length) return toast(action.empty || "There is nothing to pick from yet.");
        choices.value = {action, actions: got.map((choice) => ({key: String(choice.value), ...choice, run: () => chosen(action, choice)}))};
    } catch (error) {
        toast(error.message);
    }
    return null;
}

function chosen(action, choice) {
    const body = action.name ? {[action.name]: choice.value} : {value: choice.value};
    const question = action.ask ? laneQuestion(choice) : null;
    if (!question) return go(action, body, choice.label);
    return ask({...action, body: {...(action.body || {}), ...body}}, [{key: question.word, label: question.title, required: question.required}], choice);
}

function begin(action) {
    if (action.share) return emit("share");
    if (action.upload) return picker.value.click();
    if (action.pick) return list(action);
    const fields = action.fields || [];
    if (fields.length || action.confirm) return ask(action, fields);
    return go(action, {}, "");
}

const sent = (values) => go(form.value.action, values, form.value.choice?.label || "");

async function attach(event) {
    const files = [...event.target.files];
    event.target.value = "";
    if (!files.length) return;
    try {
        for (const file of files) await api.upload(props.row.type, props.row.n, file);
        toast(files.length === 1 ? `Attached ${files[0].name}` : `Attached ${files.length} files`);
        emit("changed");
    } catch (error) {
        toast(error.message);
    }
}

defineExpose({begin});
</script>

<template>
    <input ref="picker" class="phone-hidden" type="file" multiple aria-label="Files to attach" @change="attach" />
    <template v-if="choices">
        <ActionSheet :title="choices.action.label" :about="about()" line="pick one" :actions="choices.actions" @close="choices = null" />
    </template>
    <template v-if="form">
        <FormSheet
            :title="form.action.label"
            :sub="`${about()} · ${row.title}`"
            :fields="form.fields"
            :button="form.button"
            :danger="Boolean(form.action.danger)"
            @submit="sent"
            @close="form = null"
        />
    </template>
</template>
