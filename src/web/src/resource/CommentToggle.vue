<script setup>
import {inject} from "vue";
import SideToggle from "./SideToggle.vue";

const props = defineProps({resource: {type: Object, default: null}});
const talk = inject("talk", null);
const system = () => Boolean(props.resource && props.resource.data && props.resource.data.system);
</script>

<template>
    <template v-if="talk && !system()">
        <template v-if="talk.running.value">
            <SideToggle mode="running" icon="play" label="Being written" />
        </template>
        <SideToggle
            mode="comments"
            icon="bubble"
            label="Comments"
            :count="talk.count.value"
            :off="talk.running.value ? 'Comments open when the agent has finished writing' : ''"
        />
    </template>
</template>
