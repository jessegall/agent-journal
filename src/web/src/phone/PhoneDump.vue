<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {earlierDumps} from "../composables/dump.js";
import {pollKey, usePoll} from "../composables/poll.js";
import CellGroup from "./kit/CellGroup.vue";
import EmptyList from "./kit/EmptyList.vue";
import PlaceScreen from "./kit/PlaceScreen.vue";
import PhoneDumpStart from "./PhoneDumpStart.vue";
import PhoneDumpWork from "./PhoneDumpWork.vue";
import Skeleton from "../kit/Skeleton.vue";

const DUMPS_EVERY = 3000;
const DUMPS_KEPT = 20;
const START = "Send many files at once. The agent sorts them by subject and files each into a new collection.";

const props = defineProps({target: {type: String, required: true}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open"]);
const listed = ref(null);
const selected = ref(Number(props.target) || 0);
const every = computed(() => (listed.value || []).filter((d) => !d.deleted));
const shown = computed(() => every.value.find((d) => d.n === selected.value) || null);
const title = computed(() => (selected.value ? shown.value?.title || `Dump ${selected.value}` : "New dump"));
const sub = computed(() => {
    if (!selected.value) return START;
    return title.value === `Dump ${selected.value}` ? "" : `Dump ${selected.value}`;
});
const refresh = usePoll(
    pollKey(),
    () => api.list("dump", {last: DUMPS_KEPT, completed: true}),
    DUMPS_EVERY,
    (got) => (listed.value = got.rows)
);

function started(row) {
    listed.value = [row, ...(listed.value || [])];
    selected.value = row.n;
    refresh();
}
</script>

<template>
    <PlaceScreen :title="title" :sub="sub" :back="back" @back="emit('back')">
        <template v-if="!selected">
            <PhoneDumpStart :earlier="earlierDumps(every)" @started="started" @pick="(n) => (selected = n)" />
        </template>
        <template v-else-if="shown">
            <PhoneDumpWork :every="every" :n="selected" @open="(ref) => emit('open', ref)" @changed="refresh" />
        </template>
        <template v-else-if="listed">
            <EmptyList
                icon="inbox"
                :title="`Dump ${selected} is not here`"
                reason="It was removed, or it belongs to another environment."
            />
        </template>
        <template v-else>
            <CellGroup><Skeleton :count="4" /></CellGroup>
        </template>
    </PlaceScreen>
</template>
