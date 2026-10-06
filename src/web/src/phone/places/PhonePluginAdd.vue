<script setup>
import {nextTick, ref} from "vue";
import {api} from "../../api/client.js";
import {pluginRequest} from "../../domain/plugins.js";
import ActionSheet from "../kit/ActionSheet.vue";
import FormSheet from "../kit/FormSheet.vue";
import {toast} from "../kit/toast.js";
import {askAgent} from "./askAgent.js";

const props = defineProps({changed: {type: Function, required: true}});
const emit = defineEmits(["close"]);
const form = ref(null);
let pending = false;

async function install(source) {
    toast("Installing the plugin…");
    try {
        const installed = await api.installPlugin(source);
        toast(typeof installed === "string" ? installed : `Installed ${installed.title || source}`);
    } catch (error) {
        toast(error.message);
    }
    props.changed();
}

async function preview({source}) {
    try {
        const found = await api.previewPlugin(source);
        form.value = {
            title: `Install ${found.title}?`,
            sub: `${found.description || ""} It runs on your computer as you, so install only plugins you trust.`.trim(),
            fields: [],
            button: "Install",
            done: () => install(source),
        };
    } catch (error) {
        toast(error.message);
    }
}

async function make({repository, wish}) {
    try {
        await askAgent(pluginRequest(repository, wish));
        toast("Asked the agent to make the plugin");
    } catch (error) {
        toast(error.message);
    }
}

const ways = [
    {
        key: "install",
        label: "Install a plugin",
        sub: "From owner/repo, a GitHub link or a folder",
        run: () =>
            (form.value = {
                title: "Install a plugin",
                fields: [{key: "source", label: "Where it is", placeholder: "owner/repo, a GitHub link or a folder", required: true}],
                button: "Look at it first",
                done: preview,
            }),
    },
    {
        key: "make",
        label: "Ask the agent to make one",
        sub: "Describe what it should do",
        run: () =>
            (form.value = {
                title: "Ask the agent to make a plugin",
                fields: [
                    {key: "wish", label: "What should the plugin do?", area: true, required: true},
                    {key: "repository", label: "A GitHub repository to build it in", placeholder: "Optional"},
                ],
                button: "Send to the agent",
                done: make,
            }),
    },
];

async function submitted(values) {
    const done = form.value.done;
    form.value = null;
    pending = true;
    await done(values);
    pending = false;
    if (!form.value) emit("close");
}

const closed = () => form.value || pending || emit("close");

const shut = () => nextTick(() => form.value || emit("close"));
</script>

<template>
    <template v-if="form">
        <FormSheet
            :key="form.title"
            :title="form.title"
            :sub="form.sub || ''"
            :fields="form.fields"
            :button="form.button"
            @close="closed"
            @submit="submitted"
        />
    </template>
    <template v-else>
        <ActionSheet title="Add a plugin" about="Plugins" :actions="ways" @close="shut" />
    </template>
</template>
