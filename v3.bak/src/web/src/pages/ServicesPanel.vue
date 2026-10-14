<script setup>
import {computed} from "vue";
import SidePanel from "../kit/SidePanel.vue";
import ServicesList from "./ServicesList.vue";
import {ownerTitle} from "../composables/service.js";

const props = defineProps({plugin: {type: String, default: ""}});
const emit = defineEmits(["close"]);

const title = computed(() => (props.plugin ? `${ownerTitle(props.plugin)} services` : "Services"));
const abstract = computed(() =>
    props.plugin ? "What this plugin keeps running." : "The processes the journal and its plugins keep running."
);
</script>

<template>
    <SidePanel :title="title" :abstract="abstract" @close="emit('close')">
        <ServicesList :plugin="plugin" />
    </SidePanel>
</template>
