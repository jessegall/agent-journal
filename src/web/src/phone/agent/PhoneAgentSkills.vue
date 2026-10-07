<script setup>
import {computed} from "vue";
import {loadedSkills} from "../../domain/agents.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import EmptyList from "../kit/EmptyList.vue";
import PhonePage from "../settings/PhonePage.vue";
import PhoneNoAgent from "./PhoneNoAgent.vue";
import {useLeadAgent} from "./lead.js";

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open"]);
const {data, loaded} = useLeadAgent();
const skills = computed(() => loadedSkills(data.value));
</script>

<template>
    <PhonePage title="Skills loaded" line="Loaded in the current conversation, newest last. Shortening the conversation unloads them." :back="back" @back="emit('back')">
        <template v-if="loaded && !data">
            <PhoneNoAgent />
        </template>
        <template v-else-if="loaded && !skills.length">
            <EmptyList icon="book" title="No skill is loaded" reason="The agent is working from memory." />
        </template>
        <template v-else>
            <CellGroup>
                <template v-for="name in skills" :key="name">
                    <Cell icon="book" :label="name" @pick="emit('open', `skillview:${name}`)" />
                </template>
            </CellGroup>
        </template>
        <CellGroup>
            <Cell label="Every skill" sub="Read any skill, and choose which load at every start" @pick="emit('open', 'skills:')" />
        </CellGroup>
    </PhonePage>
</template>
