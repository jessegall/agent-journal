<script setup>
import FileName from "../kit/FileName.vue";
import Icon from "../kit/Icon.vue";
import FileTags from "./FileTags.vue";
import FileSource from "./FileSource.vue";

defineProps({file: Object});
const emit = defineEmits(["view"]);
</script>

<template>
    <figure class="tile">
        <a class="tile-img" :href="file.url" :title="`View ${file.name}`" @click.prevent="emit('view')">
            <img :src="file.url" :alt="file.description || file.name" loading="lazy" />
        </a>
        <a class="tile-save" :href="file.url" :download="file.name" :title="`Download ${file.name}`">
            <Icon name="download" :size="13" />
        </a>
        <figcaption>
            <FileTags class="tile-about" :file="file" :lines="2" />
            <FileName class="tile-name" :name="file.name" />
            <FileSource :file="file" />
        </figcaption>
    </figure>
</template>

<style scoped>
.tile {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    margin: 0;
}

.tile-img {
    display: block;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    transition: border-color 0.15s;
}

.tile-img:hover,
.tile-img:focus-visible {
    border-color: var(--accent);
    outline: none;
}

.tile-img img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top left;
}

.tile-save {
    position: absolute;
    top: 8px;
    right: 8px;
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: color-mix(in srgb, var(--bg) 88%, transparent);
    color: var(--text-2);
    opacity: 0;
    transition: opacity 0.15s;
}

.tile:hover .tile-save,
.tile-save:focus-visible {
    opacity: 1;
}

.tile-save:hover {
    color: var(--text);
}

figcaption {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
    padding: 0 2px;
}

figcaption .tile-about {
    color: var(--text);
    font-size: 12.5px;
    line-height: 1.4;
}

.tile-name {
    color: var(--text-4);
    font-size: 11px;
}

@media (hover: none) {
    .tile-save {
        opacity: 1;
    }
}
</style>
