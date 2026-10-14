<script setup>
import {computed, ref} from "vue";
import {api} from "../../api/client.js";
import {usePoll} from "../../composables/poll.js";
import {ownerTitle} from "../../composables/service.js";
import {isRunning, stateWord} from "../../domain/services.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import EmptyList from "../kit/EmptyList.vue";

const EVERY = 2000;
const emit = defineEmits(["open"]);
const all = ref(null);
usePoll(
    "phone-services",
    () => api.services(),
    EVERY,
    (got) => (all.value = got || [])
);
const owners = computed(() => [...new Set((all.value || []).map((s) => s.plugin))]);
const of = (owner) => all.value.filter((s) => s.plugin === owner);
const dotOf = (s) => (isRunning(s) ? "done" : s.state === "failed" || s.state === "blocked" ? "failed" : "");
</script>

<template>
    <template v-if="all && !all.length">
        <EmptyList icon="play" title="Nothing runs yet" reason="No plugin or feature on this project declares a service." />
    </template>
    <template v-for="owner in owners" :key="owner">
        <CellGroup :head="ownerTitle(owner)">
            <template v-for="s in of(owner)" :key="s.id">
                <Cell :label="s.service" :sub="s.why" :count="stateWord(s)" :hot="dotOf(s) === 'failed'" @pick="emit('open', `service:${s.id}`)" />
            </template>
        </CellGroup>
    </template>
</template>
