<script setup>
import EmptyState from "./EmptyState.vue";
import SwitchCase from "./SwitchCase.vue";
import {useFileContent} from "../composables/fileContent.js";

const props = defineProps({name: {type: String, required: true}, url: {type: String, required: true}, text: {type: String, default: null}});
const content = useFileContent(() => ({name: props.name, url: props.url, text: props.text}));
</script>

<template>
    <figure class="file-view">
        <SwitchCase :value="content.kind">
            <template #picture>
                <div class="picture">
                    <img :src="url" :alt="name" />
                </div>
            </template>
            <template #text>
                <slot name="text" :text="content.text">
                    <pre class="text">{{ content.text }}</pre>
                </slot>
            </template>
            <template #other>
                <p class="note">
                    {{ name }} is not text or a picture, so it is not shown here.
                    <a :href="url" :download="name">Download {{ name }}</a>
                </p>
            </template>
            <template #failed>
                <p class="note">{{ content.text }}</p>
            </template>
            <template #default>
                <EmptyState loading />
            </template>
        </SwitchCase>
        <figcaption class="name">{{ name }}</figcaption>
    </figure>
</template>

<style scoped>
.file-view {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    min-height: 0;
    max-height: 100%;
    margin: 0;
}

.picture {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    min-height: 0;
}

.picture img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
}

.text {
    flex: 1;
    min-height: 0;
    margin: 0;
    padding: 12px 14px;
    overflow: auto;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--code-bg);
    color: var(--text);
    font: 12px/1.55 var(--mono);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.note {
    margin: 0;
    padding: 18px;
    color: var(--text-3);
    font-size: 12.5px;
}

.note a {
    display: block;
    margin-top: 6px;
}

.name {
    flex: none;
    overflow: hidden;
    color: var(--text-2);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
