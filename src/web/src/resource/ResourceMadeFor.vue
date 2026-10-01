<script setup>
import {computed} from "vue";
import KeywordList from "./KeywordList.vue";
import ResourceBlock from "./ResourceBlock.vue";
import {meta} from "../state/store.js";

const props = defineProps({types: {type: Array, required: true}});
const words = computed(() =>
    props.types.length ? props.types.map((type) => (meta(type) ? meta(type).title : type)) : ["any kind of row"]
);
</script>

<template>
    <ResourceBlock heading="Made for">
        <KeywordList :words="words" />
    </ResourceBlock>
</template>
