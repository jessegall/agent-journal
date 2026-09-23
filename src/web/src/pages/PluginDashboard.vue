<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import Dashboard from "../kit/Dashboard.vue";
import SidePanel from "../kit/SidePanel.vue";
import {usePoll} from "../poll.js";
import {route, showFile} from "../route.js";

const props = defineProps({plugin: {type: Object, required: true}, board: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const REFRESH_EVERY = 10000;
const document = ref(null);
usePoll(
    `dashboard-${props.plugin.n}-${props.board.name}`,
    () => api.pluginDashboard(props.plugin.n, props.board.name),
    REFRESH_EVERY,
    (got) => (document.value = got)
);
const opened = (file) => showFile(route.value.env, file.path, file.line || 0);
</script>

<template>
    <SidePanel :title="board.title" :abstract="plugin.title" width="page" @close="emit('close')">
        <template v-if="document">
            <Dashboard :document="document" @file="opened" />
        </template>
    </SidePanel>
</template>
