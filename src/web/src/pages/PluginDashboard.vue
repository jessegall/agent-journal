<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import Dashboard from "../kit/Dashboard.vue";
import SidePanel from "../kit/SidePanel.vue";
import {usePoll} from "../composables/poll.js";
import {route, showFile} from "../route.js";
import {stamp} from "../format/time.js";

const props = defineProps({
    plugin: {type: Object, required: true},
    board: {type: Object, required: true},
    page: {type: String, default: ""},
    settled: {type: Object, default: null},
});
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
            <template v-if="settled">
                <p class="settled" role="status">
                    Marked as {{ settled.how }}<template v-if="settled.at"> on {{ stamp(settled.at) }}</template>. The page below shows it as it was found.
                </p>
            </template>
            <Dashboard :document="document" :page="page" @file="opened" />
        </template>
    </SidePanel>
</template>

<style scoped>
.settled {
    margin: 0 0 14px;
    padding: 8px 10px;
    border-radius: 6px;
    background: color-mix(in srgb, var(--tone-good) 10%, transparent);
    color: var(--text);
    font-size: 12.5px;
}
</style>
