<script setup>
import {ref} from "vue";
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
const document = ref(null);
usePoll("plugin.dashboard", {params: () => ({plugin: props.plugin.id, board: props.board.name}), take: (got) => (document.value = got)});
const opened = (file) => showFile(file.path, file.line || 0);
</script>

<template>
    <SidePanel :title="board.title" :abstract="plugin.title" width="page" @close="emit('close')">
        <template v-if="document">
            <template v-if="settled">
                <p class="settled" role="status">
                    Marked as {{ settled.how }}<template v-if="settled.time"> on {{ stamp(settled.time) }}</template>. The page below shows it as it was found.
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
