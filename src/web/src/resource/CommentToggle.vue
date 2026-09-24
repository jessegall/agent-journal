<script setup>
import {inject} from "vue";
import SideToggle from "./SideToggle.vue";

const props = defineProps({resource: {type: Object, default: null}});
const talk = inject("talk", null);
const system = () => Boolean(props.resource && props.resource.data && props.resource.data.system);
</script>

<template>
    <template v-if="talk && !system()">
        <SideToggle mode="comments" icon="bubble" label="Comments" :count="talk.count.value" />
    </template>
</template>
