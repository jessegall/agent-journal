<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import {phone} from "../../api/phone.js";
import {counted} from "../../format/number.js";
import {plainDoing} from "../doing.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import EmptyList from "../kit/EmptyList.vue";
import PlaceScreen from "../kit/PlaceScreen.vue";
import {toast} from "../kit/toast.js";
import PhonePlaces from "../PhonePlaces.vue";
import {needsOf, waitingCount, waitsOf} from "./journals.js";

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "moved", "switching", "stayed"]);
const places = ref(null);
const at = ref("");
const failed = ref("");
const opening = ref(null);
const environment = api.env();
const needs = computed(() => (places.value || []).reduce((sum, place) => sum + needsOf(place), 0));
const sub = computed(() =>
    [
        `${counted((places.value || []).length, "journal")}, ${(places.value || []).filter((place) => place.running).length} running`,
        needs.value ? `${needs.value} need you` : "",
    ]
        .filter(Boolean)
        .join(" · ")
);
const here = (place, name) => place.root === at.value && name === environment;
const headOf = (place) => (needsOf(place) ? `${place.project} · ${needsOf(place)} need you` : place.project);

function subOf(place, name) {
    const detail = place.details?.[name];
    return [
        here(place, name) ? "Current" : "",
        place.working.includes(name) ? "Agent running" : "No agent running",
        detail?.doing ? plainDoing(detail.doing) : "",
        waitsOf(detail),
    ]
        .filter(Boolean)
        .join(" · ");
}

async function load() {
    try {
        const got = await phone.places();
        places.value = got.places;
        at.value = got.at;
    } catch (error) {
        failed.value = error.message;
    }
}

async function forget(place) {
    try {
        await api.forgetJournal(place.root);
        toast(`Removed ${place.project} from the list until its viewer runs again`);
        await load();
    } catch (error) {
        toast(error.message);
    }
}

onMounted(load);
</script>

<template>
    <PlaceScreen title="Journals" :sub="places ? sub : 'On this computer'" :back="back" @back="emit('back')">
        <template v-if="failed">
            <EmptyList icon="warn" title="The journals did not load" :reason="failed" action="Try again" @act="((failed = ''), load())" />
        </template>
        <template v-for="place in places || []" :key="place.root">
            <CellGroup :head="headOf(place)" :line="place.running ? place.root : 'Stopped. Its viewer is not running.'">
                <template v-for="name in place.environments" :key="name">
                    <Cell
                        :label="name"
                        :sub="subOf(place, name)"
                        icon="branch"
                        :count="waitingCount(place.details?.[name]) || ''"
                        :hot="Boolean(waitingCount(place.details?.[name]))"
                        @pick="opening = {root: place.root, name}"
                    />
                </template>
                <template v-if="!place.running && place.root !== at">
                    <Cell
                        label="Remove from the list"
                        sub="Comes back when its viewer runs again"
                        icon="close"
                        :chevron="false"
                        @pick="forget(place)"
                    />
                </template>
            </CellGroup>
        </template>
    </PlaceScreen>
    <template v-if="opening">
        <PhonePlaces
            :environment="environment"
            :opening="opening"
            @close="opening = null"
            @switching="emit('switching')"
            @stayed="emit('stayed')"
            @moved="emit('moved')"
        />
    </template>
</template>
