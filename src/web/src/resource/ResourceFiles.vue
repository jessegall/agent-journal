<script setup>
import {computed, inject} from "vue";
import {api} from "../api/client.js";
import Icon from "../kit/Icon.vue";
import ResourceBlock from "./ResourceBlock.vue";
import {openPictures} from "../platform/view.js";

const props = defineProps({resource: {type: Object, required: true}, files: {type: Array, required: true}});
const fileUrl = inject("fileUrl", (type, n, name) => api.fileUrl(type, n, name));
const PICTURE = /\.(png|jpe?g|gif|webp)$/i;
const pictures = computed(() =>
    props.files.filter(([name]) => PICTURE.test(name)).map(([name]) => ({name, url: fileUrl(props.resource.type, props.resource.n, name)}))
);
const showPicture = (name) =>
    openPictures(
        pictures.value,
        pictures.value.findIndex((p) => p.name === name)
    );
</script>

<template>
    <ResourceBlock heading="Files">
        <template v-for="[name, description] in files" :key="name">
            <a class="file" :href="fileUrl(resource.type, resource.n, name)" target="_blank" :title="name">
                <Icon name="clip" :size="13" />
                <span class="file-text">
                    <span class="file-name">{{ name }}</span>
                    <template v-if="description">
                        <span class="description">{{ description }}</span>
                    </template>
                </span>
            </a>
            <template v-if="PICTURE.test(name)">
                <button type="button" class="file-preview" :title="`Show ${name}`" @click="showPicture(name)">
                    <img :src="fileUrl(resource.type, resource.n, name)" :alt="name" loading="lazy" />
                </button>
            </template>
        </template>
    </ResourceBlock>
</template>

<style scoped>
.file {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    padding: 3px 0;
    color: var(--accent-text);
}

.file-preview {
    display: block;
    margin: 2px 0 8px 19px;
    padding: 0;
    overflow: hidden;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--raised);
    cursor: zoom-in;
}

.file-preview img {
    display: block;
    max-width: 220px;
    max-height: 140px;
    object-fit: cover;
}

.file-preview:hover {
    border-color: var(--border-3);
}

.file .ico {
    flex-shrink: 0;
    margin-top: 2px;
}

.file-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.file-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.description {
    color: var(--text-3);
    font-size: 12px;
}
</style>
