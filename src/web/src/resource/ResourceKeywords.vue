<script setup>
import {computed} from "vue";
import {api} from "../api/client.js";
import KeywordList from "./KeywordList.vue";
import ResourceBlock from "./ResourceBlock.vue";

const props = defineProps({resource: {type: Object, required: true}, keywords: {type: Array, required: true}});
const SCOPES = [
    ["text", "Text", "What the agent writes: edits and chat"],
    ["commands", "Commands", "Shell commands"],
    ["both", "Both", "Shell commands, edits and chat"],
    ["everything", "Everything", "Any tool call, file paths, searches and URLs included"],
];
const scope = computed(() => props.resource.data.keywords_in || "both");
const matchIn = (value) => api.act(props.resource.type, props.resource.n, "set", {key: "keywords_in", value});
</script>

<template>
    <ResourceBlock heading="Keywords">
        <p class="lead">Said to the agent when one of these words comes up in what it is about to run or write.</p>
        <KeywordList :words="keywords" />
        <div class="scopes">
            <span class="scopes-label">Matched in</span>
            <template v-for="[value, name, hint] in SCOPES" :key="value">
                <button type="button" :class="['scope', {on: scope === value}]" :title="hint" @click="matchIn(value)">
                    {{ name }}
                </button>
            </template>
        </div>
    </ResourceBlock>
</template>

<style scoped>
.lead {
    margin: 0 0 8px;
    color: var(--text-4);
    font-size: 12px;
}

.scopes {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
}

.scopes-label {
    margin-right: 4px;
    color: var(--text-3);
    font-size: 12px;
}

.scope {
    padding: 2px 8px;
    border: 1px solid transparent;
    border-radius: 99px;
    background: none;
    color: var(--text-3);
    font-size: 12px;
    cursor: pointer;
}

.scope:hover {
    color: var(--text-2);
}

.scope.on {
    border-color: var(--border-2);
    background: var(--raised);
    color: var(--text);
}
</style>
