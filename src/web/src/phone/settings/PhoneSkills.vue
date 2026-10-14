<script setup>
import Cell from "../kit/Cell.vue";
import ListScreen from "../kit/ListScreen.vue";
import {api} from "../../api/client.js";

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open"]);
const empty = {icon: "book", title: "No skills", reason: "Skills are instructions the agent can load.", action: ""};

const load = async () => ({rows: (await api.skills(0)).map((skill, i) => ({...skill, n: i + 1, title: skill.name})), more: false});
const stateOf = (skill) => (skill.stale ? "Changed" : skill.loaded ? "Loaded" : "");
</script>

<template>
    <ListScreen title="Skills" intro="Instructions the agent loads when a job needs them." :back="back" :load="load" :empty="empty" :words-of="(row) => `${row.name} ${row.description}`" @back="emit('back')">
        <template #row="{row}">
            <Cell :label="row.name" :sub="row.description" :count="row.always ? 'At start' : stateOf(row)" @pick="emit('open', `skillview:${row.name}`)" />
        </template>
    </ListScreen>
</template>
