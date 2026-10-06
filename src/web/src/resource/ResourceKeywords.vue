<script setup>
import {computed} from "vue";
import {api} from "../api/client.js";
import {KEYWORD_WHERE} from "../domain/triggerWords.js";
import {href, route} from "../route.js";
import ResourceBlock from "./ResourceBlock.vue";
import WatchedWords from "./WatchedWords.vue";

const props = defineProps({resource: {type: Object, required: true}});
const noun = computed(() => props.resource.type);
const words = computed(() => (Array.isArray(props.resource.data.keywords) ? props.resource.data.keywords : []));
const closed = computed(() => Boolean(props.resource.completed));
const help = computed(() =>
    words.value.length
        ? "Whole words or phrases. Upper or lower case doesn't matter. Press Enter after each one."
        : `With no words, this ${noun.value} is only repeated as the agent's context fills.`
);

const save = (words) => api.act(noun.value, props.resource.n, "update", {keywords: words});
const matchIn = (value) => api.act(noun.value, props.resource.n, "set", {key: "keywords_in", value});
</script>

<template>
    <ResourceBlock heading="Keywords">
        <WatchedWords
            :words="words"
            :words-in="resource.data.keywords_in || 'both'"
            :scopes="KEYWORD_WHERE"
            :readonly="closed"
            :label="`Repeat this ${noun} to the agent when these words come up`"
            :help="help"
            :yes="`The ${noun} would be repeated to the agent.`"
            :no="`The ${noun} would not be repeated.`"
            @words="save"
            @where="matchIn"
        >
            <p class="note">Your own messages never count here: a {{ noun }} is repeated to the agent while it works.</p>
            <p class="note">
                How often it is repeated is a setting.
                <a :href="href.page(route.env, 'settings')">Open Settings</a>
            </p>
        </WatchedWords>
    </ResourceBlock>
</template>

<style scoped>
.note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
