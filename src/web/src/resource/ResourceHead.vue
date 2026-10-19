<script setup>
import {MENUED} from "../domain/tables.js";
import {computed} from "vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import BeingWritten from "./BeingWritten.vue";
import Chapters from "./Chapters.vue";
import ResourceMenu from "./ResourceMenu.vue";
import {age} from "../format/time.js";
import {createdAt, sectionsOf, titleOf} from "../domain/row.js";

const props = defineProps({
    resource: {type: Object, required: true},
    kind: {type: Object, required: true},
    writing: {type: Object, default: null},
    readOnly: {type: Boolean, default: false},
    editing: {type: Boolean, default: false},
    body: {default: null},
});
const emit = defineEmits(["close", "follow"]);
const sections = computed(() => sectionsOf(props.resource.body));
const chaptered = computed(() => props.kind.view === "document" && sections.value.length >= 2);
</script>

<template>
    <header class="head">
        <div class="top">
            <span class="kind">
                <Icon :name="kind.icon" :size="13" />
                {{ kind.title }} {{ resource.id }}
            </span>
            <template v-if="resource.state">
                <span :class="['standing', resource.state]">{{ resource.state }}</span>
            </template>
            <span class="age">{{ age(createdAt(resource)) }}</span>
            <slot name="tools" />
            <template v-if="!readOnly">
                <template v-if="MENUED.includes(resource.table)">
                    <ResourceMenu :resource="resource" @gone="emit('close')" />
                </template>
                <CloseButton :title="`Close the ${kind.title.toLowerCase()}`" @click="emit('close')" />
            </template>
        </div>
        <template v-if="writing && !readOnly">
            <BeingWritten :writing="writing" @follow="emit('follow')" />
        </template>
        <template v-if="!editing">
            <h2 class="title">{{ titleOf(resource) }}</h2>
            <template v-if="chaptered">
                <Chapters :sections="sections" :body="body" />
            </template>
        </template>
    </header>
</template>

<style scoped>
.from {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 5px;
    margin-top: 6px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font-size: 12px;
    cursor: pointer;
}

.from:hover {
    color: var(--text);
}

.head {
    position: sticky;
    top: 0;
    z-index: 2;
    margin: -16px -16px 0;
    padding: 16px 16px 8px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
}

.top {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-3);
    font-size: 11.5px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.kind {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    color: var(--accent-text);
}

.age {
    flex: 1 0 auto;
    white-space: nowrap;
}

.standing {
    flex: none;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0 7px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    color: var(--text-2);
    font: inherit;
    font-size: 10.5px;
    line-height: 17px;
    letter-spacing: 0;
    text-transform: none;
    background: none;
}

.standing.draft {
    border-style: dashed;
    color: var(--text-3);
}

.standing.replaced {
    cursor: pointer;
}

.standing.replaced:hover {
    border-color: var(--accent);
    color: var(--accent-text);
}

.title {
    margin: 10px 0 0;
    font-size: 19px;
    font-weight: 600;
    line-height: 1.3;
}

.edit-title {
    width: 100%;
    margin: 10px 0 0;
    padding: 6px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--raised);
    font-size: 17px;
    font-weight: 600;
}
</style>
