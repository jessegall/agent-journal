<script setup>
import {ref} from "vue";
import {api} from "../../api/client.js";
import {usePoll} from "../../composables/poll.js";
import Dashboard from "../../kit/Dashboard.vue";
import PhonePage from "./PhonePage.vue";

const REFRESH_EVERY = 10000;
const props = defineProps({target: {type: String, required: true}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
const [n, name] = props.target.split("|");
const document = ref(null);
usePoll(
    `phone-dashboard-${props.target}`,
    () => api.pluginDashboard(n, name),
    REFRESH_EVERY,
    (got) => (document.value = got)
);
</script>

<template>
    <PhonePage :title="document ? document.title || name : name" line="Updates by itself." :back="back" @back="emit('back')">
        <template v-if="document">
            <Dashboard :document="document" />
        </template>
    </PhonePage>
</template>
