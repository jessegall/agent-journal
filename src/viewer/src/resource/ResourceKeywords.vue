<script setup>
import {computed} from "vue";
import {api} from "../api/client.js";
import {meta} from "../domain/tables.js";
import ResourceBlock from "./ResourceBlock.vue";
import WatchedWords from "./WatchedWords.vue";

const props = defineProps({resource: {type: Object, required: true}});
const noun = computed(() => meta(props.resource.table).title.toLowerCase());
const help = computed(() =>
    props.resource.keywords.length
        ? "Whole words or phrases. Upper or lower case doesn't matter. Press Enter after each one."
        : `With no words, this ${noun.value} is only repeated as the conversation fills up.`
);

const save = (keywords) => api.change(props.resource.table, props.resource.id, {keywords});
</script>

<template>
    <ResourceBlock heading="Keywords">
        <WatchedWords
            :words="resource.keywords"
            :label="`Repeat this ${noun} to the agent when these words come up`"
            :help="help"
            :yes="`The ${noun} would be repeated to the agent.`"
            :no="`The ${noun} would not be repeated.`"
            @words="save"
        />
    </ResourceBlock>
</template>

<style scoped>
.note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
