<script setup>
import {ref} from "vue";
import {pluginFrom} from "../../composables/plugins.js";
import {pluginRequest} from "../../domain/plugins.js";
import {usePluginInstall} from "../../composables/pluginInstall.js";
import ActionSheet from "../kit/ActionSheet.vue";
import Button from "../kit/Button.vue";
import Cell from "../kit/Cell.vue";
import ListScreen from "../kit/ListScreen.vue";
import {newestFirst} from "../kit/listed.js";
import {toast} from "../kit/toast.js";
import {hold} from "../outbox.js";
import FormSheet from "../kit/FormSheet.vue";
import PhonePluginPreview from "./PhonePluginPreview.vue";

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open"]);
const list = ref(null);
const adding = ref(false);
const asking = ref("");
const source = ref("");
const busy = ref("");

const {previewText, previewed, outcome, live, preview, install, closePreview} = usePluginInstall(busy, () => list.value.reload());
const load = newestFirst("plugin");
const empty = {icon: "plug", title: "No plugins installed", reason: "A plugin adds pages, settings and services to the journal.", action: "Add a plugin"};

const ADDING = [
    {key: "install", label: "Install a plugin", sub: "From owner/repo, a GitHub link or a folder", run: () => (asking.value = "install")},
    {key: "guide", label: "Read how to make one", sub: "The plugin guide", run: () => emit("open", "guide:plugin")},
    {key: "make", label: "Make a plugin", sub: "Describe it and the agent builds it", run: () => (asking.value = "make")},
];

async function check(text) {
    source.value = text;
    await preview(text);
    if (previewText.value) toast(previewText.value);
}

function make(wish) {
    hold(pluginRequest("", wish), "");
    toast("Sent to the agent");
}
</script>

<template>
    <ListScreen ref="list" title="Plugins" intro="Installed plugins, with their pages and settings." :back="back" :load="load" :empty="empty" @back="emit('back')" @act="adding = true">
        <template #row="{row}">
            <Cell :label="row.title" :sub="pluginFrom(row).description" :count="pluginFrom(row).enabled ? pluginFrom(row).version : 'Off'" @pick="emit('open', `plugin:${row.n}`)" />
        </template>
        <template #foot>
            <Button fill @click="adding = true">Add a plugin</Button>
        </template>
    </ListScreen>
    <template v-if="adding">
        <ActionSheet title="Add a plugin" about="Plugins" :actions="ADDING" @close="adding = false" />
    </template>
    <template v-if="asking === 'install'">
        <FormSheet
            title="Install a plugin"
            sub="You see every command it would run before anything runs."
            :fields="[{key: 'source', label: 'Where it comes from', placeholder: 'owner/repo, a GitHub link or a folder', required: true, verbatim: true}]"
            button="Check before installing"
            @close="asking = ''"
            @submit="(got) => check(got.source)"
        />
    </template>
    <template v-if="asking === 'make'">
        <FormSheet
            title="Make a plugin"
            sub="The agent builds it and tells you when it is ready."
            :fields="[{key: 'wish', label: 'What should the plugin do?', placeholder: 'Describe it in a few lines', required: true, area: true}]"
            button="Send to the agent"
            @close="asking = ''"
            @submit="(got) => make(got.wish)"
        />
    </template>
    <template v-if="previewed">
        <PhonePluginPreview
            :previewed="previewed"
            :outcome="outcome"
            :live="live"
            :busy="busy"
            @close="closePreview"
            @install="install(source)"
        />
    </template>
</template>
